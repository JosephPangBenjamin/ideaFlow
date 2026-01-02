import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface CreateUserDto {
    username: string;
    password: string;
    phone?: string;
}

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findByUsername(username: string) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async create(data: CreateUserDto) {
        return this.prisma.user.create({
            data: {
                username: data.username,
                password: data.password,
                phone: data.phone,
            },
        });
    }
}
