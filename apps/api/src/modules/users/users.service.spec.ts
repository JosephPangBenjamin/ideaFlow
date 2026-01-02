import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('UsersService', () => {
    let service: UsersService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findByUsername', () => {
        it('should return user when found', async () => {
            // Arrange
            const mockUser = {
                id: 'user-id-123',
                username: 'testuser',
                password: 'hashedPassword',
                phone: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            // Act
            const result = await service.findByUsername('testuser');

            // Assert
            expect(result).toEqual(mockUser);
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { username: 'testuser' },
            });
        });

        it('should return null when user not found', async () => {
            // Arrange
            mockPrismaService.user.findUnique.mockResolvedValue(null);

            // Act
            const result = await service.findByUsername('nonexistent');

            // Assert
            expect(result).toBeNull();
        });
    });

    describe('findById', () => {
        it('should return user when found by id', async () => {
            // Arrange
            const mockUser = {
                id: 'user-id-123',
                username: 'testuser',
                password: 'hashedPassword',
                phone: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

            // Act
            const result = await service.findById('user-id-123');

            // Assert
            expect(result).toEqual(mockUser);
            expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: 'user-id-123' },
            });
        });
    });

    describe('create', () => {
        it('should create a new user with username and hashed password', async () => {
            // Arrange
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

            // Act
            const result = await service.create(createData);

            // Assert
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
            // Arrange
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

            // Act
            const result = await service.create(createData);

            // Assert
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
