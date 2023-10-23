import Users from '../models/Users.js';

const  isAdmin = async(req, res, next) =>{
    try {
        const {user_id}=req.query;
        const admin= await Users.findByPk(user_id);
        if (admin.isAdmin === true) {
            next();
        } else {
            res.status(403).send('Access is denied');
        }
    }catch (e) {
        next(e);
    }
};
export default isAdmin;