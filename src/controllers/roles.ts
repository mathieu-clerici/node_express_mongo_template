import HttpError from '../models/http-error';
import validateRequest from '../utils/validate-request';
import validateIsAuthorized from '../utils/validate-is-authorized';
import { Role } from '../models/role';

import
{ 
	PERMISSION_GET_ALL_ROLE, 
	PERMISSION_CREATE_ROLE,
	PERMISSION_UPDATE_ROLE,
	PERMISSION_DELETE_ROLE
} from '../permissions/index';

const getAllRoles = async (req, res, next) : Promise<void> => {
	const isAllowed = await validateIsAuthorized(req, next, PERMISSION_GET_ALL_ROLE);

	if (isAllowed){
		const roles = await Role.find()
			.populate({
				path: 'permissions',
				model: 'permission'
			}).exec();

		res.json({roles : roles.map(r => r.toObject({ getters: true }))});
	}
};

const createRole = async (req, res, next) : Promise<void> => {
	validateRequest(req, next);

	const isAllowed = await validateIsAuthorized(req, next, PERMISSION_CREATE_ROLE);

	if (isAllowed) {
		const { name, permissions } = req.body;
		const createdRole = new Role({
			name,
			permissions
		});

		await createdRole.save();
		res.status(201).json({ role: createdRole.toObject({ getters: true }) });
	}
};

const updateRole = async (req, res, next) : Promise<void> => {
	validateRequest(req, next);

	const isAllowed = await validateIsAuthorized(req, next, PERMISSION_UPDATE_ROLE);

	if (isAllowed) {
		const { name, permissions } = req.body;
		const roleId = req.params.rid;
		const role = await Role.findById(roleId);

		if (!role) {
			return next(new HttpError(404, 'Role not found.'));
		}

		role.name = name;
		role.permissions = permissions;

		await role.save();
		res.status(200).json({ role: role.toObject({ getters: true }) });
	}
};

const deleteRole = async (req, res, next) : Promise<void> => {
	validateRequest(req, next);

	const isAllowed = await validateIsAuthorized(req, next, PERMISSION_DELETE_ROLE);
    
	if (isAllowed) {
		const roleId = req.params.rid;
		const role = await Role.findById(roleId);

		if (!role) {
			return next(new HttpError(404, 'Role not found.'));
		}

		await role.remove();
		res.status(200).json({ message: 'Role deleted.'});
	}
};

export { getAllRoles };
export { createRole };
export { updateRole };
export { deleteRole };
