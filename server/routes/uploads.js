import { Router } from 'express';
import upload from '../api/upload';

const router = Router();

router.post('/', async (req, res) => {
  upload(req, res, (error) => {
    if (error) return res.status(400).send(error);
    return res.sendStatus(200);
  });
});

export default router;
