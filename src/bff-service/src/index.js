import express from 'express';
import dotenv from 'dotenv';

import { getCartController, getProductController } from './controllers';
import { getErrorMiddleware, getCheckIfHandledMiddleware } from './middlewares';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
// HEADERS (AUTHORIZATION) EXPOSE

const createBFFRouter = () => {
	const router = express.Router();

	router.all('/cart/*', getCartController());
	router.all('/product/*', getProductController());
	router.use(getCheckIfHandledMiddleware());
	router.use(getErrorMiddleware());

	return router;
};

app.use(express.json());

app.all('*', createBFFRouter());

app.listen(PORT, () => console.log('BFF service has been started at port', PORT));
