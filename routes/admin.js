import { Router } from 'express';
import AdminController from "../controllers/AdminController.js";
import upload from "../middlewares/upload.js";



const router = Router();


router.post('/addMovie',upload(['image/png', 'image/jpeg', 'image/gif']).single('actorAvatar'), AdminController.addMovie)


export default router