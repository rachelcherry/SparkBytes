import express from 'express';
import { authToken } from '../middleware/authToken.ts';
import * as locController from './location.controller.ts';

const router = express.Router();

router.use(authToken);

router.get('/', locController.get_locations);

export default router;
