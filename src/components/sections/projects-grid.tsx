"use client";

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Figma, 
  ExternalLink, 
  Calendar,
  AlertCircle,
  Search,
  X
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,

} from '@/components/ui/pagination';

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

export function ProjectsGrid() {
  const [projects, setProjects] = useState<FigmaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Filter projects by search
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(search.toLowerCase()) ||
    (project.description?.toLowerCase().includes(search.toLowerCase()) || false)
  );
  
  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) {
    return (
      <div className="mb-6">
        {/* Centered Search Bar with icon, like PostsSearch */}
        <div className="relative max-w-md mx-auto mb-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2 transition-colors" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50"
            disabled
          />
        </div>
        {/* Skeleton grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="group h-full min-h-[380px] flex flex-col flex-1 overflow-hidden border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm rounded-xl">
              <div className="relative h-40 w-full overflow-hidden mb-2">
                <div className="animate-pulse bg-muted w-full h-full rounded-t-xl" />
              </div>
              <CardHeader className="relative space-y-4 flex-1">
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-3/4 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4 flex-1 flex flex-col justify-between">
                <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                <div className="flex items-center gap-3 pt-4">
                  <div className="h-9 w-full bg-muted rounded-lg animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="text-lg font-semibold">Unable to load projects</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Projects Search Bar */}
      <div className="mb-6">
        {/* Centered Search Bar with icon, like PostsSearch */}
        <div className="relative max-w-md mx-auto mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2 transition-colors" />
          <Input
            type="text"
            placeholder="Search design projects..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50"
          />
        </div>
        
        {/* Active Filters */}
        {search && (
          <div className="flex flex-wrap items-center gap-2 justify-center mb-4">
            <span className="text-sm text-muted-foreground">Searching for:</span>
            <Badge variant="secondary" className="text-xs">
              &quot;{search}&quot;
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setCurrentPage(1);
              }}
              className="text-xs h-7 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProjects.map((project, index) => (
          <motion.div
            key={project.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="h-full flex flex-col"
          >
            <Card className="group h-full min-h-[380px] flex flex-col flex-1 overflow-hidden border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Figma file thumbnail */}
              {project.thumbnail_url && (
                <div className="relative h-40 w-full overflow-hidden mb-2">
                  <Image
                    src={project.thumbnail_url}
                    alt={project.name}
                    width={400}
                    height={160}
                    className="object-cover w-full h-full rounded-t-xl"
                    priority={index < 4}
                  />
                </div>
              )}
              <CardHeader className="relative space-y-3 flex-1">
                <div className="space-y-2 flex-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                    {project.name}
                  </CardTitle>
                  {project.description && (
                    <CardDescription className="line-clamp-2 leading-relaxed text-sm">
                      {project.description}
                    </CardDescription>
                  )}
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Updated {formatDate(project.updated_at)}</span>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <Button asChild size="sm" className="flex-1">
                    <Link 
                      href={`https://figma.com/file/${project.key}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Figma className="h-3 w-3" />
                      Open in Figma
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredProjects.length === 0 && !loading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">No design projects found</p>
            {search && (
              <Button 
                onClick={() => {
                  setSearch('');
                  setCurrentPage(1);
                }} 
                variant="outline"
                className="mt-4"
              >
                Clear Search
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(p => Math.max(1, p - 1));
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={e => { e.preventDefault(); setCurrentPage(i + 1); }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(p => Math.min(totalPages, p + 1));
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'today';
  if (diffInDays === 1) return 'yesterday';
  if (diffInDays < 30) return `${diffInDays} days ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}
