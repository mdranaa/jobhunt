import express from 'express';
import multer from 'multer';
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  uploadJobImage
} from '../controllers/jobs.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for temporary storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

router.route('/').get(getJobs).post(protect, upload.single('image'), createJob);

router
  .route('/:id')
  .get(getJob)
  .put(protect, upload.single('image'), updateJob)
  .delete(protect, deleteJob);

router.route('/upload').post(protect, upload.single('image'), uploadJobImage);

export default router;
