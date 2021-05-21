import jwt from 'jsonwebtoken';

import HttpError from '../models/http-error';
import Token from '../models/token';

const JWT_KEY = process.env.JWT_KEY || '';


const checkAuth = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}
	try {
		const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
		if (!token) {
			throw new Error('Authentication failed!');
		}
		const decodedToken = jwt.verify(token, JWT_KEY) as Token;
		req.userData = { userId: decodedToken.userId, email: decodedToken.email };
		next();
	} catch (err) {
		const error = new HttpError(401, 'Authentication failed!');
		return next(error);
	}
};

export default checkAuth;