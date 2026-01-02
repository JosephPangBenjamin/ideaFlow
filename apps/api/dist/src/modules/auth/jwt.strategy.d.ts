import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(payload: any): Promise<{
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
