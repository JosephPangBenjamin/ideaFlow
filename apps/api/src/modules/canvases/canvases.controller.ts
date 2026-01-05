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
import { CanvasesService } from './canvases.service';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ideaFlow/api/v1/canvases')
export class CanvasesController {
  constructor(private readonly canvasesService: CanvasesService) {}

  // Canvas CRUD endpoints
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() createCanvasDto: CreateCanvasDto) {
    return this.canvasesService.create(req.user.id, createCanvasDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.canvasesService.findAll(req.user.id, Number(page), Number(limit));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.canvasesService.findOne(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateCanvasDto: UpdateCanvasDto) {
    return this.canvasesService.update(req.user.id, id, updateCanvasDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Request() req: any, @Param('id') id: string) {
    return this.canvasesService.remove(req.user.id, id);
  }

  // Node endpoints
  @UseGuards(JwtAuthGuard)
  @Post(':id/nodes')
  addNode(
    @Request() req: any,
    @Param('id') canvasId: string,
    @Body() createNodeDto: CreateNodeDto
  ) {
    return this.canvasesService.addNode(req.user.id, canvasId, createNodeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/nodes')
  getNodes(@Request() req: any, @Param('id') canvasId: string) {
    return this.canvasesService.getNodesForCanvas(req.user.id, canvasId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('nodes/:nodeId')
  updateNode(
    @Request() req: any,
    @Param('nodeId') nodeId: string,
    @Body() updateNodeDto: UpdateNodeDto
  ) {
    return this.canvasesService.updateNode(req.user.id, nodeId, updateNodeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('nodes/:nodeId')
  @HttpCode(HttpStatus.OK)
  removeNode(@Request() req: any, @Param('nodeId') nodeId: string) {
    return this.canvasesService.removeNode(req.user.id, nodeId);
  }

  // Connection endpoints
  @UseGuards(JwtAuthGuard)
  @Post(':id/connections')
  createConnection(
    @Request() req: any,
    @Param('id') canvasId: string,
    @Body() createConnectionDto: CreateConnectionDto
  ) {
    return this.canvasesService.createConnection(req.user.id, canvasId, createConnectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/connections')
  getConnections(@Request() req: any, @Param('id') canvasId: string) {
    return this.canvasesService.getConnectionsForCanvas(req.user.id, canvasId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('connections/:connectionId')
  updateConnection(
    @Request() req: any,
    @Param('connectionId') connectionId: string,
    @Body() updateConnectionDto: UpdateConnectionDto
  ) {
    return this.canvasesService.updateConnection(req.user.id, connectionId, updateConnectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('connections/:connectionId')
  @HttpCode(HttpStatus.OK)
  removeConnection(@Request() req: any, @Param('connectionId') connectionId: string) {
    return this.canvasesService.removeConnection(req.user.id, connectionId);
  }
}
