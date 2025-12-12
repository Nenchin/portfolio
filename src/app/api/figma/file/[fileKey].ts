// "use client";

// import type { NextApiRequest, NextApiResponse } from 'next';

// const FIGMA_BASE = 'https://api.figma.com/v1';
// const TOKEN = process.env.FIGMA_API_TOKEN;

// if (!TOKEN) {
//   console.warn('FIGMA_API_TOKEN is not set. Set it in your environment.');
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { fileKey } = req.query;
//   if (!fileKey || Array.isArray(fileKey)) {
//     return res.status(400).json({ ok: false, error: 'fileKey is required' });
//   }

//   try {
//     const resp = await fetch(`${FIGMA_BASE}/files/${encodeURIComponent(fileKey)}`, {
//       headers: { 'X-Figma-Token': TOKEN ?? '' }
//     });

//     if (!resp.ok) {
//       const body = await resp.text();
//       return res.status(resp.status).json({ ok: false, status: resp.status, error: body });
//     }

//     const data = await resp.json();

//     // Extract frames/components/instances - simple recursive walker
//     const frames: { id: string; name: string; type: string; page?: string }[] = [];
//     function walk(node: any, pageName?: string) {
//       if (!node) return;
//       if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE' || node.type === 'GROUP') {
//         frames.push({ id: node.id, name: node.name, type: node.type, page: pageName });
//       }
//       if (node.children && Array.isArray(node.children)) {
//         node.children.forEach((c: any) => walk(c, pageName));
//       }
//     }

//     if (data.document && Array.isArray(data.document.children)) {
//       data.document.children.forEach((page: any) => {
//         const pageName = page.name;
//         if (page.children) page.children.forEach((c: any) => walk(c, pageName));
//       });
//     }

//     // Return a compact set for the frontend (id + name + type + page)
//     return res.status(200).json({ ok: true, frames });
//   } catch (err: any) {
//     console.error('figma/file error', err);
//     return res.status(500).json({ ok: false, error: err?.message || String(err) });
//   }
// }
