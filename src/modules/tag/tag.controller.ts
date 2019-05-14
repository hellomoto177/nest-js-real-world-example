import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { TagService } from './tag.service';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiOperation,
  ApiImplicitQuery,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ResponseTagDTO, CreateTagDTO, UpdateTagDTO } from './tag.dto';
import { DeleteResult } from 'typeorm';

@Controller('tags')
@ApiUseTags('Tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/')
  @ApiOkResponse({ type: ResponseTagDTO, isArray: true })
  @ApiOperation({ title: 'Get all tags' })
  @ApiImplicitQuery({ name: 'expand', enum: ['groups'], required: false })
  index(@Query('expand') expand?: string): Promise<ResponseTagDTO[]> {
    const expands = expand ? expand.split(',') : [];
    return this.tagService.getAllTags(expands);
  }

  @Get('/:id')
  @ApiOkResponse({ type: ResponseTagDTO })
  @ApiOperation({ title: 'Get tag by id' })
  getTag(@Param('id') id: number) {
    return this.tagService.getTag(id);
  }

  // TODO: Херню отдает в свагер
  @Post('/')
  @ApiCreatedResponse({ type: CreateTagDTO })
  @ApiOperation({ title: 'Create new tag' })
  createTag(@Body() dto: CreateTagDTO): Promise<ResponseTagDTO> {
    return this.tagService.createTag(dto);
  }

  @Put('/:id')
  @ApiOkResponse({ type: UpdateTagDTO })
  @ApiOperation({ title: 'Update new tag' })
  updateTag(
    @Param('id') id: number,
    @Body() dto: UpdateTagDTO,
  ): Promise<ResponseTagDTO> {
    return this.tagService.updateTag(id, dto);
  }

  @Delete('/:id')
  @ApiOkResponse({ type: DeleteResult })
  @ApiOperation({ title: 'Delete tag by id' })
  deleteTag(@Param('id') id: number): Promise<DeleteResult> {
    return this.tagService.deleteTag(id);
  }
}
