//modules
const connectDB = require('./utils/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = process.env.PORT || 3000;

//load .env file
require('dotenv').config();


//set cors policy
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));

app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Custom middleware to log requests with formatted time, method, URL, and response code
function getFormattedDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
    const time = now.toLocaleTimeString('en-GB'); // Format: HH:MM:SS
    return `${date} ${time}`;
}

app.use((req, res, next) => {
    const startTime = new Date();
    let url = req.url;
    res.on('finish', () => {
        const elapsedTime = new Date() - startTime;
        console.log(`[${getFormattedDateTime()}] ${req.method} ${url} - ${res.statusCode} (${elapsedTime}ms)`);
    });
    
    next();
});


//import passport strategies
require('./utils/passport');


//routes
const authRoutes = require('./routes/authentication');
const questionRoutes = require('./routes/questions');
const userRoutes = require('./routes/user');
const {router:accountRoutes} = require('./routes/account');
const commentsRouter = require('./routes/comments');
const companyRoutes = require('./routes/company');
const faqRoutes = require('./routes/faq');



connectDB().then(() => {
    app.listen(port, '0.0.0.0',() => {
        console.log(`Server is running on http://0.0.0.0:${port}`);
    });
}).catch(error => {
    console.error('Database connection failed:', error);
});

// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));


// Middleware to check if session is restored
app.use((req, res, next) => {
    if (req.session.passport && req.session.passport.user) {
      req.session.sessionRestored = true;
    }
    next();
  });

app.use(passport.initialize());
app.use(passport.session());


app.use('/comment', (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
  });
  
  app.use('/comment', commentsRouter);

  
//routes middleware
app.use("/auth", authRoutes);
app.use("/", questionRoutes);
app.use("/user", userRoutes);
app.use("/account", accountRoutes);
app.use('/admin', adminRoutes);
app.use('/companies', companyRoutes);
app.use('/faq', faqRoutes);