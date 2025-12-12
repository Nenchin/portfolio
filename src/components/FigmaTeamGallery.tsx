'use client';

import React, { useEffect, useState } from 'react';

type Entry = {
  projectId: string;
  projectName: string;
  fileKey: string;
  fileName: string;
  figmaUrl: string;
  frameId?: string;
  previewUrl?: string | null;
  error?: string;
};

export default function FigmaTeamGallery({ teamId }: { teamId: string }) {
  const [items, setItems] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/figma/team/${encodeURIComponent(teamId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setItems(data.data || []);
        } else {
          setError(JSON.stringify(data.error || 'Failed to fetch figma team'));
        }
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [teamId]);

  if (loading) return <div>Loading Figma projects…</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((it) => (
        <a key={it.fileKey} href={it.figmaUrl} target="_blank" rel="noreferrer" className="block border rounded overflow-hidden shadow-sm">
          <div className="h-40 bg-gray-100">
            {it.previewUrl ? (
              // plain <img> avoids next/image external domain config
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.previewUrl} alt={it.fileName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No preview</div>
            )}
          </div>
          <div className="p-3">
            <div className="font-medium">{it.fileName}</div>
            <div className="text-xs text-muted-foreground">{it.projectName}</div>
            {it.error && <div className="text-xs text-red-500 mt-2">Preview error</div>}
          </div>
        </a>
      ))}
    </div>
  );
}
