import supertest from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { seedAll } from './seeds';
import { connectToDb, closeDb, dropDb } from './db';

const mongod = new MongoMemoryServer();

const simpleUserEmail = 'simple-user@mathieuclerici.com';
const businessOwnerEmail = 'business-owner@mathieuclerici.com';
const adminEmail = 'admin@mathieuclerici.com';
const testPassword = 'mtc123!!';

class Auth 
{
	token?: string;
}

async function login(app, auth, email, password)  : Promise<void>  {
	await supertest(app).post('/api/v1/users/login')
		.send({
			email: email,
			password: password
		})
		.expect(200)
		.expect('Content-Type', /json/)
		.then(onResponse);
	//.end(onResponse);

	function onResponse(res) {
		auth.token = res.body.token;
	}
}

function loginUser(app, auth : Auth) : Promise<void>  {
	return login(app, auth, simpleUserEmail, testPassword);
}

function loginBusinessOwner(app, auth : Auth) : Promise<void>  {
	return login(app, auth, businessOwnerEmail, testPassword);
}

function loginAdmin(app, auth : Auth) : Promise<void>  {
	return login(app, auth, adminEmail, testPassword);
}

async function connectAndSeedDb(done) : Promise<void>  {
	try {
		await connectToDb(await mongod.getUri());
		await seedAll();
		done();
	} catch(e) {
		done(e);
	}
}

async function disconnectAndDropDb(done) : Promise<void> {
	try {
		await dropDb();
		await closeDb();
		await mongod.stop();
		done();  
	} catch(e) {
		done(e);
	}
}

export { loginUser };
export { loginBusinessOwner };
export { loginAdmin };
export { connectAndSeedDb };
export { disconnectAndDropDb };
export { Auth };