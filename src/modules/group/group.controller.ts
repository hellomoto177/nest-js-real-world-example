import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { GroupService } from './group.service';
import {
  ApiOperation,
  ApiOkResponse,
  ApiUseTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ResponseGroupDTO, CreateGroupDTO, UpdateGroupDTO } from './group.dto';
import { DeleteResult } from 'typeorm';

@Controller('group')
@ApiUseTags('Group of notes')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @Get('/')
  @ApiOkResponse({ type: ResponseGroupDTO, isArray: true })
  @ApiOperation({ title: 'Get all groups' })
  index(): Promise<ResponseGroupDTO[]> {
    return this.groupService.findAllGroups();
  }

  @Get('/:id')
  @ApiOkResponse({ type: ResponseGroupDTO })
  @ApiOperation({ title: 'Get group by id' })
  getGroup(id: number): Promise<ResponseGroupDTO> {
    return this.groupService.findGroup(id);
  }

  @Post('/')
  @ApiCreatedResponse({ type: ResponseGroupDTO })
  @ApiOperation({ title: 'Create new group' })
  createGroup(@Body() group: CreateGroupDTO): Promise<ResponseGroupDTO> {
    return this.groupService.createGroup(group);
  }

  @Put('/:groupId')
  @ApiOkResponse({ type: ResponseGroupDTO })
  @ApiOperation({ title: 'Update group by id' })
  updateGroup(
    @Param('groupId') groupId: number,
    @Body() group: UpdateGroupDTO,
  ): Promise<ResponseGroupDTO> {
    return this.groupService.updateGroup(groupId, group);
  }

  @Delete('/:groupId')
  @ApiOkResponse({ type: DeleteResult })
  @ApiOperation({ title: 'Delete group by id' })
  deleteGroup(@Param('groupId') groupId: number): Promise<DeleteResult> {
    return this.groupService.deleteGroup(groupId);
  }
}
