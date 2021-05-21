import validateIsAuthorized from '../utils/validate-is-authorized';
import { Permission } from '../models/permission';
import 
{ 
	PERMISSION_GET_ALL_PERMISSION, 
} from '../permissions/index';

const getAllPermissions = async (req, res, next) : Promise<void> => {
	const isAllowed = await validateIsAuthorized(req, next, PERMISSION_GET_ALL_PERMISSION);

	if (isAllowed){
		const permissions = await Permission.find().exec();
		res.json({permissions : permissions.map((p) => p.toObject({ getters: true }))});
	}
};

export { getAllPermissions };