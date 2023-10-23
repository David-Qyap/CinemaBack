import { Router } from 'express';
import AdminController from '../controllers/AdminController.js';
import upload from '../middlewares/upload.js';
import isAdmin from '../middlewares/isAdmin.js';



const router = Router();


router.post('/addMovie',upload(['image/png', 'image/jpeg',]).single('moviePhoto'),isAdmin, AdminController.addMovie);
router.post('/addActor',upload(['image/png', 'image/jpeg',]).single('actorPhoto'), isAdmin,AdminController.addActor);
router.post('/addShowTime',isAdmin, AdminController.addShowTime);
router.post('/deleteShowTime', isAdmin,AdminController.deleteShowTime);
router.get('/findMovie', isAdmin, AdminController.findMovie);
router.put('/updateMovie',upload(['image/png', 'image/jpeg',]).single('moviePhoto'),isAdmin, AdminController.updateMovie);
router.delete('/deletedMovie',isAdmin,AdminController.deleteMovie);
export default router;