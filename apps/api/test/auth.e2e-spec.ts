import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
    jest.setTimeout(30000);
    let app: INestApplication;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.use(cookieParser());
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        app.setGlobalPrefix('ideaFlow/api/v1');
        await app.init();

        prismaService = app.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(async () => {
        // Clean up users table before each test
        await prismaService.user.deleteMany({});
    });

    describe('/ideaFlow/api/v1/auth/register (POST)', () => {
        it('should register a new user successfully (201)', async () => {
            const registerDto = {
                username: 'testuser',
                password: 'Test1234',
            };

            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send(registerDto)
                .expect(201);

            expect(response.body).toHaveProperty('user');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.username).toBe('testuser');
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).not.toHaveProperty('password');

            // Should set HttpOnly cookie for refresh token
            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toContain('refreshToken');
            expect(cookies[0]).toContain('HttpOnly');
        });

        it('should return 400 when username already exists', async () => {
            const registerDto = {
                username: 'existinguser',
                password: 'Test1234',
            };

            // First registration
            await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send(registerDto)
                .expect(201);

            // Second registration with same username
            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send(registerDto)
                .expect(409); // Conflict

            expect(response.body.message).toContain('已注册');
        });

        it('should return 400 when password is too weak (less than 8 chars)', async () => {
            const registerDto = {
                username: 'testuser',
                password: 'Abc123', // Only 6 chars
            };

            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send(registerDto)
                .expect(400);

            expect(response.body.message).toBeDefined();
        });

        it('should return 400 when password has no letters', async () => {
            const registerDto = {
                username: 'testuser',
                password: '12345678', // No letters
            };

            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send(registerDto)
                .expect(400);

            expect(response.body.message).toBeDefined();
        });

        it('should return 400 when password has no numbers', async () => {
            const registerDto = {
                username: 'testuser',
                password: 'abcdefgh', // No numbers
            };

            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send(registerDto)
                .expect(400);

            expect(response.body.message).toBeDefined();
        });

        it('should return 400 when username is too short', async () => {
            const registerDto = {
                username: 'ab', // Only 2 chars
                password: 'Test1234',
            };

            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send(registerDto)
                .expect(400);

            expect(response.body.message).toBeDefined();
        });

        it('should return 400 when username is missing', async () => {
            const registerDto = {
                password: 'Test1234',
            };

            await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send(registerDto)
                .expect(400);
        });

        it('should return 400 when password is missing', async () => {
            const registerDto = {
                username: 'testuser',
            };

            await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send(registerDto)
                .expect(400);
        });
    });

    describe('/ideaFlow/api/v1/auth/login (POST)', () => {
        beforeEach(async () => {
            // Create a test user first
            await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send({
                    username: 'loginuser',
                    password: 'Test1234',
                });
        });

        it('should login successfully with valid credentials (200)', async () => {
            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/login')
                .send({
                    username: 'loginuser',
                    password: 'Test1234',
                })
                .expect(200);

            expect(response.body.user.username).toBe('loginuser');
            expect(response.body).toHaveProperty('accessToken');
        });

        it('should return 401 when user does not exist', async () => {
            await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/login')
                .send({
                    username: 'nonexistent',
                    password: 'Test1234',
                })
                .expect(401);
        });

        it('should return 401 when password is wrong', async () => {
            await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/login')
                .send({
                    username: 'loginuser',
                    password: 'WrongPassword1',
                })
                .expect(401);
        });
    });

    describe('/ideaFlow/api/v1/auth/refresh (POST)', () => {
        let refreshTokenCookie: string;

        beforeEach(async () => {
            // Register and login to get refresh token
            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send({
                    username: 'refreshuser',
                    password: 'Test1234',
                })
                .expect(201);

            const cookies = response.headers['set-cookie'] as unknown as string[];
            if (cookies) {
                const cookie = cookies.find((c: string) => c.startsWith('refreshToken'));
                if (cookie) refreshTokenCookie = cookie;
            }
        });

        it('should refresh access token successfully (200)', async () => {
            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/refresh')
                .set('Cookie', [refreshTokenCookie])
                .send()
                .expect(200);

            expect(response.body).toHaveProperty('accessToken');
            expect(response.body.accessToken).toBeDefined();

            const cookies = response.headers['set-cookie'] as unknown as string[];
            if (cookies) {
                const newRefreshToken = cookies.find((c: string) => c.startsWith('refreshToken'));
                expect(newRefreshToken).toBeDefined();
            }
        });

        it('should return 401 when refresh token is missing', async () => {
            await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/refresh')
                .send()
                .expect(401);
        });

        it('should return 401 when refresh cookie is invalid', async () => {
            await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/refresh')
                .set('Cookie', ['refreshToken=invalidValue'])
                .send()
                .expect(401);
        });
    });
    describe('/ideaFlow/api/v1/auth/logout (POST)', () => {
        let accessToken: string;
        let refreshTokenCookie: string;

        beforeEach(async () => {
            // Register and login
            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send({
                    username: 'logoutuser',
                    password: 'Test1234',
                })
                .expect(201);

            accessToken = response.body.accessToken;
            const cookies = response.headers['set-cookie'] as unknown as string[];
            if (cookies) {
                const cookie = cookies.find((c: string) => c.startsWith('refreshToken'));
                if (cookie) refreshTokenCookie = cookie;
            }
        });

        it('should logout successfully (200) and clear cookies', async () => {
            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', [refreshTokenCookie])
                .send()
                .expect(200);

            const cookies = response.headers['set-cookie'] as unknown as string[];
            expect(cookies).toBeDefined();
            const refreshToken = cookies.find((c: string) => c.startsWith('refreshToken'));
            expect(refreshToken).toBeDefined();
            // content could vary based on implementation (Max-Age=0 or Expires=Thu, 01 Jan 1970 00:00:00 GMT)
            // But usually Max-Age=0 is enough for check or check if value is empty
            const isCleared = refreshToken?.includes('Max-Age=0') || refreshToken?.includes('Expires=Thu, 01 Jan 1970');
            expect(isCleared).toBeTruthy();
        });

        it('should return 401 if not logged in', async () => {
            await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/logout')
                .send()
                .expect(401);
        });
    });
});

