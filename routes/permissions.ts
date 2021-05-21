import { Router } from 'express';
//import { check } from 'express-validator';

import 
{ 
	getAllPermissions
} from '../controllers/permissions';

import checkAuth from '../middleware/check-auth';

const router = Router();

//Everything below this point needs authenticated user
router.use(checkAuth);

router.get('/', getAllPermissions);

export default router;