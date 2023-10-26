import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import adminRouter from './routes/admin';
import usersRouter from './routes/users';
import Route from './routes/Routs.js';
import cors from "./middlewares/cors.js";

const app = express();

// view engine setup
app.set('views', path.join(path.resolve('views')));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve('public'))));
app.use('/users',cors, usersRouter);
app.use('/admin',cors, adminRouter);
app.use('/', Route);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    // render the error page
    res.status(err.status || 500);
    res.json({
        status: 'error',
        message: err.message,
        stack: err.stack,
        errors: err.errors,
    });
});

export default app;

