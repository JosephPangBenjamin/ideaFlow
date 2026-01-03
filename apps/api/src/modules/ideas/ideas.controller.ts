import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() createIdeaDto: CreateIdeaDto) {
    return this.ideasService.create(req.user.id, createIdeaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    // Ensure page and limit are numbers (query params come as strings)
    return this.ideasService.findAll(req.user.id, Number(page), Number(limit));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.ideasService.findOne(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateIdeaDto: UpdateIdeaDto) {
    return this.ideasService.update(req.user.id, id, updateIdeaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.ideasService.remove(req.user.id, id);
  }
}
