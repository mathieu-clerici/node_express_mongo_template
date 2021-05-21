
import supertest from 'supertest';

import app from '../app';

import { Role } from '../models/role';

import 
{ 
	Auth,
	loginUser, 
	loginAdmin, 
	connectAndSeedDb,
	disconnectAndDropDb
} from'../utils/test-utils';

beforeAll(async (done) => await connectAndSeedDb(done));

afterAll(async (done) => await disconnectAndDropDb(done));

describe('GET /api/v1/roles', () => {    

	it('should fail for unathenticated users', async done => {
		await supertest(app).get('/api/v1/roles')
			.set('Accept', 'application/json')
			.expect(401)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Authentication failed!');
				done();
			});
	});

	it('should fail for user without permissions', async done => {
		const auth = new Auth();
		await loginUser(app, auth);

		await supertest(app).get('/api/v1/roles')
			.set('Authorization', `Bearer ${auth.token}`)
			.set('Accept', 'application/json')
			.expect(403)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Not allowed.');
				done();
			});
	});

	it('should return roles for users with permission', async done => {
		const auth = new Auth();
		await loginAdmin(app, auth);

		await supertest(app).get('/api/v1/roles')
			.set('Authorization', `Bearer ${auth.token}`)
			.set('Accept', 'application/json')
			.expect(200)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.roles.length).toBeGreaterThan(0);
				expect(response.body.roles[0].permissions.length).toBeGreaterThan(0);
				done();
			});   
	});
});


describe('POST /api/v1/roles', () => {    

	it('should fail for unathenticated users', async done => {
		await supertest(app).post('/api/v1/roles')
			.send({ name: 'john', permissions: [] })
			.set('Accept', 'application/json')
			.expect(401)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Authentication failed!');
				done();
			});
	});

	it('should fail for user without permissions', async done => {
		const auth = new Auth();
		await loginUser(app, auth);

		await supertest(app).post('/api/v1/roles')
			.send({ name: 'john', permissions: [] })
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${auth.token}`)
			.expect(403)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Not allowed.');
				done();
			});
	});

	it('should fail if name is missing', async done => {
		const auth = new Auth();
		await loginAdmin(app, auth);

		await supertest(app).post('/api/v1/roles')
			.set('Authorization', `Bearer ${auth.token}`)
			.send({ permissions: [] })
			.set('Accept', 'application/json')
			.expect(422)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Invalid inputs.');
				done();
			});   
	});

	it('should fail if name is less than 4 characters', async done => {
		const auth = new Auth();
		await loginAdmin(app, auth);

		await supertest(app).post('/api/v1/roles')
			.set('Authorization', `Bearer ${auth.token}`)
			.send({ name: '123', permissions: [] })
			.set('Accept', 'application/json')
			.expect(422)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Invalid inputs.');
				done();
			});   
	});

	it('should fail if permission is missing', async done => {
		const auth = new Auth();
		await loginAdmin(app, auth);

		await supertest(app).post('/api/v1/roles')
			.set('Authorization', `Bearer ${auth.token}`)
			.send({ name: 'test' })
			.set('Accept', 'application/json')
			.expect(422)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Invalid inputs.');
				done();
			});   
	});

	it('should fail if permission is not an array', async done => {
		const auth = new Auth();
		await loginAdmin(app, auth);

		await supertest(app).post('/api/v1/roles')
			.set('Authorization', `Bearer ${auth.token}`)
			.send({ name: 'test', permissions: 42 })
			.set('Accept', 'application/json')
			.expect(422)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Invalid inputs.');
				done();
			});   
	});

	it('should create role for users with correct permission and payload', async done => {
		const auth = new Auth();
		await loginAdmin(app, auth);

		await supertest(app).post('/api/v1/roles')
			.set('Authorization', `Bearer ${auth.token}`)
			.send({ name: 'john', permissions: [] })
			.set('Accept', 'application/json')
			.expect(201)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.role).toBeDefined();
				expect(response.body.role.permissions.length).toBeGreaterThan(0);
				done();
			});   
	});
});

describe('PATCH /api/v1/roles', () => {    

	it('should fail for unathenticated users', async done => {
		const role = await Role.findOne({ name: 'user' }).exec();

		await supertest(app).patch(`/api/v1/roles/${role?._id}`)
			.send({ name: 'john', permissions: [] })
			.set('Accept', 'application/json')
			.expect(401)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Authentication failed!');
				done();
			});
	});

	it('should fail for user without permissions', async done => {
		const auth = new Auth();
		await loginUser(app, auth);

		const role = await Role.findOne({ name: 'user' }).exec();

		await supertest(app).patch(`/api/v1/roles/${role?._id}`)
			.send({ name: 'john', permissions: [] })
			.set('Accept', 'application/json')
			.set('Authorization', `Bearer ${auth.token}`)
			.expect(403)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Not allowed.');
				done();
			});
	});

	it('should fail if name is missing', async done => {
		const auth = new Auth();
		await loginAdmin(app, auth);

		const role = await Role.findOne({ name: 'user' }).exec();

		await supertest(app).patch(`/api/v1/roles/${role?._id}`)
			.set('Authorization', `Bearer ${auth.token}`)
			.send({ permissions: [] })
			.set('Accept', 'application/json')
			.expect(422)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Invalid inputs.');
				done();
			});   
	});

	it('should fail if name is less than 4 characters', async done => {
		const auth = new Auth();
		await loginAdmin(app, auth);

		const role = await Role.findOne({ name: 'user' }).exec();

		await supertest(app).patch(`/api/v1/roles/${role?._id}`)
			.set('Authorization', `Bearer ${auth.token}`)
			.send({ name: '123', permissions: [] })
			.set('Accept', 'application/json')
			.expect(422)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Invalid inputs.');
				done();
			});   
	});

	it('should fail if permission is missing', async done => {
		const auth = new Auth();
		await loginAdmin(app, auth);

		const role = await Role.findOne({ name: 'user' }).exec();

		await supertest(app).patch(`/api/v1/roles/${role?._id}`)
			.set('Authorization', `Bearer ${auth.token}`)
			.send({ name: 'test' })
			.set('Accept', 'application/json')
			.expect(422)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Invalid inputs.');
				done();
			});   
	});

	it('should fail if permission is not an array', async done => {
		const auth = new Auth();
		await loginAdmin(app, auth);

		const role = await Role.findOne({ name: 'user' }).exec();

		await supertest(app).patch(`/api/v1/roles/${role?._id}`)
			.set('Authorization', `Bearer ${auth.token}`)
			.send({ name: 'test', permissions: 42 })
			.set('Accept', 'application/json')
			.expect(422)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Invalid inputs.');
				done();
			});   
	});

	it('should say not found for invalid role Ids', async done => {
		const auth = new Auth();
		await loginAdmin(app, auth);

		const role = await Role.findOne({ name: 'user' }).exec();

		await supertest(app).delete(`/api/v1/roles/${role?._id}`)
			.set('Authorization', `Bearer ${auth.token}`)
			.set('Accept', 'application/json')
			.expect(404)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Role not found.');
				done();
			});   
	});

	it('should update role for users with correct permission and payload', async done => {
		const auth = new Auth();
		await loginAdmin(app, auth);

		const role = await Role.findOne({ name: 'user' }).exec();

		await supertest(app).patch(`/api/v1/roles/${role?._id}`)
			.set('Authorization', `Bearer ${auth.token}`)
			.send({ name: 'john', permissions: [] })
			.set('Accept', 'application/json')
			.expect(200)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.role).toBeDefined();
				expect(response.body.role.permissions.length).toBeGreaterThan(0);
				done();
			});   
	});
});

describe('DELETE /api/v1/roles', () => {    

	it('should fail for unathenticated users', async done => {
		const role = await Role.findOne({ name: 'user' }).exec();

		await supertest(app).delete(`/api/v1/roles/${role?._id}`)
			.set('Accept', 'application/json')
			.expect(401)
			.expect('Content-Type', /json/)
			.then((response) => {
				expect(response.body.message).toBe('Authentication failed!');
				done();
			});

		it('should fail for user without permissions', async done => {
			const auth = new Auth();
			await loginUser(app, auth);
	
			const role = await Role.findOne({ name: 'user' }).exec();
	
			await supertest(app).delete(`/api/v1/roles/${role?._id}`)
				.set('Accept', 'application/json')
				.set('Authorization', `Bearer ${auth.token}`)
				.expect(403)
				.expect('Content-Type', /json/)
				.then((response) => {
					expect(response.body.message).toBe('Not allowed.');
					done();
				});
		});

		it('should say not found for invalid role Ids', async done => {
			const auth = new Auth();
			await loginAdmin(app, auth);

			const madeUpId = '42';
	
			await supertest(app).delete(`/api/v1/roles/${madeUpId}`)
				.set('Authorization', `Bearer ${auth.token}`)
				.set('Accept', 'application/json')
				.expect(404)
				.expect('Content-Type', /json/)
				.then((response) => {
					expect(response.body.message).toBe('Role not found.');
					done();
				});   
		});

		it('should delete role for users with correct permission', async done => {
			const auth = new Auth();
			await loginAdmin(app, auth);
	
			const role = await Role.findOne({ name: 'user' }).exec();
	
			await supertest(app).delete(`/api/v1/roles/${role?._id}`)
				.set('Authorization', `Bearer ${auth.token}`)
				.set('Accept', 'application/json')
				.expect(200)
				.expect('Content-Type', /json/)
				.then((response) => {
					expect(response.body.message).toBe('Role deleted.');
					done();
				});   
		});
	
	});
});