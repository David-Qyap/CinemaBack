import { Router } from 'express';
import homeController from '../controllers/HomeController';

const router = Router();

router.get('/home', homeController.homePage);

export default router;
