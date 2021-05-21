import { validationResult } from 'express-validator';

import HttpError from '../models/http-error';

const validateRequest = (req, next) : void => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError(422, 'Invalid inputs.')
		);
	}
};

export default validateRequest;