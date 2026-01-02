import { IsString, MinLength } from 'class-validator';

export class LoginDto {
    @IsString()
    @MinLength(1, { message: '请输入用户名' })
    username!: string;

    @IsString()
    @MinLength(1, { message: '请输入密码' })
    password!: string;
}
