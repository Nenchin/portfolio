'use client';

import React, { useEffect, useState } from 'react';

type Frame = { id: string; name: string; type: string; page?: string };

export default function FigmaGallery({ fileKey }: { fileKey: string }) {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [loadingFrames, setLoadingFrames] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileKey) return;
    setLoadingFrames(true);
    setError(null);
    fetch(`/api/figma/file/${encodeURIComponent(fileKey)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setFrames(data.frames || []);
        else setError(JSON.stringify(data.error || 'Failed to load frames'));
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoadingFrames(false));
  }, [fileKey]);

  async function loadImages() {
    if (frames.length === 0) return;
    setLoadingImages(true);
    setError(null);
    const ids = frames.map((f) => f.id).slice(0, 12);
    try {
      const res = await fetch('/api/figma/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey, ids }),
      });
      const data = await res.json();
      if (data.ok) setImages(data.images || {});
      else setError(JSON.stringify(data.error || 'Failed to fetch images'));
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoadingImages(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Figma previews</h3>
        <div className="flex gap-2">
          <button
            onClick={loadImages}
            className="px-3 py-1 rounded bg-slate-800 text-white text-sm disabled:opacity-60"
            disabled={loadingImages || frames.length === 0}
          >
            {loadingImages ? 'Loading...' : 'Load images'}
          </button>
        </div>
      </div>

      {error && <div className="text-sm text-red-600">Error: {error}</div>}

      {loadingFrames ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {frames.slice(0, 12).map((f) => (
            <div key={f.id} className="border rounded overflow-hidden bg-white shadow-sm">
              <div className="h-36 w-full bg-gray-50">
                {images[f.id] ? (
                  // images from Figma are often short-lived; we just use the URL as-is
                  // next/image is optional; plain <img/> works and avoids extra config for external domains
                  // if you want to use next/image, add domain to next.config.js
                  // but for simplicity we use <img/>
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={images[f.id]} alt={f.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="font-medium line-clamp-1">{f.name}</div>
                <div className="text-xs text-muted-foreground">{f.page} • {f.type}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
