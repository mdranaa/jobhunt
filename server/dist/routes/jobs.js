"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const jobs_1 = require("../controllers/jobs");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Configure multer for temporary storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});
router.route('/').get(jobs_1.getJobs).post(auth_1.protect, upload.single('image'), jobs_1.createJob);
router
    .route('/:id')
    .get(jobs_1.getJob)
    .put(auth_1.protect, upload.single('image'), jobs_1.updateJob)
    .delete(auth_1.protect, jobs_1.deleteJob);
router.route('/upload').post(auth_1.protect, upload.single('image'), jobs_1.uploadJobImage);
exports.default = router;
