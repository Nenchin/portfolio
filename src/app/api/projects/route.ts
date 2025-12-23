import { NextResponse } from 'next/server';

interface FigmaFile {
  key: string;
  name: string;
  description?: string;
  updated_at: string;
  created_at: string;
  thumbnail_url: string;
  shared_plugin_count?: number;
  shared_library_count?: number;
  sort_position?: number;
}

interface FigmaProject {
  files: FigmaFile[];
}

export async function GET() {
  try {
    const figmaToken = process.env.FIGMA_API_TOKEN;
    const figmaProjectId = process.env.NEXT_PUBLIC_FIGMA_PROJECT_ID;
    
    if (!figmaToken) {
      return NextResponse.json(
        { error: 'Figma token not configured' },
        { status: 500 }
      );
    }

    if (!figmaProjectId) {
      return NextResponse.json(
        { error: 'Figma project ID not configured' },
        { status: 500 }
      );
    }

    // Fetch project files from Figma API
    const response = await fetch(
      `https://api.figma.com/v1/projects/${figmaProjectId}/files`,
      {
        headers: {
          'X-Figma-Token': figmaToken,
          'Accept': 'application/json',
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Figma API responded with status ${response.status}`);
    }

    const data: FigmaProject = await response.json();
    
    // Sort by updated_at date (most recent first)
    const sortedFiles = (data.files || [])
      .sort((a, b) => {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });

    return NextResponse.json(sortedFiles, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('Error fetching Figma projects:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
