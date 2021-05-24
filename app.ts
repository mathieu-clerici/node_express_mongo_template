import express from 'express';

import dotEnv from 'dotenv';

import HttpError from './models/http-error';
import usersRoutes from './routes/users';
import permissionsRoutes from './routes/permissions';
import rolesRoute from './routes/roles';

dotEnv.config();

const app = express();

app.use(express.json());

const version = 'v1';
const rootUrl = `/api/${version}`;

app.use(`${rootUrl}/users`, usersRoutes);
app.use(`${rootUrl}/permissions`, permissionsRoutes);
app.use(`${rootUrl}/roles`, rolesRoute);

//Unknown rout handler
app.use((req, res, next) => {
	throw new HttpError(404, 'Invalid route.');
});

//Error handler
app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({message: error.message || 'An unknow error occurred.'});
});

export default app;
