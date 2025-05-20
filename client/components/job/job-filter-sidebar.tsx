'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const JOB_CATEGORIES = [
  'All Categories',
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Sales',
  'Design',
  'Other'
];

const JOB_TYPES = [
  'All Types',
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship'
];

type FormValues = {
  category: string;
  type: string;
  salaryRange: number[];
  remote: boolean;
};

export function JobFilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<FormValues>({
    defaultValues: {
      category: searchParams.get('category') || 'All Categories',
      type: 'All Types',
      salaryRange: [0, 100],
      remote: false
    }
  });

  function onSubmit(data: FormValues) {
    const params = new URLSearchParams(searchParams.toString());

    if (data.category && data.category !== 'All Categories') {
      params.set('category', data.category);
    } else {
      params.delete('category');
    }

    if (data.type && data.type !== 'All Types') {
      params.set('type', data.type);
    } else {
      params.delete('type');
    }

    if (data.remote) {
      params.set('remote', 'true');
    } else {
      params.delete('remote');
    }

    if (data.salaryRange[0] > 0 || data.salaryRange[1] < 100) {
      params.set('minSalary', (data.salaryRange[0] * 1000).toString());
      params.set('maxSalary', (data.salaryRange[1] * 1000).toString());
    } else {
      params.delete('minSalary');
      params.delete('maxSalary');
    }

    const query = params.toString();
    router.push(`/jobs${query ? `?${query}` : ''}`);
  }

  function resetFilters() {
    form.reset({
      category: 'All Categories',
      type: 'All Types',
      salaryRange: [0, 100],
      remote: false
    });

    router.push('/jobs');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Filter Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JOB_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {JOB_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Salary Range (K)</FormLabel>
              <FormField
                control={form.control}
                name="salaryRange"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${field.value[0]}K</span>
                      <span>${field.value[1]}K+</span>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remote"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Remote Only</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Separator />

            <div className="flex flex-col gap-2">
              <Button type="submit">Apply Filters</Button>
              <Button type="button" variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
