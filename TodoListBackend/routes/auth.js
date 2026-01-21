import express from 'express';
import { User } from '../models/models.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ username: req.body.username, password: hash });
    res.json(user);
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json(req.user);
});

router.post('/logout', isAuthenticated, (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.json({ message: "User logged out" });
    })
})

router.get('/user', isAuthenticated, (req, res) => {
    const { _id, username } = req.user;
    return res.json({ id: _id, username });
})

export default router;