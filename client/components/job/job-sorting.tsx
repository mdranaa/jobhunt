"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function JobSorting() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    
    const query = params.toString();
    router.push(`/jobs${query ? `?${query}` : ''}`);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Sort by:</span>
      <Select
        defaultValue={searchParams.get('sort') || 'default'}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Most Relevant</SelectItem>
          <SelectItem value="date-desc">Newest First</SelectItem>
          <SelectItem value="date-asc">Oldest First</SelectItem>
          <SelectItem value="salary-desc">Highest Salary</SelectItem>
          <SelectItem value="salary-asc">Lowest Salary</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}