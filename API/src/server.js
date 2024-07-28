import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
// import fs from 'fs';
import dotenv from 'dotenv';
// const session = require('express-session');
import dbConnect from './dbo.js';
// import user from './routes/user.js';
import login from './routes/login.js';
import posts from './routes/posts.js';
import expressEjsLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import { googleAuth, googleAuthCallback, handleAuthCallback, handleLogin } from './controllers/login.js';
import session from 'express-session';

const app = express();
const corsOptions = {
    // origin: "http://localhost:3000",
    origin: ["https://localhost:3000", "https://127.0.0.1:3000"],
    // origin: "https://127.0.0.1:3000",
    // origin: "*",
    credentials: true, //access-control-allow-credentials:true
    // optionSuccessStatus: 200,
};

dotenv.config();
app.use(cors(corsOptions));
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.use(expressEjsLayouts);

// app.use(express.static(path.join(__dirname, 'public')));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.set('trust proxy', 1);

// app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

// app.use(cors());
app.use(helmet());

app.use(session({
    secret: 'MA_SESSION_SECRET',
    resave: false,
    saveUninitialized: true,
    store: new session.MemoryStore()
}));

app.use(passport.initialize());
app.use(passport.session());

// Serialize/deserialize user (if needed)
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.urlencoded({ extended: false }));


// ----------------------- Connection to Database ------------------------

// dbConnect();

// ---------------------------------------------- All Routes -------------------------------------------


app.get("/", (req, res) => {
    return res.send('Hii!');
});

app.use('/api/login', login);
app.use('/api/posts', posts);

app.get('/auth/google', handleLogin);
app.get('/auth/google/callback', handleAuthCallback);

// app.use(`/.netlify/functions/api`, router);

const port = process.env.PORT || 3008;

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});