import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Permission, ShareStatus, MemberRole } from '@prisma/client';

describe('TeamsService', () => {
  let service: TeamsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: PrismaService,
          useValue: {
            team: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            canvasShare: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            teamMember: {
              findUnique: jest.fn(),
              create: jest.fn(),
              findMany: jest.fn(),
            },
            canvas: {
              findUnique: jest.fn(),
            },
            analyticsEvent: {
              create: jest.fn().mockResolvedValue({}),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('joinByShareToken', () => {
    const mockUser = { id: 'user-1', username: 'testuser' };
    const mockShare = {
      id: 'share-1',
      shareToken: 'test-token',
      canvasId: 'canvas-1',
      permission: Permission.EDITABLE,
      status: ShareStatus.ACTIVE,
      maxUses: null,
      usedCount: 0,
      teamId: null,
    };
    const mockCanvas = {
      id: 'canvas-1',
      name: 'Test Canvas',
      userId: 'owner-1',
    };

    it('should allow user to join by share token (EDITABLE permission)', async () => {
      (prisma.canvasShare.findUnique as jest.Mock).mockResolvedValue(mockShare);
      (prisma.teamMember.findUnique as jest.Mock).mockResolvedValue(null); // Not yet a member
      (prisma.canvasShare.update as jest.Mock).mockResolvedValue({
        ...mockShare,
        usedCount: 1,
      });

      const mockMember = {
        id: 'member-1',
        userId: mockUser.id,
        canvasId: mockShare.canvasId,
        shareId: mockShare.id,
        teamId: mockShare.teamId,
        role: MemberRole.EDITOR,
      };
      (prisma.teamMember.create as jest.Mock).mockResolvedValue(mockMember);

      const result = await service.joinByShareToken(mockUser.id, mockShare.shareToken);

      expect(prisma.canvasShare.findUnique).toHaveBeenCalledWith({
        where: { shareToken: mockShare.shareToken },
      });

      expect(prisma.teamMember.findUnique).toHaveBeenCalledWith({
        where: {
          canvasId_userId: {
            userId: mockUser.id,
            canvasId: mockShare.canvasId,
          },
        },
      });

      expect(prisma.canvasShare.update).toHaveBeenCalledWith({
        where: { id: mockShare.id },
        data: { usedCount: { increment: 1 } },
      });

      expect(prisma.teamMember.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          canvasId: mockShare.canvasId,
          shareId: mockShare.id,
          teamId: mockShare.teamId,
          role: MemberRole.EDITOR,
        },
      });

      expect(result).toEqual(mockMember);
    });

    it('should allow user to join by share token (VIEW_ONLY permission)', async () => {
      const viewOnlyShare = { ...mockShare, permission: Permission.VIEW_ONLY };
      (prisma.canvasShare.findUnique as jest.Mock).mockResolvedValue(viewOnlyShare);
      (prisma.teamMember.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.canvasShare.update as jest.Mock).mockResolvedValue({
        ...viewOnlyShare,
        usedCount: 1,
      });

      const mockMember = {
        id: 'member-1',
        userId: mockUser.id,
        canvasId: viewOnlyShare.canvasId,
        shareId: viewOnlyShare.id,
        teamId: viewOnlyShare.teamId,
        role: MemberRole.VIEWER,
      };
      (prisma.teamMember.create as jest.Mock).mockResolvedValue(mockMember);

      const result = await service.joinByShareToken(mockUser.id, viewOnlyShare.shareToken);

      expect(prisma.teamMember.create).toHaveBeenCalledWith({
        data: {
          userId: mockUser.id,
          canvasId: viewOnlyShare.canvasId,
          shareId: viewOnlyShare.id,
          teamId: viewOnlyShare.teamId,
          role: MemberRole.VIEWER,
        },
      });

      expect(result).toEqual(mockMember);
    });

    it('should throw NotFoundException if share does not exist', async () => {
      (prisma.canvasShare.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.joinByShareToken(mockUser.id, 'invalid-token')).rejects.toThrow(
        NotFoundException
      );
      await expect(service.joinByShareToken(mockUser.id, 'invalid-token')).rejects.toThrow(
        '邀请链接无效或已过期'
      );
    });

    it('should throw NotFoundException if share is revoked', async () => {
      const revokedShare = { ...mockShare, status: ShareStatus.REVOKED };
      (prisma.canvasShare.findUnique as jest.Mock).mockResolvedValue(revokedShare);

      await expect(service.joinByShareToken(mockUser.id, mockShare.shareToken)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.joinByShareToken(mockUser.id, mockShare.shareToken)).rejects.toThrow(
        '邀请链接无效或已过期'
      );
    });

    it('should throw ForbiddenException if max uses reached', async () => {
      const limitedShare = { ...mockShare, maxUses: 5, usedCount: 5 };
      (prisma.canvasShare.findUnique as jest.Mock).mockResolvedValue(limitedShare);

      await expect(service.joinByShareToken(mockUser.id, mockShare.shareToken)).rejects.toThrow(
        ForbiddenException
      );
      await expect(service.joinByShareToken(mockUser.id, mockShare.shareToken)).rejects.toThrow(
        '邀请链接已达到使用上限'
      );
    });

    it('should return existing member if already joined', async () => {
      (prisma.canvasShare.findUnique as jest.Mock).mockResolvedValue(mockShare);

      const existingMember = {
        id: 'existing-member-1',
        userId: mockUser.id,
        canvasId: mockShare.canvasId,
        shareId: mockShare.id,
        teamId: mockShare.teamId,
        role: MemberRole.EDITOR,
      };
      (prisma.teamMember.findUnique as jest.Mock).mockResolvedValue(existingMember);

      const result = await service.joinByShareToken(mockUser.id, mockShare.shareToken);

      // Should not create a new member
      expect(prisma.teamMember.create).not.toHaveBeenCalled();
      expect(prisma.canvasShare.update).not.toHaveBeenCalled();

      expect(result).toEqual(existingMember);
    });
  });

  describe('getTeamMembers', () => {
    const mockTeamId = 'team-1';
    const mockMembers = [
      {
        id: 'member-1',
        userId: 'user-1',
        teamId: mockTeamId,
        role: MemberRole.OWNER,
        user: { id: 'user-1', username: 'owner' },
      },
      {
        id: 'member-2',
        userId: 'user-2',
        teamId: mockTeamId,
        role: MemberRole.EDITOR,
        user: { id: 'user-2', username: 'editor' },
      },
    ];

    it('should return all team members', async () => {
      (prisma.teamMember.findMany as jest.Mock).mockResolvedValue(mockMembers);

      const result = await service.getTeamMembers(mockTeamId);

      expect(prisma.teamMember.findMany).toHaveBeenCalledWith({
        where: { teamId: mockTeamId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: {
          joinedAt: 'asc',
        },
      });

      expect(result.data).toEqual(mockMembers);
    });

    it('should return empty array if no members', async () => {
      (prisma.teamMember.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getTeamMembers(mockTeamId);

      expect(result.data).toEqual([]);
    });
  });

  describe('getCanvasMembers', () => {
    const mockCanvasId = 'canvas-1';
    const mockMembers = [
      {
        id: 'member-1',
        userId: 'user-1',
        canvasId: mockCanvasId,
        role: MemberRole.OWNER,
        user: { id: 'user-1', username: 'owner' },
      },
      {
        id: 'member-2',
        userId: 'user-2',
        canvasId: mockCanvasId,
        role: MemberRole.VIEWER,
        user: { id: 'user-2', username: 'viewer' },
      },
    ];

    it('should return all canvas members', async () => {
      (prisma.teamMember.findMany as jest.Mock).mockResolvedValue(mockMembers);

      const result = await service.getCanvasMembers(mockCanvasId);

      expect(prisma.teamMember.findMany).toHaveBeenCalledWith({
        where: { canvasId: mockCanvasId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: {
          joinedAt: 'asc',
        },
      });

      expect(result.data).toEqual(mockMembers);
    });
  });
});
