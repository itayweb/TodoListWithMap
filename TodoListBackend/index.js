import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import session from 'express-session';
import { configurePassport } from './passport-config.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', // Your Vite dev server
    credentials: true                // Allows cookies to be sent
}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb://admin:password@localhost:27017/local?authSource=admin"
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

configurePassport(passport);

app.use(passport.initialize());
app.use(passport.session());


// Basic Route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/v1', router);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});