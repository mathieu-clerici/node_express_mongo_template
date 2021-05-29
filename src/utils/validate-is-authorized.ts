import HttpError from '../models/http-error';
import User from '../models/user';

const validateIsAuthorized = async (req, next, permissionName) : Promise<boolean> => {
	const userId = req.userData.userId;
	const user = await User.findById(userId)
		.populate({ 
			path: 'role',
			populate: {
				path: 'permissions',
				model: 'permission'
			} 
		})
		.exec();

	const permissionNames = user?.role?.permissions?.map((p) => {
		return p.name;
	});

	if (!permissionNames || permissionNames.indexOf(permissionName) === -1) {
		next(new HttpError(403, 'Not allowed.'));
		return false;
	}
	return true;
};

export default validateIsAuthorized;