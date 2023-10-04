import Joi from 'joi';

export default {
  register: {
    body: {
      firstName: Joi.string().pattern(/^[a-zA-Z]+$/).trim().required(),
      lastName: Joi.string().pattern(/^[a-zA-Z]+$/).trim().required(),
      country: Joi.string().pattern(/^[a-zA-Z]+$/).trim().required(),
      address: Joi.string().pattern(/^[a-zA-Z]+$/).trim().required(),
      city: Joi.string().pattern(/^[a-zA-Z]+$/).trim().required(),
      phone: Joi.number(),
      email: Joi.string().email().required(),
      password: Joi.string().trim().min(5),
    },
  },
  login: {
    body: {
      email: Joi.string().trim().required(),
      password: Joi.string().trim().required(),
    },
  },
};
