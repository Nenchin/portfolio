"use client";

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const FIGMA_BASE = 'https://api.figma.com/v1';
const TOKEN = process.env.FIGMA_TOKEN;

export async function GET(req: NextRequest, { params }: { params: { fileKey?: string } }) {
  const fileKey = params.fileKey;
  if (!fileKey) return NextResponse.json({ ok: false, error: 'fileKey required' }, { status: 400 });

  try {
    const resp = await fetch(`${FIGMA_BASE}/files/${encodeURIComponent(fileKey)}`, {
      headers: {
        'X-Figma-Token': TOKEN ?? '',
      },
    });

    if (!resp.ok) {
      const body = await resp.text();
      return NextResponse.json({ ok: false, status: resp.status, error: body }, { status: resp.status });
    }

    const data = await resp.json();

    // Walk the document tree and collect frames / components
    const frames: { id: string; name: string; type: string; page?: string }[] = [];

    function walk(node: any, pageName?: string) {
      if (!node) return;
      const { type, id, name, children } = node;
      if (type === 'FRAME' || type === 'COMPONENT' || type === 'INSTANCE' || type === 'GROUP') {
        frames.push({ id, name, type, page: pageName });
      }
      if (Array.isArray(children)) {
        children.forEach((c) => walk(c, pageName));
      }
    }

    if (data.document && Array.isArray(data.document.children)) {
      data.document.children.forEach((page: any) => {
        const pageName = page.name;
        if (Array.isArray(page.children)) page.children.forEach((child: any) => walk(child, pageName));
      });
    }

    return NextResponse.json({ ok: true, frames });
  } catch (err: any) {
    console.error('FIGMA FILE ERROR', err);
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}
