import { Router } from 'express';

import UsersController from '../controllers/UsersController';
import usersSchema from '../schema/usersSchema';
import validate from '../middlewares/validate';
import upload from "../middlewares/upload";

const router = Router();

router.post(
    '/register',
    upload(['image/png', 'image/jpeg', 'image/gif']).single('avatar'),
  validate(usersSchema.register),
  UsersController.register,
);

router.post(
  '/login',
  validate(usersSchema.login),
  UsersController.login,
);

router.put('/updateProfile', UsersController.updateProfile);
router.get('/users', UsersController.usersList);

router.get('/profile', UsersController.profile);
router.get('/activate', UsersController.activate);
router.post('/updatePassword', UsersController.updatePassword);
router.post('/resetPassword', UsersController.resetPassword);
router.post('/resetPasswordRequest', UsersController.resetPasswordRequest);
router.delete('/deleteProfile', UsersController.deleteProfile);

export default router;
