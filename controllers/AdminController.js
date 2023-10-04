import Movies from "../models/Movies";
import Actor from "../models/Actor";
import path from "path";
import {v4 as uuidv4} from "uuid";
import sharp from "sharp";

class AdminController {
    static addMovie = async (req, res, next) => {
        try {
            const {
                title,
                rating,
                description,
                trailer_url,
                picture_url,
                year,
                country,
                category,
                actor_name,
            } = req.body;
            const { file } = req;

            let actorAvatar = null;

            if (file) {
                actorAvatar = path.join('/images/actorsAvatar', uuidv4() + '-' + file.originalname);
                await Promise.all([
                    sharp(file.path)
                        .rotate()
                        .resize(256)
                        .jpeg({
                            mozjpeg: true
                        })
                        .toFile(path.resolve(path.join('./public', actorAvatar))),
                    sharp(file.path)
                        .rotate()
                        .resize(256)
                        .webp({})
                        .toFile(path.resolve(path.join('./public', actorAvatar + '.webp')))
                ])
            }

            const movie = await Movies.create({
                title,
                rating,
                description,
                trailer_url,
                picture_url,
                year,
                country,
            });

            if (actor_name && actor_name.length > 0) {
                for (const actorName of actor_name) {
                    let actor = await Actor.findOne({
                        where: {
                            actor_name: actorName, // Используйте actor_name для поиска
                        },
                    });

                    if (!actor) {
                        actor = await Actor.create({
                            actor_name: actorName, // Используйте actor_name для создания актёра
                        });
                    }
                    await movie.addActor(actor);
                }
            }


            if (category && category.length > 0) {
                await movie.setCategories(category);
            }

            const categories = await movie.getCategories(22);

            const linkedActors = await movie.getActors();
            res.json({
                status: 'ok',
                movie,
                linkedActors,
                categories
            });
        } catch (e) {
            next(e);
        }
    };
}

export default AdminController;
