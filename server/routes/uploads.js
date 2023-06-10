import { Router } from 'express';

import { getUploadAndResizeMiddleware } from '../api/upload';
import { adminMiddleware } from '../api/auth';

export const uploadPhoto = getUploadAndResizeMiddleware('photos', [
  { path: 'l', width: 1600, height: 1600 },
]);

const router = Router();

router.post('/photos', adminMiddleware, uploadPhoto, (req, res) => {
  res.json({ key: req.body.key });
});

export default router;
