export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import JobListing from '@/components/job/job-listing';
import { JobFilterSidebar } from '@/components/job/job-filter-sidebar';
import { JobSorting } from '@/components/job/job-sorting';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Browse Jobs | JobHunt',
  description:
    'Explore thousands of job opportunities across various industries and find your next career move.',
  keywords: 'job listings, career opportunities, job search, find jobs'
};

// This simulates fetching jobs from the API on the server
async function getJobs() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${API_URL}/jobs`, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error('Failed to fetch jobs');
    }

    const data = await res.json();
    return data.jobs || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12 lg:py-16">
      <h1 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">
        Job Listings
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <Suspense fallback={<div>Loading filters...</div>}>
            <JobFilterSidebar />
          </Suspense>
        </div>

        <div className="w-full lg:w-3/4">
          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <p className="text-muted-foreground">{jobs.length} jobs found</p>
            <JobSorting />
            <Suspense fallback={<div>Loading sort options...</div>}></Suspense>
          </div>

          <JobListing initialJobs={jobs} />
        </div>
      </div>
    </div>
  );
}
