import axios from 'axios';
import { Job } from '@/types/job';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface GetJobsParams {
  page?: number;
  limit?: number;
  category?: string | null;
  search?: string | null;
  sort?: string | null;
}

interface GetJobsResponse {
  jobs: Job[];
  count: number;
  total: number;
  pagination: {
    currentPage: number;
    totalPages: number;
  };
}

// Function to get jobs with optional filtering
export async function getJobs(
  params: GetJobsParams = {}
): Promise<GetJobsResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) {
      queryParams.append('page', params.page.toString());
    }

    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params.category && params.category !== 'All Categories') {
      queryParams.append('category', params.category);
    }

    if (params.search) {
      queryParams.append('search', params.search);
    }

    if (params.sort) {
      queryParams.append('sort', params.sort);
    }

    const response = await axios.get(
      `${API_URL}/jobs?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return {
      jobs: [],
      count: 0,
      total: 0,
      pagination: {
        currentPage: 1,
        totalPages: 1
      }
    };
  }
}

// Function to get a single job by ID
export async function getJobById(id: string): Promise<Job | null> {
  try {
    const response = await axios.get(`${API_URL}/jobs/${id}`);
    return response.data.job;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

// Function to create a new job
export async function createJob(formData: FormData): Promise<Job> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(`${API_URL}/jobs`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.job;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}

// Function to update a job
export async function updateJob(id: string, formData: FormData): Promise<Job> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.put(`${API_URL}/jobs/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.job;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}

// Function to delete a job
export async function deleteJob(id: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    await axios.delete(`${API_URL}/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return true;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
}
