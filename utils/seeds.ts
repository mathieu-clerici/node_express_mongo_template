import mongoose = require('mongoose');

import User from '../models/user';
import { Permission } from '../models/permission';
import { Role } from '../models/role';

import { 
	PERMISSION_GET_ALL_USER, 
	PERMISSION_CREATE_USER,
	PERMISSION_GET_ALL_ROLE,
	PERMISSION_GET_ALL_PERMISSION,
	PERMISSION_CREATE_ROLE,
	PERMISSION_UPDATE_ROLE,
	PERMISSION_DELETE_ROLE
} from '../permissions/index';


const seedUsers = async () : Promise<void> => {
	//try { await mongoose.connection.db.dropCollection('users'); }
	const adminRole = await Role.findOne({ name: 'admin' }).exec();

	const admin = new User({
		email: 'admin@mathieuclerici.com',
		password: 'mtc123!!',
		verified: true,
		role: adminRole!._id,
	});
	
	const businessOwner = new User({
		email: 'business-owner@mathieuclerici.com',
		password: 'mtc123!!',
		verified: true,
	});
	
	const simpleUser = new User({
		email: 'simple-user@mathieuclerici.com',
		password: 'mtc123!!',
		verified: true,
	});
	
	await admin.save();
	await businessOwner.save();
	await simpleUser.save();
};

const seedPermission = async () : Promise<void> => {
	const permission1 = new Permission({
		name: PERMISSION_GET_ALL_USER,
	});

	const permission2 = new Permission({
		name: PERMISSION_CREATE_USER,
	});

	const permission3 = new Permission({
		name: PERMISSION_GET_ALL_ROLE,
	});

	const permission4 = new Permission({
		name: PERMISSION_GET_ALL_PERMISSION,
	});

	const permission5 = new Permission({
		name: PERMISSION_CREATE_ROLE,
	});

	const permission6 = new Permission({
		name: PERMISSION_UPDATE_ROLE,
	});

	const permission7 = new Permission({
		name: PERMISSION_DELETE_ROLE,
	});

	await permission1.save();
	await permission2.save();
	await permission3.save();
	await permission4.save();
	await permission5.save();
	await permission6.save();
	await permission7.save();
};

const seedRoles = async () : Promise<void> => {
	const permissions = await Permission.find().exec();

	const adminRole = new Role({
		name: 'admin',
		permissions: permissions.map((p) => {
			return p._id;
		})
	});

	const userRole = new Role({
		name: 'user',
	});

	await adminRole.save();
	await userRole.save();
};

const seedAll = async () : Promise<void> => {
	await seedPermission();
	await seedRoles();
	await seedUsers();
};

export { seedUsers };
export { seedPermission };
export { seedRoles };
export { seedAll };

/*

const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();

    */