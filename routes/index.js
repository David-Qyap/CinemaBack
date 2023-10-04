import { Router } from 'express';
import users from './users';
import home from './home';
import MainController from '../controllers/MainController';

const router = Router();

router.get('/', MainController.main);

router.use('/users', users);
router.use('/home', home);

export default router;
