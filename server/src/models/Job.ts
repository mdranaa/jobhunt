import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  salary: string;
  category:
    | 'Technology'
    | 'Finance'
    | 'Healthcare'
    | 'Education'
    | 'Marketing'
    | 'Sales'
    | 'Design'
    | 'Other';
  company: string;
  location: string;
  imageUrl?: string;
  imagePublicId?: string;
  user: mongoose.Types.ObjectId;
  status?: 'open' | 'closed' | 'pending';
  applicationDeadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const jobSchema: Schema<IJob> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
      maxlength: [100, 'Job title cannot be more than 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
      maxlength: [5000, 'Job description cannot be more than 5000 characters']
    },
    salary: {
      type: String,
      required: [true, 'Please provide a salary range']
    },
    category: {
      type: String,
      required: [true, 'Please specify a job category'],
      enum: [
        'Technology',
        'Finance',
        'Healthcare',
        'Education',
        'Marketing',
        'Sales',
        'Design',
        'Other'
      ]
    },
    company: {
      type: String,
      required: [true, 'Please provide a company name'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Please provide a job location']
    },
    imageUrl: {
      type: String,
      default: ''
    },
    imagePublicId: {
      type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'pending'],
      default: 'open'
    },
    applicationDeadline: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add indexes
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ title: 'text', description: 'text' });

const Job: Model<IJob> = mongoose.model<IJob>('Job', jobSchema);

export default Job;
