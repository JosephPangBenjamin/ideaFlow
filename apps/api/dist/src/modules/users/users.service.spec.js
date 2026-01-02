"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_service_1 = require("./users.service");
const prisma_service_1 = require("../../prisma/prisma.service");
describe('UsersService', () => {
    let service;
    let prismaService;
    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('findByUsername', () => {
        it('should return user when found', async () => {
            const mockUser = {
                id: 'user-id-123',
                username: 'testuser',
                password: 'hashedPassword',
                phone: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            const result = await service.findByUsername('testuser');
            expect(result).toEqual(mockUser);
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { username: 'testuser' },
            });
        });
        it('should return null when user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            const result = await service.findByUsername('nonexistent');
            expect(result).toBeNull();
        });
    });
    describe('findById', () => {
        it('should return user when found by id', async () => {
            const mockUser = {
                id: 'user-id-123',
                username: 'testuser',
                password: 'hashedPassword',
                phone: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            const result = await service.findById('user-id-123');
            expect(result).toEqual(mockUser);
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: 'user-id-123' },
            });
        });
    });
    describe('create', () => {
        it('should create a new user with username and hashed password', async () => {
            const createData = {
                username: 'newuser',
                password: 'hashedPassword123',
            };
            const mockCreatedUser = {
                id: 'new-user-id',
                username: 'newuser',
                password: 'hashedPassword123',
                phone: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
            const result = await service.create(createData);
            expect(result).toEqual(mockCreatedUser);
            expect(mockPrismaService.user.create).toHaveBeenCalledWith({
                data: {
                    username: 'newuser',
                    password: 'hashedPassword123',
                    phone: undefined,
                },
            });
        });
        it('should create user with phone number when provided', async () => {
            const createData = {
                username: 'newuser',
                password: 'hashedPassword123',
                phone: '13800138000',
            };
            const mockCreatedUser = {
                id: 'new-user-id',
                username: 'newuser',
                password: 'hashedPassword123',
                phone: '13800138000',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
            const result = await service.create(createData);
            expect(result).toEqual(mockCreatedUser);
            expect(mockPrismaService.user.create).toHaveBeenCalledWith({
                data: {
                    username: 'newuser',
                    password: 'hashedPassword123',
                    phone: '13800138000',
                },
            });
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map