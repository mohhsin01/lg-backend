import { Controller, Get, Post as HttpPost, Delete, Param, Body, UseGuards,UseInterceptors } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/posts.dto';
import { RolesGuard } from '../guards/roles.guards'; 
import { UserId } from '../decorator/user.decorator';
import { Id,ParamId } from '../decorator/post.decorator';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiBadRequestResponse,ApiHeader } from '@nestjs/swagger';
import{Roles} from '../decorator/roles.decorator';
import { PostDataInterceptor } from 'src/interceptor/post.interceptor';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
@Roles('user')
@UseGuards(RolesGuard)
@UseInterceptors(PostDataInterceptor)  
@HttpPost(':userId')
@ApiOperation({ summary: 'Create a new post' })
  @ApiCreatedResponse({ description: 'Post created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  async create(@UserId() userId: number, @Body() dto: CreatePostDto, ) {
    return this.postsService.create({...dto,user: { id: userId } as any,});
}

  @Get()
   @ApiOperation({ summary: 'Get all posts' })
  @ApiOkResponse({ description: 'List of posts returned successfully' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id') 
  @ApiOperation({ summary: 'Get Post by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiOkResponse({ description: 'POST returned successfully' })
  findOne(@ParamId() id: string) {
    return this.postsService.findOne(+id);
  }
  
  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete(':id') 
  @ApiOperation({ summary: 'Delete a POST' })
  @ApiParam({ name: 'id', type: Number, description: 'POST ID' })
  @ApiOkResponse({ description: 'POST deleted successfully' })
  @ApiHeader({ 
      name: 'user-id', 
      description: 'ID of the user who owns the post', 
      required: true 
    })
  remove(@Id() id: number) {
    return this.postsService.remove(id);
  }
}
