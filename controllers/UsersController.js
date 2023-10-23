import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';
import cryptoRandomString from 'crypto-random-string';
import Users from '../models/Users';
import Mail from '../services/Mail';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import Movies from '../models/Movies.js';
import Tickets from '../models/Tickets.js';
import {Reviews} from '../models/index.js';
import Actor from '../models/actor.js';
import Categories from '../models/Categories.js';
const { JWT_SECRET, API_URL,PASSWORD_SECRET } = process.env;
function generateResetCode() {
    const code = cryptoRandomString({ length: 8, type: 'numeric' });
    return code;
}


class UsersController {
    static register = async (req, res, next) => {
        try {
            const {
                firstName, lastName, email, password, city, country, address, phone,
            } = req.body;
            const { file } = req;
            const existingUser = await Users.findOne({
                where: { email },
            });
            if (existingUser) {
                throw HttpError(422, { errors: { email: 'Email already exists' } });
            }
            let avatar = null;

            if (file) {
                avatar = path.join('/images/actorPhoto', uuidv4() + '-' + file.originalname);
                // fs.renameSync(file.path, path.resolve(path.join('./public', actorPhoto)));
                await Promise.all([
                    sharp(file.path)
                        .rotate()
                        .resize(256)
                        .jpeg({
                            mozjpeg: true
                        })
                        .toFile(path.resolve(path.join('./public', avatar))),
                    sharp(file.path)
                        .rotate()
                        .resize(256)
                        .webp({})
                        .toFile(path.resolve(path.join('./public', avatar + '.webp')))
                ]);
            }

            const user = await Users.create({
                firstName,
                lastName,
                email,
                city,
                country,
                address,
                phone,
                avatar,
                password: Users.passwordHash(password),
            });

            const activationToken = jwt.sign({ email }, JWT_SECRET);

            user.activationToken = activationToken;


            await user.save();
            const activationUrl = `${API_URL}?activationToken=${activationToken}`;
            if (user) {
                await Mail.send(email, 'activate', 'user_activation', {
                    activationUrl,
                    email,
                });
            }

            res.json({
                status: 'ok',
                user,
            });
        } catch (e) {
            next(e);
        }
    };
    static activate = async (req, res, next) => {
        try {
            const { activationToken } = req.query;
            let data = {};
            try {
                data = jwt.verify(activationToken, JWT_SECRET);
            } catch (e) {
                data = {};
            }
            if (!data.email) {
                throw HttpError(404);
            }
            const user = await Users.findOne({
                email: data.email,
            });

            if (!user) {
                throw HttpError(404);
            }
            user.status = 'active';

            await user.save();

            const token = jwt.sign({ userId: user.id }, JWT_SECRET, {});

            res.json({
                status: 'ok',
                user,
                token,
            });
        } catch (e) {
            next(e);
        }
    };
    static login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({
                where: {
                    email,
                    password: Users.passwordHash(password),
                },
            });
            if (!user) {
                throw HttpError(401, 'invalid email or password1');
            }
            if (user.status !== 'active') {
                throw HttpError(401, 'User not acitve');
            }
            if (user.status === 'blocked') {
                throw HttpError(401, 'User Blocked');
            }

            const token = jwt.sign({ userId: user.id }, JWT_SECRET, {});
            res.json({
                status: 'ok',
                token,
                user,
            });
        } catch (e) {
            next(e);
        }
    };
    static profile = async (req, res, next) => {
        try {
            const userId = req.query.userId || req.userId;
            const user = await Users.findOne({
                where: {
                    user_id: userId,
                },
                include: 'CreditCard',
            });
            if (!user) {
                throw HttpError(404);
            }

            res.json({
                status: 'ok',
                user,
            });
        } catch (e) {
            next(e);
        }
    };
    static updateProfile = async (req, res, next) => {
        try {
            const { userId } = req.query;
            const user = await Users.findOne({
                where: {
                    user_id: userId,
                },
            });

            if (!user) {
                throw new HttpError(404, 'User not found');
            }

            const {
                firstName, lastName, city, country, address, phone,
            } = req.body;

            await user.update({
                firstName,
                lastName,
                city,
                country,
                address,
                phone,
            });

            res.json({
                status: 'ok',
            });
        } catch (e) {
            next(e);
        }
    };
    static deleteProfile = async (req, res, next) => {
        try {
            const { userId } = req.query;
            const user = await Users.findByPk(userId);

            if (!user) {
                throw new HttpError(404, 'User not found');
            }

            await user.destroy();

            res.json({
                status: 'ok',
                message: 'Profile deleted successfully',
            });
        } catch (e) {
            next(e);
        }
    };
    static usersList = async (req, res, next) => {
        try {
            const {user_id,page} = req.query || req;
            const user = await Users.findOne({ where: { user_id } });
            let userEmails=null;
            let status= 'ok';
            const limit=20;
            if (user.isAdmin === true) {
                userEmails = await Users.list(+page,limit);
            } else {
                status = 'error';
            }
            res.json({
                status: status,
                userEmails,
            });
        } catch (e) {
            next(e);
        }
    };
    static listFile = async (req, res, next) => {
        try {
            const { user_id } = req.query || req;
            const user = await Users.findOne({ where: { user_id } });

            const filePath =path.join( path.resolve(),'public\\mails\\userEmails.txt');
            if (!user.isAdmin) {
                return res.status(403).json({ error: 'Access denied' });
            }

            res.download(filePath, 'userEmails.txt', (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error downloading file' });
                }
            });
        } catch (e) {
            next(e);
        }
    };
    static updatePassword = async (req, res, next) => {
        try {
            const { email, currentPassword, newPassword } = req.body;

            const user = await Users.findOne({ where: { email } });

            if (!user) {
                throw new HttpError(404, 'User not found');
            }
            if (user.dataValues.password !== Users.passwordHash(currentPassword + PASSWORD_SECRET)) {
                throw new HttpError(400, 'Invalid current password');
            }

            user.password = Users.passwordHash(newPassword);

            await user.save();

            res.json({
                status: 'ok',
            });
        } catch (e) {
            next(e);
        }
    };
    static resetPasswordRequest = async (req, res, next) => {
        try {
            const { email } = req.body;

            const user = await Users.findOne({ where: { email } });

            if (!user) {
                throw HttpError(404, 'Пользователь не найден');
            }

            const resetCode = generateResetCode();

            user.resetCode = resetCode;
            await user.save();

            const data = {
                resetCode,
                email,
            };
            await Mail.send(email, 'code','reset_password', data);

            res.json({
                status: 'ok',
                resetCode,
            });
        } catch (e) {
            next(e);
        }
    };
    static resetPassword = async (req, res, next) => {
        try {
            const { email, resetCode, newPassword } = req.body;
            const user = await Users.findOne({ where: { email } });

            if (!user) {
                throw HttpError(404, 'User not found');
            }
            if (user.resetCode === resetCode) {
                user.password = newPassword;
                user.resetCode = null;
                await user.save();
            }

            res.json({
                status: 'ok',
            });
        } catch (e) {
            next(e);
        }
    };
    static findMovie = async (req, res, next) => {
        try {
            const {title ,movie_id} = req.query;
            let movies=[];
            console.log(movie_id,title);

            if (title){
                movies = await Movies.findAll({
                    where: {
                        title:   {
                            $like: `%${title}%`
                        },
                    },
                    include:[{
                        model:Actor,
                        as: 'actors'
                    },
                    {
                        model:Categories,
                        as: 'categories'
                    },
                    {
                        model:Reviews,
                        as:'reviews'
                    }
                    ]
                });

            }
            if (movie_id) {
                movies = await Movies.findAll({
                    where: {
                        movie_id,
                    },
                    include:[{
                        model:Actor,
                        as: 'actors'
                    },
                    {
                        model:Categories,
                        as: 'categories'
                    },
                    {
                        model:Reviews,
                        as:'reviews'
                    }
                    ]
                });
            }
           

            res.json({
                status: 'ok',
                movies,
            });
        } catch (e) {
            next(e);
        }
    };
    static createTickets = async (req,res,next)=>{
        try {
            const {movie_id, user_id, showtime_id, row, column, set_id, quantity}=req.body;
            const movie = await Movies.findByPk(movie_id);
            if (!movie) {
                throw new Error('Movie not found');
            }
            const existingTicket = await Tickets.findOne({
                where: {
                    showtime_id: showtime_id,
                    movie_id: movie_id,
                    row: row,
                    column: column
                }});
            if (existingTicket){
                throw new Error('Ticket already sold');

            }
            if(row<8 || column<19) {
                const createdTickets = [];
                for (let i = 0; i < quantity; i++) {
                    const newTicket = await Tickets.create({
                        user_id,
                        showtime_id,
                        quantity: 1,
                        row,
                        column,
                        set_id,
                        movie_id: movie_id,
                    });
                    createdTickets.push(newTicket);
                }

                res.json({
                    status: 'ok',
                    createdTickets
                });
            }else {
                res.json({
                    status: 'error',
                });
            }
        } catch (e) {
            next(e);
        }


    };
    static addReview = async (req, res, next) => {
        try {
            const { user_id, movie_id } = req.query;
            const { comment,rating } = req.body;
            const user = await Users.findOne({
                where: {
                    user_id
                }
            });
            const movie = await Movies.findOne({
                where: {
                    movie_id
                }
            });

            let reviews;

            if (user && movie) {
                reviews = await Reviews.create({
                    movie_id: movie.movie_id,
                    user_id: user.user_id,
                    rating,
                    comment
                });
                console.log(reviews);

                res.json({
                    status: 'ok',
                    reviews
                });
            } else {
                res.json({
                    status: 'error',
                    message: 'Пользователь или фильм не найден'
                });
            }
        } catch (e) {
            next(e);
        }
    };

}

export default UsersController;
