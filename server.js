import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import  'express-async-errors'
import morgan from 'morgan'
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';

// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js'

//db and authenticateUser
import connectDB from './db/connect.js';

//routers
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobsRoutes.js';

const app = express();
dotenv.config()

if(process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
} 
const corsOptions = {
    origin: true,
    credentials: true,
};
app.use(cors(corsOptions))
app.use(express.json())
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Welcome!')
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error);
    }
}

start()