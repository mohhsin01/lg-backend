import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdminInterceptor } from 'src/interceptor/role.interceptor';
import { RolesGuard } from 'src/guards/admin.guard';
import { Roles } from 'src/decorators/roles.decorators';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Users')
@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(AdminInterceptor)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Taha Tayyab' },
        email: { type: 'string', example: 'taaaha@example.com' },
        password: { type: 'string', example: '123456' },
      },
      required: ['name', 'email', 'password'],
    },
  })
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users, But the Role should be Admin.' })
  @ApiOkResponse({ description: 'List of users returned successfully' })
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiOkResponse({ description: 'User returned successfully' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user details by ID (all the fields are optional).',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Ali Khan' },
        email: { type: 'string', example: 'ali@example.com' },
        password: { type: 'string', example: '123456' },
        role: { type: 'string', example: 'admin' },
        education: { type: 'string', example: 'BS Computer Science' },
        skill: { type: 'string', example: 'NestJS, TypeORM' },
        experience: { type: 'string', example: '3 years in backend development' },
        phone: { type: 'string', example: '+92 300 1234567' },
      },
    },
  })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a user, But the role should be Admin.' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
