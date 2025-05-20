export interface Job {
  _id: string;
  title: string;
  description: string;
  salary: string;
  category: string;
  company: string;
  location: string;
  imageUrl?: string;
  imagePublicId?: string;
  user: string;
  status: 'open' | 'closed' | 'pending';
  applicationDeadline?: string;
  createdAt: string;
  updatedAt: string;
}