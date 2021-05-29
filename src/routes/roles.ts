import { Router } from 'express';
import { check } from 'express-validator';

import 
{ 
	getAllRoles,
	createRole,
	updateRole,
	deleteRole
} from '../controllers/roles';

import checkAuth from '../middleware/check-auth';

const router = Router();

//Everything below this point needs authenticated user
router.use(checkAuth);

router.get('/', getAllRoles);

router.post(
	'/', 
	[
		check('name')
			.not()
			.isEmpty(),
		check('name')
			.isLength({ min: 4 }),
		check('permissions')
			.not()
			.isEmpty(),
		check('permissions')
			.isArray()
	],
	createRole
);

router.patch(
	'/:rid', 
	[
		check('name')
			.not()
			.isEmpty(),
		check('name')
			.isLength({ min: 5 })
	],
	updateRole
);

router.delete('/:rid', deleteRole);

export default router;