"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getJobs } from '@/lib/api/jobs';
import { Job } from '@/types/job';

interface SimilarJobsProps {
  currentJobId: string;
  category: string;
}

export function SimilarJobs({ currentJobId, category }: SimilarJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      if (!category) return;
      
      setLoading(true);
      try {
        const response = await getJobs({ category, limit: 3 });
        // Filter out the current job
        const filteredJobs = response.jobs.filter(job => job._id !== currentJobId);
        setJobs(filteredJobs.slice(0, 3));
      } catch (error) {
        console.error('Error fetching similar jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarJobs();
  }, [currentJobId, category]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Similar Jobs</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!jobs.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Similar Jobs</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="border-b pb-4 last:border-0 last:pb-0">
              <Link href={`/jobs/${job._id}`}>
                <h3 className="font-medium hover:text-primary transition-colors">
                  {job.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">{job.company}</p>
              <p className="text-sm text-muted-foreground">{job.location}</p>
            </div>
          ))}
          
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/jobs?category=${encodeURIComponent(category)}`}>
              View More {category} Jobs
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}