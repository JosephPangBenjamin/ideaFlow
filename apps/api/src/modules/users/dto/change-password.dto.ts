import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';
import { Match } from '../../../common/decorators/match.decorator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: '旧密码不能为空' })
  @IsString()
  oldPassword!: string;

  @IsNotEmpty({ message: '新密码不能为空' })
  @IsString()
  @MinLength(8, { message: '密码长度至少8位' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: '密码必须包含字母和数字',
  })
  newPassword!: string;

  @IsNotEmpty({ message: '确认密码不能为空' })
  @Match('newPassword', { message: '两次输入的密码不一致' })
  confirmPassword!: string;
}
