import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { IPermission } from './permission';

const Schema = mongoose.Schema;

interface IRole extends mongoose.Document
{
	name: string;
	permissions : IPermission[];
}

const RoleSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	permissions: { 
		type: [Schema.Types.ObjectId], 
		ref: 'permission' 
	}
});

RoleSchema.plugin(uniqueValidator);

const Role = mongoose.model<IRole>('role', RoleSchema);

export { Role };
export { IRole };