import Job from '../models/Job.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      category,
      company,
      location,
      applicationDeadline
    } = req.body;

    let imageUrl = '';
    let imagePublicId = '';

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'job-board',
        resource_type: 'image'
      });

      imageUrl = result.secure_url;
      imagePublicId = result.public_id;
    }

    const job = await Job.create({
      title,
      description,
      salary,
      category,
      company,
      location,
      imageUrl,
      imagePublicId,
      user: req.user.id,
      applicationDeadline: applicationDeadline || null
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((field) => delete queryObj[field]);

    const query = Job.find(queryObj).populate({
      path: 'user',
      select: 'name company'
    });

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    query.skip(startIndex).limit(limit);

    const jobs = await query;
    const total = await Job.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      },
      jobs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate({
      path: 'user',
      select: 'name company'
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      if (job.imagePublicId) {
        await cloudinary.uploader.destroy(job.imagePublicId);
      }

      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'job-board',
        resource_type: 'image'
      });

      updateData.imageUrl = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    job = await Job.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    if (job.imagePublicId) {
      await cloudinary.uploader.destroy(job.imagePublicId);
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadJobImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'job-board',
      resource_type: 'image'
    });

    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
