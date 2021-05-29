import { Router } from 'express';
import { check } from 'express-validator';

import { 
	getAllUsers, 
	createUser,
	login,
	signup
} from '../controllers/users';

//import checkAuth from '../middleware/check-auth';

const router = Router();

//public routes
router.post('/login', 
	[
		check('email')
			.isEmail(),
		check('password')
			.isLength({ min: 6 })
	],
	login
);

router.post('/signup', 
	[
		check('email')
			.isEmail(),
		check('password')
			.isLength({ min: 6 })
	],
	signup
);

//Everything below this point needs authenticated user
//router.use(checkAuth);

router.get('/', getAllUsers);

router.post('/', 
	[
		check('email')
			.isEmail(),
		check('password')
			.isLength({ min: 6 })
	],
	createUser
);

export default router;