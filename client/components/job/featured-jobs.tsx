"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { getJobs } from '@/lib/api/jobs';
import { Job } from '@/types/job';

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      setLoading(true);
      try {
        const response = await getJobs({ limit: 6 });
        setJobs(response.jobs);
      } catch (error) {
        console.error('Error fetching featured jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  if (loading) {
    return (
      <section className="bg-muted/40 py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Featured Jobs</h2>
            <p className="mt-2 text-muted-foreground">
              Discover our handpicked selection of top opportunities
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-[280px] animate-pulse">
                <CardContent className="p-0">
                  <div className="h-full p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="h-6 bg-muted-foreground/15 rounded w-3/4"></div>
                      <div className="h-4 bg-muted-foreground/15 rounded w-1/2"></div>
                      <div className="h-4 bg-muted-foreground/15 rounded w-1/3"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-muted-foreground/15 rounded w-16"></div>
                        <div className="h-6 bg-muted-foreground/15 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="h-10 bg-muted-foreground/15 rounded w-full mt-4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!jobs.length) {
    return null;
  }

  return (
    <section className="bg-muted/40 py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Featured Jobs</h2>
          <p className="mt-2 text-muted-foreground">
            Discover our handpicked selection of top opportunities
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job._id} className="overflow-hidden transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                    {job.imageUrl ? (
                      <Image
                        src={job.imageUrl}
                        alt={`${job.company} logo`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-lg font-bold text-muted-foreground">
                          {job.company.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="secondary">{job.category}</Badge>
                    <Badge variant="outline">{job.salary}</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-4">
                <Link href={`/jobs/${job._id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/jobs">
            <Button size="lg">
              View All Jobs
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}