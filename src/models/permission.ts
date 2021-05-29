import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const Schema = mongoose.Schema;

interface IPermission extends mongoose.Document
{
	name: string;
}

const PermissionSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	}
});

PermissionSchema.plugin(uniqueValidator);

const Permission = mongoose.model<IPermission>('permission', PermissionSchema);

export { Permission };
export { IPermission };