import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const FIGMA_BASE = 'https://api.figma.com/v1';
const TOKEN = process.env.FIGMA_TOKEN;
if (!TOKEN) console.warn('FIGMA_TOKEN not set');

type CacheEntry<T> = { ts: number; value: T };
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes
const cache: Record<string, CacheEntry<any>> = {};

// small concurrency helper to limit parallel requests to avoid hitting rate limits
async function pMap<T, R>(items: T[], mapper: (item: T) => Promise<R>, concurrency = 4) {
  const results: R[] = [];
  const executing: Promise<void>[] = [];
  for (const item of items) {
    const p = (async () => {
      const r = await mapper(item);
      results.push(r);
    })();
    executing.push(p);
    if (executing.length >= concurrency) {
      await Promise.race(executing);
      // remove settled promises
      for (let i = executing.length - 1; i >= 0; i--) {
        if ((executing[i] as any).settled) executing.splice(i, 1);
      }
    }
    // mark when the promise resolves (so we can detect settled ones)
    p.then(() => ((p as any).settled = true), () => ((p as any).settled = true));
  }
  await Promise.all(executing);
  return results;
}

async function fetchJson(url: string) {
  const resp = await fetch(url, { headers: { 'X-Figma-Token': TOKEN ?? '' } });
  const text = await resp.text();
  try {
    return { ok: resp.ok, status: resp.status, json: JSON.parse(text) };
  } catch {
    return { ok: resp.ok, status: resp.status, json: text };
  }
}

export async function GET(req: NextRequest, { params }: { params: { teamId?: string } }) {
  const teamId = params.teamId;
  if (!teamId) return NextResponse.json({ ok: false, error: 'teamId required' }, { status: 400 });

  // cache key per team
  const cacheKey = `figma:team:${teamId}`;
  const now = Date.now();
  if (cache[cacheKey] && (now - cache[cacheKey].ts) < CACHE_TTL) {
    return NextResponse.json({ ok: true, cached: true, data: cache[cacheKey].value });
  }

  try {
    // 1) list projects in team
    const projectsResp = await fetchJson(`${FIGMA_BASE}/teams/${encodeURIComponent(teamId)}/projects`);
    if (!projectsResp.ok) {
      return NextResponse.json({ ok: false, error: projectsResp.json, status: projectsResp.status }, { status: projectsResp.status });
    }
    const projects: any[] = (projectsResp.json?.projects) || [];

    // 2) for each project list files
    // map each project -> array of files
    const projectFiles = await Promise.all(
      projects.map(async (proj) => {
        const projId = proj.id;
        const filesResp = await fetchJson(`${FIGMA_BASE}/projects/${encodeURIComponent(projId)}/files`);
        const files = filesResp.ok ? (filesResp.json.files || []) : [];
        return { project: proj, files };
      })
    );

    // 3) flatten files and for each file fetch its document (to pick a frame) and the image url
    const fileEntries = projectFiles.flatMap((pf) =>
      (pf.files || []).map((f: any) => ({
        projectId: pf.project.id,
        projectName: pf.project.name,
        fileKey: f.key,
        fileName: f.name,
        figmaUrl: `https://www.figma.com/file/${f.key}/${encodeURIComponent(f.name)}`,
      }))
    );

    // Limit concurrency while fetching file documents and images
    const results = await pMap(
      fileEntries,
      async (fileEntry) => {
        try {
          // get file document to find a frame node id
          const fileDocResp = await fetchJson(`${FIGMA_BASE}/files/${encodeURIComponent(fileEntry.fileKey)}`);
          if (!fileDocResp.ok) {
            return { ...fileEntry, error: fileDocResp.json || 'failed to fetch file' };
          }
          const doc = fileDocResp.json.document;
          // find first FRAME node (depth-first)
          let frameId: string | null = null;
          function walk(node: any) {
            if (!node || frameId) return;
            if (node.type === 'FRAME' && node.visible !== false) {
              frameId = node.id;
              return;
            }
            if (Array.isArray(node.children)) node.children.forEach(w => walk(w));
          }
          if (doc && Array.isArray(doc.children)) {
            for (const page of doc.children) {
              walk(page);
              if (frameId) break;
            }
          }
          if (!frameId) {
            return { ...fileEntry, previewUrl: null, note: 'no frame found' };
          }

          // get image url for that frame
          const imagesResp = await fetchJson(`${FIGMA_BASE}/images/${encodeURIComponent(fileEntry.fileKey)}?ids=${encodeURIComponent(frameId)}&format=png&scale=2`);
          if (!imagesResp.ok) {
            return { ...fileEntry, frameId, error: imagesResp.json || 'failed to fetch image' };
          }
          const imagesMap = imagesResp.json.images || {};
          const previewUrl = imagesMap[frameId] || null;
          return { ...fileEntry, frameId, previewUrl };
        } catch (err: any) {
          return { ...fileEntry, error: err?.message || String(err) };
        }
      },
      4 // concurrency
    );

    // Save to cache
    cache[cacheKey] = { ts: Date.now(), value: results };

    return NextResponse.json({ ok: true, data: results });
  } catch (err: any) {
    console.error('FIGMA TEAM ERROR', err);
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
