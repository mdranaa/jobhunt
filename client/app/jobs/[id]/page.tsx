import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { getJobById } from '@/lib/api/jobs';
import { JobApplication } from '@/components/job/job-application';
import { SimilarJobs } from '@/components/job/similar-jobs';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    return {
      title: 'Job Not Found | JobHunt',
      description: 'The job listing you were looking for could not be found.'
    };
  }

  return {
    title: `${job.title} at ${job.company} | JobHunt`,
    description: job.description.substring(0, 160),
    openGraph: {
      title: `${job.title} at ${job.company} | JobHunt`,
      description: job.description.substring(0, 160),
      images: job.imageUrl ? [job.imageUrl] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: `${job.title} at ${job.company}`,
      description: job.description.substring(0, 160),
      images: job.imageUrl ? [job.imageUrl] : undefined
    }
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    return (
      <div className="container px-4 py-16 text-center md:px-6">
        <h1 className="mb-4 text-3xl font-bold">Job Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          The job listing you were looking for could not be found.
        </p>
        <Link href="/jobs">
          <Button>Browse Jobs</Button>
        </Link>
      </div>
    );
  }

  const postedDate = new Date(job.createdAt);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <Link
              href="/jobs"
              className="mb-4 flex items-center text-muted-foreground hover:text-foreground md:mb-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="m15 18 -6 -6 6 -6" />
              </svg>
              Back to job listings
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
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
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save
              </Button>
              <Button variant="outline" size="sm">
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
                  <path d="M22 20V8h-4l-6-4-6 4H2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z" />
                  <path d="M17 14v-1a4 4 0 0 0-8 0v1" />
                </svg>
                Share
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                <div className="relative mb-4 h-20 w-20 flex-shrink-0 overflow-hidden rounded md:mb-0">
                  {job.imageUrl ? (
                    <Image
                      src={job.imageUrl}
                      alt={`${job.company} logo`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="text-xl font-bold text-muted-foreground">
                        {job.company.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="mb-2 text-2xl font-bold md:text-3xl">
                    {job.title}
                  </h1>
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-muted-foreground">
                    <span>{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>Posted {timeAgo}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{job.category}</Badge>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    >
                      {job.status}
                    </Badge>
                    <Badge variant="outline">{job.salary}</Badge>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h2 className="mb-4 text-xl font-semibold">Job Description</h2>
                <div className="prose max-w-none dark:prose-invert">
                  {job.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                <Button className="flex-1">
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
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  </svg>
                  Apply Now
                </Button>
                <Button variant="outline" className="flex-1">
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
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                  More Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Job Overview</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  <div>
                    <p className="font-medium">Posted Date</p>
                    <p className="text-muted-foreground">
                      {postedDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  <div>
                    <p className="font-medium">Salary</p>
                    <p className="text-muted-foreground">{job.salary}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                  </svg>
                  <div>
                    <p className="font-medium">Category</p>
                    <p className="text-muted-foreground">{job.category}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <JobApplication jobId={id} />

          <SimilarJobs currentJobId={id} category={job.category} />
        </div>
      </div>
    </div>
  );
}
