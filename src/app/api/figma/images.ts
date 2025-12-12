// "use client";

// import type { NextApiRequest, NextApiResponse } from 'next';

// const FIGMA_BASE = 'https://api.figma.com/v1';
// const TOKEN = process.env.FIGMA_API_TOKEN;

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

//   const { fileKey, ids, format = 'png', scale = 1 } = req.body || {};
//   if (!fileKey || !Array.isArray(ids) || ids.length === 0) {
//     return res.status(400).json({ ok: false, error: 'fileKey and ids[] are required' });
//   }

//   const idsParam = ids.join(',');

//   try {
//     const url = new URL(`${FIGMA_BASE}/images/${encodeURIComponent(fileKey)}`);
//     url.searchParams.set('ids', idsParam);
//     url.searchParams.set('format', format);
//     url.searchParams.set('scale', String(scale));

//     const resp = await fetch(url.toString(), {
//       headers: { 'X-Figma-Token': TOKEN ?? '' }
//     });

//     const json = await resp.json();
//     if (!resp.ok) {
//       return res.status(resp.status).json({ ok: false, error: json });
//     }

//     // json.images is a map { nodeId: imageUrl }
//     return res.status(200).json({ ok: true, images: json.images });
//   } catch (err: any) {
//     console.error('figma/images error', err);
//     return res.status(500).json({ ok: false, error: err?.message || String(err) });
//   }
// }
