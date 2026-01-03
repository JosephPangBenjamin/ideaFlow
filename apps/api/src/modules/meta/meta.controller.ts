import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MetaService } from './meta.service';
import { PreviewUrlDto } from './dto/preview-url.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('meta')
@UseGuards(JwtAuthGuard)
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Post('preview')
  async preview(@Body() dto: PreviewUrlDto) {
    return this.metaService.getLinkPreview(dto.url);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req: any, file: any, cb: any) => {
          const randomName = uuidv4();
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    })
  )
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
        ],
      })
    )
    file: Express.Multer.File
  ) {
    // Manual validation to bypass confusing FileTypeValidator errors
    if (!file.mimetype.match(/^image\//)) {
      throw new BadRequestException(`Invalid file type: ${file.mimetype}. Expected image.`);
    }
    console.log(
      `[Upload] Processing file: ${file.originalname}, type: ${file.mimetype}, size: ${file.size}`
    );
    return this.metaService.uploadImage(file);
  }
}
