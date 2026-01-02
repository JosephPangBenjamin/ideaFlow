import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(3, { message: '用户名至少需要3个字符' })
    @MaxLength(20, { message: '用户名最多20个字符' })
    username!: string;

    @IsString()
    @MinLength(8, { message: '密码至少需要8位' })
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/, {
        message: '密码必须包含字母和数字',
    })
    password!: string;
}
