export default function HowItWorks() {
  const steps = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 h-10 w-10 text-primary">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
      title: 'Create an Account',
      description: 'Sign up and create your profile to get started on your job search journey.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 h-10 w-10 text-primary">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      ),
      title: 'Search Jobs',
      description: 'Browse through thousands of job listings or filter by category and location.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 h-10 w-10 text-primary">
          <rect width="18" height="14" x="3" y="8" rx="2" />
          <path d="M7 8V6a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v2" />
          <path d="M12 12v3" />
        </svg>
      ),
      title: 'Apply Instantly',
      description: 'Submit your application directly through our platform with just a few clicks.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-4 h-10 w-10 text-primary">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: 'Get Hired',
      description: 'Connect with employers and land your dream job with our streamlined process.',
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mt-2 text-muted-foreground">
            Find your dream job in just a few simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {step.icon}
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <h3 className="mb-2 font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}