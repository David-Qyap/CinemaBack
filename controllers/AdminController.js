import Movies from '../models/Movies'
import Actor from '../models/Actor'
import path from 'path'
import {v4 as uuidv4} from 'uuid'
import sharp from 'sharp'
import HttpError from 'http-errors'
class AdminController {
    static addMovie = async (req, res, next) => {
        try {
            const { files } = req

            const {
                title,
                rating,
                description,
                trailer_url,
                year,
                country,
                actor_name,
            } = req.body

            let moviePhoto = null
            let actorPhoto = null

            if (files) {
                for (const fieldName in files) {
                    if (fieldName === 'moviePhoto' || fieldName === 'actorPhoto') {
                        const photoType = fieldName === 'moviePhoto' ? 'moviePhoto' : 'actorPhoto'

                        const file = files[fieldName][0] // Получаем информацию о файле

                        const photoPath = path.join('/images/', photoType, uuidv4() + '-' + file.originalname)

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
                                .toFile(path.resolve(path.join('./public', photoPath + '.webp')))
                        ])

                        if (photoType === 'moviePhoto') {
                            moviePhoto = photoPath
                        } else {
                            actorPhoto = photoPath
                        }
                    }
                }
            }

            const movieData = await Movies.create({
                title,
                rating,
                description,
                trailer_url,
                picture_url: moviePhoto,
                year,
                country,
            })

            let actors = []

            if (Array.isArray(actor_name)) {
                for (let i = 0; i < actor_name.length; i++) {
                    const newActor = await Actor.create({ actor_name: actor_name[i], photo_url: actorPhoto })
                    actors.push(newActor)
                }
            } else {
                const newActor = await Actor.create({ actor_name, photo_url: actorPhoto })
                actors.push(newActor)
            }

            const actorIds = actors.map(actor => actor.actor_id)
            await movieData.addActors(actorIds)

            const movieActors = await movieData.getActors()

            for (let i = 0; i < movieActors.length; i++) {
                movieActors[i].photo_url = actorPhoto
                await movieActors[i].save()
            }

            res.json({
                status: 'ok',
                movieData,
                movieActors,
            })
        } catch (e) {
            next(e)
        }
    }



    static findMovie = async (req, res, next) => {
        try {
            const {title} = req.body

            const movies = await Movies.findAll({
                where: {
                    title:   {
                        $like: `%${title}%`
                    }
                },
            })
            console.log(movies)
            res.json({
                status: 'ok',
                movies,
            })
        } catch (e) {
            next(e)
        }
    }
    static updateMovie = async (req, res, next) => {
        try {
            const { movie_id } = req.query

            const movie = await Movies.findOne({
                where: {
                    movie_id: movie_id,
                },
            })

            if (!movie) {
                throw new HttpError(404, 'User not found')
            }

            const {
                title,
                rating,
                description,
                trailer_url,
                picture_url,
                year,
                country
            } = req.body

            await movie.update({
                title,
                rating,
                description,
                trailer_url,
                picture_url,
                year,
                country
            })

            res.json({
                status: 'ok',
                movie
            })
        } catch (e) {
            next(e)
        }
    }



}

export default AdminController
