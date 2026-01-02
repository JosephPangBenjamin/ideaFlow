import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto';
interface UserPayload {
    id: string;
    username: string;
}
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<{
        data: {
            user: {
                id: string;
                username: string;
            };
            accessToken: string;
        };
        refreshToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        data: {
            user: {
                id: string;
                username: string;
            };
            accessToken: string;
        };
        refreshToken: string;
    }>;
    validateUser(payload: UserPayload): Promise<{
        id: string;
        username: string;
        phone: string | null;
        password: string;
        nickname: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
    logout(userId: string): Promise<void>;
}
export {};
