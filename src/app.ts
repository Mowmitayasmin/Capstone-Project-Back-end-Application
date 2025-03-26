import express, {Express} from 'express';
import dotenv from 'dotenv';
import helmet from "helmet";
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();
  
const app : Express = express();
app.use(helmet());
app.use(morgan('combined'))
app.use(express.json());
app.use(cors())


app.get("/", (req, res) => {
    res.send('You are landed an empty ocean')
})

export default app