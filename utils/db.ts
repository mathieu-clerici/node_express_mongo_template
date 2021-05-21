import mongoose, { Mongoose } from 'mongoose';

const options = {
	useNewUrlParser: true,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 500,
	connectTimeoutMS: 10000,
};

const connectToDb = (uri: string) : Promise<Mongoose> => {
	return mongoose.connect(uri, options);
};

const dropDb = () : Promise<void> => {
	return mongoose.connection.dropDatabase();
};

const closeDb = async () : Promise<void> => {
	return mongoose.connection.close();
};

export { connectToDb };
export { closeDb };
export { dropDb };