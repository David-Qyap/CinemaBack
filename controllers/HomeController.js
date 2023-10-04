import {Movies} from "../models/index";

class HomeController {
  static homePage = async (req, res, next) => {
     try {
      const allFilms = await Movies.findAll() || [];
      res.json({
        status: 'ok',
        allFilms
      });
    } catch (e) {
      next(e);
    }
  };
}

export default HomeController;
