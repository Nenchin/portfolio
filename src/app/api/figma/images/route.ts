"use client";

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const FIGMA_BASE = 'https://api.figma.com/v1';
const TOKEN = process.env.FIGMA_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileKey, ids, format = 'png', scale = 1 } = body || {};

    if (!fileKey || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ ok: false, error: 'fileKey and ids[] are required' }, { status: 400 });
    }

    const idsParam = ids.join(',');
    const url = new URL(`${FIGMA_BASE}/images/${encodeURIComponent(fileKey)}`);
    url.searchParams.set('ids', idsParam);
    url.searchParams.set('format', format);
    url.searchParams.set('scale', String(scale));

    const resp = await fetch(url.toString(), {
      headers: { 'X-Figma-Token': TOKEN ?? '' },
    });

    const json = await resp.json();
    if (!resp.ok) {
      return NextResponse.json({ ok: false, error: json }, { status: resp.status });
    }

    // json.images: { nodeId: imageUrl }
    return NextResponse.json({ ok: true, images: json.images });
  } catch (err: any) {
    console.error('FIGMA IMAGES ERROR', err);
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
