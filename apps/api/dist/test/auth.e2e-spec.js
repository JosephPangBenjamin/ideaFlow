"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = require("supertest");
const cookieParser = require("cookie-parser");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/prisma/prisma.service");
describe('Auth (e2e)', () => {
    jest.setTimeout(30000);
    let app;
    let prismaService;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.use(cookieParser());
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        app.setGlobalPrefix('ideaFlow/api/v1');
        await app.init();
        prismaService = app.get(prisma_service_1.PrismaService);
    });
    afterAll(async () => {
        await app.close();
    });
    beforeEach(async () => {
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
            await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send(registerDto)
                .expect(201);
            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send(registerDto)
                .expect(409);
            expect(response.body.message).toContain('已注册');
        });
        it('should return 400 when password is too weak (less than 8 chars)', async () => {
            const registerDto = {
                username: 'testuser',
                password: 'Abc123',
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
                password: '12345678',
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
                password: 'abcdefgh',
            };
            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send(registerDto)
                .expect(400);
            expect(response.body.message).toBeDefined();
        });
        it('should return 400 when username is too short', async () => {
            const registerDto = {
                username: 'ab',
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
        let refreshTokenCookie;
        beforeEach(async () => {
            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send({
                username: 'refreshuser',
                password: 'Test1234',
            })
                .expect(201);
            const cookies = response.headers['set-cookie'];
            if (cookies) {
                const cookie = cookies.find((c) => c.startsWith('refreshToken'));
                if (cookie)
                    refreshTokenCookie = cookie;
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
            const cookies = response.headers['set-cookie'];
            if (cookies) {
                const newRefreshToken = cookies.find((c) => c.startsWith('refreshToken'));
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
        let accessToken;
        let refreshTokenCookie;
        beforeEach(async () => {
            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/register')
                .send({
                username: 'logoutuser',
                password: 'Test1234',
            })
                .expect(201);
            accessToken = response.body.accessToken;
            const cookies = response.headers['set-cookie'];
            if (cookies) {
                const cookie = cookies.find((c) => c.startsWith('refreshToken'));
                if (cookie)
                    refreshTokenCookie = cookie;
            }
        });
        it('should logout successfully (200) and clear cookies', async () => {
            const response = await request(app.getHttpServer())
                .post('/ideaFlow/api/v1/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', [refreshTokenCookie])
                .send()
                .expect(200);
            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();
            const refreshToken = cookies.find((c) => c.startsWith('refreshToken'));
            expect(refreshToken).toBeDefined();
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
//# sourceMappingURL=auth.e2e-spec.js.map