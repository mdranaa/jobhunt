"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Sales',
  'Design',
  'Other',
];

export function CategoryFilter() {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    router.push(`/jobs?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="mt-4">
      <h3 className="mb-2 text-sm font-medium">Popular Categories</h3>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            className={cn(
              "rounded-full text-xs",
              category === 'Technology' && "bg-primary/10"
            )}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}