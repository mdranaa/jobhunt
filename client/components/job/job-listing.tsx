'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSearchParams } from 'next/navigation';
import { getJobs } from '@/lib/api/jobs';
import { Job } from '@/types/job';

interface JobListingProps {
  initialJobs?: Job[];
}

export default function JobListing({ initialJobs = [] }: JobListingProps) {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(!initialJobs.length);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchJobs = async (resetJobs = false) => {
      setLoading(true);
      try {
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const newPage = resetJobs ? 1 : page;

        const response = await getJobs({
          page: newPage,
          category,
          search
        });

        const newJobs = response.jobs;

        if (resetJobs) {
          setJobs(newJobs);
          setPage(1);
        } else {
          setJobs((prev) => [...prev, ...newJobs]);
          setPage((prev) => prev + 1);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    if (searchParams.toString()) {
      fetchJobs(true);
    }
  }, [searchParams, page]);

  if (!jobs.length && loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!jobs.length && !loading) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search or filter criteria.
        </p>
        <Link href="/jobs">
          <Button>View All Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card
          key={job._id}
          className="overflow-hidden transition-all hover:shadow-md"
        >
          <Link href={`/jobs/${job._id}`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded bg-muted">
                  {job.imageUrl ? (
                    <Image
                      src={job.imageUrl}
                      alt={`${job.company} logo`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-xl font-bold text-muted-foreground">
                        {job.company.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-xl">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(job.createdAt), {
                        addSuffix: true
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="secondary">{job.category}</Badge>
                    <Badge variant="outline">{job.salary}</Badge>
                    {job.status === 'open' && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                      >
                        {job.status}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  className="hidden md:flex self-center"
                  size="sm"
                >
                  View Details
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
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
