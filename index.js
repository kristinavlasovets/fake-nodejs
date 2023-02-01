import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import fakeRouter from './routers/fakeRouter.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors({origin: '*'}));
app.use('/api', fakeRouter);

app.listen(PORT, () => {
	console.log(`Server started at ${PORT}`);
});
