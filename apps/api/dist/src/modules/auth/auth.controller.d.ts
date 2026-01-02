import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, response: Response): Promise<{
        user: {
            id: string;
            username: string;
        };
        accessToken: string;
    }>;
    login(loginDto: LoginDto, response: Response): Promise<{
        user: {
            id: string;
            username: string;
        };
        accessToken: string;
    }>;
    logout(req: Request, response: Response): Promise<{
        message: string;
    }>;
    refresh(request: Request, response: Response): Promise<{
        accessToken: string;
    }>;
    getProfile(req: Request): any;
}
