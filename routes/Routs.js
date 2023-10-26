import {Router} from 'express';
import cors from "../middlewares/cors.js";

const router = Router();


router.get('/api', cors,(req, res) => {
    res.json({
        status:'ok'
    });
});
export  default router;