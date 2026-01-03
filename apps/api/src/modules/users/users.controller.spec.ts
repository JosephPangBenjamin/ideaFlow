import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    findById: jest.fn(),
    update: jest.fn(),
    changePassword: jest.fn(),
  };

  const mockUser = {
    id: 'user-id-123',
    username: 'testuser',
    phone: '13812341234',
    nickname: 'Test User',
    createdAt: new Date('2025-12-30T12:00:00.000Z'),
    updatedAt: new Date('2025-12-30T12:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('should return current user info with masked phone number', async () => {
      // Arrange
      mockUsersService.findById.mockResolvedValue(mockUser);
      const req = { user: { id: 'user-id-123', username: 'testuser' } };

      // Act
      const result = await controller.getMe(req as any);

      // Assert
      expect(result.data).toBeDefined();
      expect(result.data.id).toBe('user-id-123');
      expect(result.data.username).toBe('testuser');
      expect(result.data.phone).toBe('138****1234'); // Masked phone
      expect(result.data.nickname).toBe('Test User');
      // Password is not included in response type - verified by TypeScript
      expect(mockUsersService.findById).toHaveBeenCalledWith('user-id-123');
    });

    it('should return user info without phone if phone is null', async () => {
      // Arrange
      const userWithoutPhone = { ...mockUser, phone: null };
      mockUsersService.findById.mockResolvedValue(userWithoutPhone);
      const req = { user: { id: 'user-id-123', username: 'testuser' } };

      // Act
      const result = await controller.getMe(req as any);

      // Assert
      expect(result.data.phone).toBeNull();
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      mockUsersService.findById.mockResolvedValue(null);
      const req = { user: { id: 'invalid-id', username: 'unknown' } };

      // Act & Assert
      await expect(controller.getMe(req as any)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateMe', () => {
    it('should update user nickname successfully', async () => {
      // Arrange
      const updatedUser = { ...mockUser, nickname: 'New Nickname' };
      mockUsersService.update.mockResolvedValue(updatedUser);
      const req = { user: { id: 'user-id-123', username: 'testuser' } };
      const updateDto = { nickname: 'New Nickname' };

      // Act
      const result = await controller.updateMe(req as any, updateDto);

      // Assert
      expect(result.data.nickname).toBe('New Nickname');
      expect(mockUsersService.update).toHaveBeenCalledWith('user-id-123', {
        nickname: 'New Nickname',
      });
    });

    it('should return success message on update', async () => {
      // Arrange
      const updatedUser = { ...mockUser, nickname: 'New Nickname' };
      mockUsersService.update.mockResolvedValue(updatedUser);
      const req = { user: { id: 'user-id-123', username: 'testuser' } };
      const updateDto = { nickname: 'New Nickname' };

      // Act
      const result = await controller.updateMe(req as any, updateDto);

      // Assert
      expect(result.meta.message).toBe('保存成功');
    });

    it('should throw UnauthorizedException if user not found during update', async () => {
      // Arrange
      mockUsersService.update.mockResolvedValue(null);
      const req = { user: { id: 'invalid-id', username: 'unknown' } };
      const updateDto = { nickname: 'New Nickname' };

      // Act & Assert
      await expect(controller.updateMe(req as any, updateDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('changePassword', () => {
    it('should successfully change password with valid old password', async () => {
      // Arrange
      mockUsersService.changePassword.mockResolvedValue({ success: true });
      const req = { user: { id: 'user-id-123', username: 'testuser' } };
      const changePasswordDto = {
        oldPassword: 'OldPass123',
        newPassword: 'NewPass456',
        confirmPassword: 'NewPass456',
      };

      // Act
      const result = await controller.changePassword(req as any, changePasswordDto);

      // Assert
      expect(result.meta.message).toBe('密码修改成功，请重新登录');
      expect(mockUsersService.changePassword).toHaveBeenCalledWith(
        'user-id-123',
        'OldPass123',
        'NewPass456'
      );
    });

    it('should throw UnauthorizedException when old password is wrong', async () => {
      // Arrange
      mockUsersService.changePassword.mockRejectedValue(new UnauthorizedException('旧密码错误'));
      const req = { user: { id: 'user-id-123', username: 'testuser' } };
      const changePasswordDto = {
        oldPassword: 'WrongPassword',
        newPassword: 'NewPass456',
        confirmPassword: 'NewPass456',
      };

      // Act & Assert
      await expect(controller.changePassword(req as any, changePasswordDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
