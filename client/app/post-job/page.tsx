"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import ImageUpload from '@/components/job/image-upload';
import { createJob } from '@/lib/api/jobs';

const JOB_CATEGORIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Sales',
  'Design',
  'Other',
];

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Job title must be at least 5 characters.',
  }),
  description: z.string().min(20, {
    message: 'Job description must be at least 20 characters.',
  }),
  company: z.string().min(2, {
    message: 'Company name must be at least 2 characters.',
  }),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
  salary: z.string().min(1, {
    message: 'Salary is required.',
  }),
  category: z.string({
    required_error: 'Please select a job category.',
  }),
  image: z.any().optional(),
  applicationDeadline: z.string().optional(),
});

export default function PostJobPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      company: user?.company || '',
      location: '',
      salary: '',
      category: '',
      applicationDeadline: '',
    },
  });

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to post a job.',
        variant: 'destructive',
      });
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('company', values.company);
      formData.append('location', values.location);
      formData.append('salary', values.salary);
      formData.append('category', values.category);
      
      if (values.applicationDeadline) {
        formData.append('applicationDeadline', values.applicationDeadline);
      }
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createJob(formData);
      
      toast({
        title: 'Job posted successfully!',
        description: 'Your job listing has been published.',
      });
      
      router.push('/jobs');
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: 'Failed to post job',
        description: 'There was a problem posting your job listing.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container py-10 md:py-16">
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Post a New Job</CardTitle>
          <CardDescription>
            Fill out the form below to post a new job listing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Acme Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Range</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. $80,000 - $100,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Category</FormLabel>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="applicationDeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional. If not specified, the job will be considered open until filled.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Company Logo</FormLabel>
                    <FormControl>
                      <ImageUpload onImageChange={handleImageChange} />
                    </FormControl>
                    <FormDescription>
                      Upload your company logo or an image representing the job. Max file size: 5MB.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the job responsibilities, requirements, benefits, etc."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Posting job...' : 'Post Job'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-center text-sm text-muted-foreground">
            By posting a job, you agree to our{' '}
            <Link href="/terms" className="text-primary underline hover:text-primary/90">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary underline hover:text-primary/90">
              Privacy Policy
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}