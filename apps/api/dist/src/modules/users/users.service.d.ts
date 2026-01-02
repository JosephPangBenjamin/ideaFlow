import { PrismaService } from '../../prisma/prisma.service';
interface CreateUserDto {
    username: string;
    password: string;
    phone?: string;
}
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByUsername(username: string): Promise<{
        id: string;
        username: string;
        phone: string | null;
        password: string;
        nickname: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        username: string;
        phone: string | null;
        password: string;
        nickname: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    create(data: CreateUserDto): Promise<{
        id: string;
        username: string;
        phone: string | null;
        password: string;
        nickname: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
