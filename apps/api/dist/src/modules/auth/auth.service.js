"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const { username, password } = registerDto;
        const existingUser = await this.usersService.findByUsername(username);
        if (existingUser) {
            throw new common_1.ConflictException({
                statusCode: 409,
                message: '该账号已注册',
                errors: [{ field: 'username', message: '用户名已存在' }],
                timestamp: new Date().toISOString(),
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({
            username,
            password: hashedPassword,
        });
        const tokens = await this.generateTokens({ id: user.id, username: user.username });
        return {
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                },
                accessToken: tokens.accessToken,
            },
            refreshToken: tokens.refreshToken,
        };
    }
    async login(loginDto) {
        const { username, password } = loginDto;
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                message: '账号或密码错误',
                timestamp: new Date().toISOString(),
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                message: '账号或密码错误',
                timestamp: new Date().toISOString(),
            });
        }
        const tokens = await this.generateTokens({ id: user.id, username: user.username });
        return {
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                },
                accessToken: tokens.accessToken,
            },
            refreshToken: tokens.refreshToken,
        };
    }
    async validateUser(payload) {
        return this.usersService.findById(payload.id);
    }
    async refreshTokens(refreshToken) {
        try {
            const secret = this.configService.get('JWT_SECRET') || 'ideaflow-jwt-secret-dev';
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: secret,
            });
            const user = await this.usersService.findById(payload.id);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return this.generateTokens({ id: user.id, username: user.username });
        }
        catch (e) {
            throw new common_1.UnauthorizedException();
        }
    }
    async generateTokens(payload) {
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });
        return { accessToken, refreshToken };
    }
    async logout(userId) {
        return;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map