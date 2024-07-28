// const { validationUser } = require("../helper");
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { loginByGoogleService } from "../services/login.js";
// import passport from 'passport';
import passport from '../services/googleStrategy.js';
import jwt from 'jsonwebtoken';

export const getUserLogin = async (req, res) => {
    try {
        // const result = await getUserLoginService(req, User, Role, UserRole, bcrypt);
        // return res.status(result.status).send({ success: true, data: result });

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

export const loginByGoogle = async (req, res) => {
    try {
        const result = await loginByGoogleService(req);
        return res.status(result.status).send(result);

    } catch (error) {
        return res.status(500).send({ success: false, message: 'Something went wrong', error: error });
    }
};

// // Route handler for initiating Google authentication
// export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// // Route handler for handling Google authentication callback
// export const googleAuthCallback = (req, res, next) => {
//     passport.authenticate('google', { failureRedirect: '/login' })(req, res, next);
// };

// // Callback after successful authentication
// export const handleSuccessfulAuth = (req, res) => {
//     // Successful authentication, redirect or respond with token/session
//     res.redirect('/');
// };


export const handleGetUserInfo = (req, res) => {
    try {
        let result = req.sessionStore.sessions;

        req.session.destroy(err => {
            if (err) {
              console.error('Error destroying session:', err);
            }
        });
        res.send({ success: 'success', data: result, status: 200 });
    } catch (error) {
        return error
    }
};

export const googleAuthCallback1 = (req, res) => {
    try {
        passport.authenticate('google', { failureRedirect: '/login', session: false },
            (first, sec, third, req, res) => {
                debugger
                console.log('user====', first, sec, third);
                const token = jwt.sign({ user: req.user }, 'your_secret_key', { expiresIn: '1h' });
                res.cookie('authToken', token, { httpOnly: true });
                // res.redirect('http://localhost:3000/dashboard');
                // res.redirect('https://localhost:3000/dashboard');
                res.redirect('https://127.0.0.1:3000/dashboard');
            }
        );
    } catch (error) {
        return error
    }
};

export function handleLogin(req, res, next) {
    debugger
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

// Function to handle authentication callback
export function handleAuthCallback(req, res, next) {
    // Call the passport.authenticate middleware with 'google' strategy
    // passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' })(req, res, () => {
    // passport.authenticate('google', { failureRedirect: 'https://localhost:3000/login' })(req, res, () => {
    passport.authenticate('google', { failureRedirect: 'https://127.0.0.1:3000/login' })(req, res, () => {
        console.log(req, res);
        debugger
        req.session.userInfo = req.authInfo;
        // req.session.save();
        // const token = jwt.sign({ user: req.user }, 'ma_secret_key', { expiresIn: '1h' });
        // res.cookie('authToken', token, { httpOnly: true });
        // res.redirect('http://localhost:3000/login');
        // res.redirect('https://localhost:3000/login');
        res.redirect('https://127.0.0.1:3000/login');
    });
};


// Route handler for initiating Google authentication
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
// Route handler for handling Google authentication callback
// export const googleAuthCallback = passport.authenticate('google', { failureRedirect: '/login', successRedirect: "http://localhost:3000/dashboard", session: false });
export const googleAuthCallback = passport.authenticate('google', { failureRedirect: '/login', session: false }, handleSuccessfulAuth);

// Callback after successful authentication
export function handleSuccessfulAuth(req, res, th) {
    debugger
    // console.log('user====', req.user);
    const token = jwt.sign({ user: req.user }, 'your_secret_key', { expiresIn: '1h' });
    // res.cookie('authToken', token, { httpOnly: true });
    // Successful authentication, redirect or respond with token/session
    // res.redirect('http://localhost:3000/dashboard');
}