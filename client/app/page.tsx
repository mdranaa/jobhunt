import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/job/search-bar';
import { CategoryFilter } from '@/components/job/category-filter';
import FeaturedJobs from '@/components/job/featured-jobs';
import HowItWorks from '@/components/home/how-it-works';
import NewsletterSignup from '@/components/home/newsletter-signup';

export default function Home() {
  return (
    <>
      <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background pt-20 pb-12 md:pt-32 md:pb-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover Your Next Career Opportunity
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Find the perfect job that matches your skills and aspirations.
                  Browse thousands of job listings from top companies.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/jobs">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Browse Jobs
                  </Button>
                </Link>
                <Link href="/post-job">
                  <Button size="lg" variant="outline">
                    Post a Job
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-[500px] rounded-lg border bg-background p-4 shadow-lg">
                <SearchBar />
                <CategoryFilter />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(circle_500px_at_50%_200px,hsl(var(--chart-1)/0.15),transparent)]"></div>
      </section>

      <FeaturedJobs />
      <HowItWorks />
      <NewsletterSignup />
    </>
  );
}
