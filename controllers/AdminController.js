import Movies from '../models/Movies';
import Actor from '../models/Actor';
import path from 'path';
import {v4 as uuidv4} from 'uuid';
import sharp from 'sharp';
import HttpError from 'http-errors';
import Categories from '../models/Categories.js';
import movieActors from '../models/movieactors.js';
import Showtime from '../models/ShowTime.js';
import Reviews from '../models/Reviews.js';



class AdminController {
    static addMovie = async (req, res, next) => {
        try {
            const { file } = req;
            const {
                title,
                rating,
                description,
                trailer_url,
                year,
                country,
                actor_ids,
                categoryIds,
                date
            } = req.body;
            let photoPath=null;
            console.log(date);
            if (file) {
                photoPath = path.join('/images/moviePhoto', uuidv4() + '-' + file.originalname);
                await Promise.all([
                    sharp(file.path)
                        .rotate()
                        .resize(256)
                        .jpeg({
                            mozjpeg: true,
                        })
                        .toFile(path.resolve(path.join('./public', photoPath))),
                    sharp(file.path)
                        .rotate()
                        .resize(256)
                        .webp({})
                        .toFile(path.resolve(path.join('./public', photoPath + '.webp'))
                        )]);
            }
            const actors = await Actor.findAll({
                where: {
                    actor_id: actor_ids
                }
            });
            const movieData = await Movies.create({
                title,
                rating,
                description,
                trailer_url,
                picture_url: photoPath,
                year,
                country,
            });
            const categories = await Categories.findAll({
                where: {
                    category_id: categoryIds,
                },
            });
            const actorIds = actors.map(actor => actor.actor_id);
            await movieData.addActors(actorIds);
            const category = categories.map((cat) => cat.category_id);

            await movieData.addCategories(category);
            await Showtime.create({
                movie_id: movieData.movie_id, 
                date,
            });
            const movie= await Movies.findOne({
                where:{
                    movie_id: movieData.movie_id,
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
                    model: Showtime,
                    as:'showtimes'
                }, 
                {
                    model:Reviews,
                    as:'reviews'
                }
                ] });
            res.json({
                status: 'ok',
                movie,
            });
        } catch (e) {
            next(e);
        }
    };
    static addActor = async (req, res, next) => {
        try {
            const { actor_name } = req.body;
            const { file } = req;

            let photoPath = null;

            const existingActor = await Actor.findOne({
                where: {
                    actor_name
                }
            });

            if (!existingActor) {
                if (file) {
                    photoPath = path.join('/images/actorPhoto', uuidv4() + '-' + file.originalname);

                    await Promise.all([
                        sharp(file.path)
                            .rotate()
                            .resize(256)
                            .jpeg({
                                mozjpeg: true,
                            })
                            .toFile(path.resolve(path.join('./public', photoPath))),
                        sharp(file.path)
                            .rotate()
                            .resize(256)
                            .webp({})
                            .toFile(path.resolve(path.join('./public', photoPath + '.webp'))
                            )]);
                }
                const newActor = await Actor.create({ actor_name, photo_url: photoPath });
                res.json({
                    status: 'ok',
                    actor: newActor
                });
            } else {
                res.json({
                    status: 'existing',
                    actor: existingActor
                });
            }
        } catch (e) {
            next(e);
        }
    };
    static addShowTime=async (req,res,next)=>{
        try {
            const {movie_id}=req.query;
            const {
                date
            } = req.body;
            await Showtime.create({
                movie_id,
                date,
            });
            res.json({
                status:'ok'
            });
        }catch (e) {
            next(e); 
        }
    };
    static deleteShowTime = async (req, res, next) => {
        try {
            const { showtime_id } = req.query;
            const showtime = await Showtime.findOne({
                where: {
                    showtime_id
                },
            });
            if (!showtime) {
                return res.status(404).json({
                    status:'error',
                    message: 'Showtime not found' });
            }
            await showtime.destroy();
            res.json({
                status: 'ok',
                message: 'Showtime deleted successfully' });
        } catch (e) {
            next(e);
        }
    };
    static findMovie = async (req, res, next) => {
        try {
            const {title,page = 1,movie_id} = req.query;
           
            let movieList=null;
            if (title){
                movieList = await Movies.findAll({
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
                movieList = await Movies.findAll({
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
            const limit=20;
            const  moviesData = await Movies.list(+page,limit,movieList);
            res.json({
                status: 'ok',
                moviesData,
            });
        } catch (e) {
            next(e);
        }
    };
    static updateMovie = async (req, res, next) => {
        try {
            const { movie_id } = req.query;
            const movie = await Movies.findOne({
                where: {
                    movie_id,
                },
            });
            if (!movie) {
                throw new HttpError(404, 'Movie not found');
            }
            const {
                title,
                rating,
                description,
                trailer_url,
                year,
                country
            } = req.body;
            const { file } = req;
            let picture_url = movie.picture_url;
            if (file) {
                const photoPath = path.join('/images/moviePhoto', uuidv4() + '-' + file.originalname);
                await Promise.all([
                    sharp(file.path)
                        .rotate()
                        .resize(256)
                        .jpeg({
                            mozjpeg: true,
                        })
                        .toFile(path.resolve(path.join('./public', photoPath))),
                    sharp(file.path)
                        .rotate()
                        .resize(256)
                        .webp({})
                        .toFile(path.resolve(path.join('./public', photoPath + '.webp'))
                        )]);
                picture_url = photoPath;
            }
            await movie.update({
                title,
                rating,
                description,
                trailer_url,
                picture_url,
                year,
                country
            });
            res.json({
                status: 'ok',
                movie
            });
        } catch (e) {
            next(e);
        }
    };
    static deleteMovie = async (req, res, next) => {
        try {
            const { movie_id } = req.query;
            const movie = await Movies.findByPk(movie_id);
            console.log(movie);
            if (!movie) {
                throw new HttpError(404, 'User not found');
            }
            await movieActors.destroy({
                where: {
                    movie_Id: movie_id
                }
            });
            await movie.destroy();
            res.json({
                status: 'ok',
                message: 'Movie deleted successfully',
            });
        } catch (e) {
            next(e);
        }
    };
    

}

export default AdminController;
