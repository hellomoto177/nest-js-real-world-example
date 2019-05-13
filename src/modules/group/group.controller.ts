import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupService } from './group.service';
import CreateGroupDTO from './dto/create-group.dto';
import UpdateGroupDTO from './dto/update-group.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiResponseModelProperty,
} from '@nestjs/swagger';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @Get('/')
  index() {
    return this.groupService.findAllGroups();
  }

  @Get('/:id')
  getGroup(id: number) {
    return this.groupService.findGroup(id);
  }

  @Post('/')
  @ApiOperation({ title: 'Create group' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  createGroup(@Body() group: CreateGroupDTO) {
    return this.groupService.createGroup(group);
  }

  @Patch('/:groupId')
  updateGroup(
    @Param('groupId') groupId: number,
    @Body() group: UpdateGroupDTO,
  ) {
    return this.groupService.updateGroup(groupId, group);
  }

  @Delete('/:groupId')
  deleteGroup(@Param('groupId') groupId: number) {
    return this.groupService.deleteGroup(groupId);
  }
}
