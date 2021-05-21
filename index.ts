import app from './app';
import { connectToDb } from './utils/db';
//import { seedAll } from  './utils/seeds';

const port = process.env.PORT || 3000;

const {
	MONGO_USERNAME,
	MONGO_PASSWORD,
	MONGO_HOSTNAME,
	MONGO_PORT,
	MONGO_DB,
} = process.env;

const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

connectToDb(uri).then(() => {
	app.listen(port, async function () {
		console.log(`App connected to mongo, listening on ${port}!`);
		//await seedAll();
	});
}).catch((err: Error) => console.log(err));