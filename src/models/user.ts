import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';
import { IRole } from './role';


const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

interface IUser extends mongoose.Document
{
	password : string;
	email : string;
	verified : boolean;
	role: IRole;
	comparePassword(candidatePassword: string, 
					cb : (err : Error, isMath : boolean) => void) : Promise<boolean>;
}

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: { 
		type: String, 
		required: true 
	},
	signupDate: {
		type: Date,
		default: Date.now
	},
	role: { 
		type: Schema.Types.ObjectId, 
		ref: 'role' 
	},
	verified: {
		type: Boolean,
		default: false,
	}
});

UserSchema.pre<IUser>('save', function(next) {
	// only hash the password if it has been modified (or is new)
	if (!this.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) return next(err);
			// override the cleartext password with the hashed one
			this.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, (this as any).password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

UserSchema.plugin(uniqueValidator);

const User = mongoose.model<IUser>('user', UserSchema);

export default User;