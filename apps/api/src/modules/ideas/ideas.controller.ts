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
import { GetIdeasFilterDto } from './dto/get-ideas-filter.dto';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';
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
  findAll(@Request() req: any, @Query() query: GetIdeasFilterDto) {
    return this.ideasService.findAll(req.user.id, query);
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id/visibility')
  updateVisibility(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateVisibilityDto: UpdateVisibilityDto
  ) {
    return this.ideasService.updateVisibility(req.user.id, id, updateVisibilityDto.isPublic);
  }

  @Get('public/:token')
  findByToken(@Param('token') token: string) {
    return this.ideasService.findByToken(token);
  }
}
