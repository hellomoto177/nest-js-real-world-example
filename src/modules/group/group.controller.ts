import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupService } from './group.service';
import CreateGroupDTO from './dto/create-group-dto';
import UpdateGroupDTO from './dto/update-group-dto';

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
