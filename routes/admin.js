import { Router } from 'express'
import AdminController from '../controllers/AdminController.js'
import upload from '../middlewares/upload.js'



const router = Router()


router.post('/addMovie',upload(['image/png', 'image/jpeg',]).fields([
    { name: 'moviePhoto', maxCount: 1 },
    { name: 'actorPhoto', maxCount: 2 }
]), AdminController.addMovie)
router.post('/findMovie', AdminController.findMovie)
router.put('/updateMovie', AdminController.updateMovie)
export default router