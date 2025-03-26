import express, {Express} from 'express';
import dotenv from 'dotenv';

dotenv.config();
  
const app : Express = express();


app.get("/", (req, res) => {
    res.send('You are landed an empty ocean')
})

export default app