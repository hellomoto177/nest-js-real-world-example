import * as request from 'supertest';
import { INestApplication, HttpStatus } from '@nestjs/common';
import testingTools from './utils';
import { CreateUserDTO } from 'src/modules/user/user.dto';
import { LoginDTO } from 'src/modules/auth/auth.dto';

describe('Registration', () => {
  let app: INestApplication;

  const correctUser: CreateUserDTO = {
    email: 'username@host.com',
    password: 'password',
    firstName: 'John',
    lastName: 'Doe',
  };

  beforeAll(async done => {
    await testingTools.dropDatabase();
    app = await testingTools.createApp();
    done();
  });

  afterAll(async done => {
    await app.close();
    done();
  });

  it('should ask all required fields', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send('')
      .expect(HttpStatus.BAD_REQUEST)
      .expect(({ body }) => {
        const { message } = body;
        expect(message).toBeDefined();
        expect(message).toHaveLength(4);

        message.forEach(errItem => {
          // Email
          if (errItem.property === 'email') {
            expect(
              Object.keys(errItem.constraints).some(
                errName => errName === 'isDefined',
              ),
            ).toBeTruthy();
            expect(
              Object.keys(errItem.constraints).some(
                errName => errName === 'isEmail',
              ),
            ).toBeTruthy();
          }

          // Password
          if (errItem.property === 'password') {
            expect(
              Object.keys(errItem.constraints).some(
                errName => errName === 'isDefined',
              ),
            ).toBeTruthy();
            expect(
              Object.keys(errItem.constraints).some(
                errName => errName === 'minLength',
              ),
            ).toBeTruthy();
          }

          // First name
          if (errItem.property === 'firstName') {
            expect(
              Object.keys(errItem.constraints).some(
                errName => errName === 'isDefined',
              ),
            ).toBeTruthy();
          }

          // Last name
          if (errItem.property === 'lastName') {
            expect(
              Object.keys(errItem.constraints).some(
                errName => errName === 'isDefined',
              ),
            ).toBeTruthy();
          }
        });
      });
  });

  it('should register new user', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(correctUser)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        const { token, user } = body;
        expect(token).toBeDefined();

        expect(user.email).toEqual(correctUser.email);
        expect(user.firstName).toEqual(correctUser.firstName);
        expect(user.lastName).toEqual(correctUser.lastName);
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
        expect(user).not.toHaveProperty('password');
      });
  });

  it('should successfully login', async () => {
    const login: LoginDTO = {
      email: 'username@host.com',
      password: 'password',
    };
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(login)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        const { token, user } = body;
        expect(token).toBeDefined();

        expect(user.email).toEqual(correctUser.email);
        expect(user.firstName).toEqual(correctUser.firstName);
        expect(user.lastName).toEqual(correctUser.lastName);
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('updatedAt');
        expect(user).not.toHaveProperty('password');
      });
  });

  it('should fail login', async () => {
    const login: LoginDTO = {
      email: 'username@host.com',
      password: 'incorrect',
    };
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(login)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
