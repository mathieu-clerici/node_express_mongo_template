import { sign, Secret } from 'jsonwebtoken';

import validateRequest from '../utils/validate-request';
import validateIsAuthorized from '../utils/validate-is-authorized';
import HttpError from '../models/http-error';
import User from '../models/user';
import 
{ 
	PERMISSION_GET_ALL_USER, 
	PERMISSION_CREATE_USER
} from '../permissions/';

const JWT_KEY = process.env.JWT_KEY || '';

const getAllUsers = async (req, res, next) : Promise<void> => {
	const isAllowed = await validateIsAuthorized(req, next, PERMISSION_GET_ALL_USER);

	if (isAllowed) {
		const users = await User.find()
			.select('-password -__v')
			.populate('role')
			.exec();
                                
		res.json({ users: users.map(user => user.toObject({ getters: true })) });
	}
};

const createUser = async (req, res, next) : Promise<void> => {
	validateRequest(req, next);

	const isAllowed = await validateIsAuthorized(req, next, PERMISSION_CREATE_USER);
    
	if (isAllowed) {
		const user = new User(req.body);
		await user.save(function(err, doc) {
			if (err) return console.error(err);
			console.log('Document inserted succussfully!');
		});
	}
};

const login = async (req, res, next) : Promise<void> => {
	validateRequest(req, next);

	const { email, password } = req.body;
	const user = await User.findOne({ email: email }).exec();
   
	if (!user){
		next(new HttpError(401, 'Invalid login.'));
		return;
	}
   
	user.comparePassword(password, function(err, isMatch) {
		if (err) next(err);

		if (!isMatch) {
			next(new HttpError(401, 'Invalid login.'));
		} else {
			const token = sign({ 
				userId: user._id,
				email: user.email
			}, 
			JWT_KEY, 
			{ expiresIn: '24h' });

			res.json({ 
				token: token,
				user: {
					id: user._id,
					email: user.email,
					verified: user.verified
				},
			});
		}
	});
};

const signup = async (req, res, next) : Promise<void> => {
	validateRequest(req, next);

	const { email, password } = req.body;
	const existingUser = await User.findOne({ email: email });
    
	if (existingUser) {
		return next(new HttpError(422, 'User exists already.'));
	}
    
	const newUser = new User({
		email,
		password
	});

	await newUser.save();

	const token = sign({ 
		userId: newUser._id,
		email: newUser.email
	}, 
	JWT_KEY, 
	{ expiresIn: '24h' });

	res.status(201)
		.json({ 
			token: token,
			user: {
				id: newUser._id,
				email: newUser.email,
				verified: newUser.verified
			}, 
		}
		);
};

export { getAllUsers };
export { createUser };
export { login };
export { signup };