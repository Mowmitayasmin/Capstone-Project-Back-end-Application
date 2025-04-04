import express, {Express} from 'express';
import helmet from "helmet";
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import swaggerConfig from '../config/swagger';
import customErrorHandler from './api/v1/middleware/customErrorHandler';
import loanRouter from './api/v1/routes/loan';
import userRoutes from './api/v1/routes/user';
import adminRoutes from './api/v1/routes/admin';
import branchRoutes from './api/v1/routes/branch';
dotenv.config();
  
const app : Express = express();
app.use(helmet());
app.use(morgan('combined'))
app.use(express.json());
app.use(cors())
swaggerConfig(app)

app.use('/api/v1/loan', loanRouter)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/branch', branchRoutes)



app.get("/", (req, res) => {
    res.send('You are landed an empty ocean')
})

app.use(customErrorHandler)

export default app

