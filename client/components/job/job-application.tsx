'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters.'
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.'
  }),
  phone: z.string().min(10, {
    message: 'Please enter a valid phone number.'
  }),
  coverLetter: z.string().min(20, {
    message: 'Cover letter must be at least 20 characters.'
  }),
  resume: z.any().refine((file) => file?.size <= 5 * 1024 * 1024, {
    message: 'Resume file size must be less than 5MB'
  })
});

type FormValues = z.infer<typeof formSchema>;

interface JobApplicationProps {
  jobId: string;
}

export function JobApplication({ jobId }: JobApplicationProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      coverLetter: '',
      resume: undefined
    }
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Application submitted:', { jobId, ...values });

      toast({
        title: 'Application submitted',
        description: 'Your job application has been successfully submitted.'
      });

      form.reset();
      setIsSubmitting(false);
    }, 1500);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Apply for this Job
        </CardTitle>
        <CardDescription>
          Complete the form below to submit your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="resume"
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Resume/CV</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);
                      }}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormDescription>
                    PDF, DOC, or DOCX file. Maximum 5MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverLetter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Letter</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a brief cover letter explaining why you're a good fit for this role"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? 'Submitting Application...'
                : 'Submit Application'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
