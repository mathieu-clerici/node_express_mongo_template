import mongoose, { Mongoose } from 'mongoose';

const options = {
	useUnifiedTopology: true
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