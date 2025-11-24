import { applyDecorators } from '@nestjs/common';
import { 
  ApiHeader, ApiOperation, ApiCreatedResponse, ApiOkResponse, 
  ApiParam, ApiBody, ApiBadRequestResponse, ApiNotFoundResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';

// ========== SPECIFIC JOB API DECORATORS ==========

export const CreateJobApi = () => applyDecorators(
  ApiOperation({ summary: 'Create a new job (BD role required)' }),
  ApiHeader({
    name: 'role',
    description: 'User role must be (BD)',
    required: true,
    example: 'BD'
  }),
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1, description: 'ID of the BD who is creating the job' },
        title: { type: 'string', example: 'Full Stack Developer' },
        description: { type: 'string', example: 'Looking for a skilled developer...' },
        status: { type: 'string', example: 'open', description: 'Job status (optional)' },
        job_salary: { type: 'number', example: 80000, description: 'Job salary (optional)' },
        location: { type: 'string', example: 'New York, NY' },
        dev_id: { type: 'number', example: 5, description: 'Developer ID (optional)' },
      },
      required: ['userId', 'title', 'description', 'location'],
    },
  }),
  ApiCreatedResponse({ description: 'Job created successfully' }),
  ApiBadRequestResponse({ description: 'Invalid input data' }),
  ApiForbiddenResponse({ description: 'Access denied - BD role required' })
);

export const GetAllJobsApi = () => applyDecorators(
  ApiOperation({ summary: 'Get all jobs with user information (Admin only)' }),
  ApiHeader({
    name: 'role',
    description: 'User role should be (admin)',
    required: true,
    example: 'admin'
  }),
  ApiOkResponse({ description: 'List of jobs returned successfully' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin role required' })
);

export const GetJobsByDeveloperApi = () => applyDecorators(
  ApiOperation({ summary: 'Find jobs assigned to a specific developer (No auth required)' }),
  ApiParam({ name: 'devId', type: Number, description: 'Developer ID' }),
  ApiOkResponse({ description: 'Jobs found for developer' }),
  ApiNotFoundResponse({ description: 'Developer not found or no jobs assigned' })
);

export const GetJobsByUserApi = () => applyDecorators(
  ApiOperation({ summary: 'Find all jobs posted by a specific user. Sample URL: http://localhost:3000/jobs/user/1' }),
  ApiHeader({
    name: 'role',
    description: 'User role (admin or BD)',
    required: true,
    example: 'admin'
  }),
  ApiParam({ name: 'userId', type: Number, description: 'BD ID' }),
  ApiOkResponse({ description: 'Jobs found for user' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin or BD role required' }),
  ApiNotFoundResponse({ description: 'User not found or no jobs posted' })
);

export const GetJobByIdApi = () => applyDecorators(
  ApiOperation({ summary: 'Get job by ID with user information (Admin only)' }),
  ApiHeader({
    name: 'role',
    description: 'User role should be (admin)',
    required: true,
    example: 'admin'
  }),
  ApiParam({ name: 'id', type: Number, description: 'Job ID' }),
  ApiOkResponse({ description: 'Job returned successfully' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin role required' }),
  ApiNotFoundResponse({ description: 'Job not found' })
);

export const UpdateJobApi = () => applyDecorators(
  ApiOperation({ summary: 'Update job details by ID. Only Admin or the BD who owns the Job can update it.' }),
  ApiHeader({
    name: 'role',
    description: 'User role, should be (admin or BD)',
    required: true,
    example: 'admin'
  }),
  ApiHeader({
    name: 'bd_id',
    description: 'BD user ID (required only if role is BD)',
    required: false,
    example: '3'
  }),
  ApiParam({ name: 'id', type: Number, description: 'Job ID' }),
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Senior Full Stack Developer' },
        description: { type: 'string', example: 'Updated job description...' },
        status: { type: 'string', example: 'closed' },
        job_salary: { type: 'number', example: 90000 },
        location: { type: 'string', example: 'San Francisco, CA' },
        dev_id: { type: 'number', example: 7 },
      },
    },
  }),
  ApiOkResponse({ description: 'Job updated successfully' }),
  ApiBadRequestResponse({ description: 'Invalid input data' }),
  ApiForbiddenResponse({ description: 'Access denied - Only admin or job owner can update' }),
  ApiNotFoundResponse({ description: 'Job not found' })
);

export const DeleteJobApi = () => applyDecorators(
  ApiOperation({ summary: 'Delete a job (Admin only)' }),
  ApiHeader({
    name: 'role',
    description: 'User role (admin)',
    required: true,
    example: 'admin'
  }),
  ApiParam({ name: 'id', type: Number, description: 'Job ID' }),
  ApiOkResponse({ description: 'Job deleted successfully' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin role required' }),
  ApiNotFoundResponse({ description: 'Job not found' })
);

// ========== REUSABLE COMPONENTS (If needed for other controllers) ==========

export const AdminOnlyApi = (summary: string, hasParam: boolean = false) => applyDecorators(
  ApiOperation({ summary }),
  ApiHeader({
    name: 'role',
    description: 'User role should be (admin)',
    required: true,
    example: 'admin'
  }),
  ...(hasParam ? [ApiParam({ name: 'id', type: Number, description: 'ID parameter' })] : []),
  ApiOkResponse({ description: 'Operation successful' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin role required' })
);

export const BDOnlyApi = (summary: string, hasParam: boolean = false) => applyDecorators(
  ApiOperation({ summary }),
  ApiHeader({
    name: 'role',
    description: 'User role must be (BD)',
    required: true,
    example: 'BD'
  }),
  ...(hasParam ? [ApiParam({ name: 'id', type: Number, description: 'ID parameter' })] : []),
  ApiOkResponse({ description: 'Operation successful' }),
  ApiForbiddenResponse({ description: 'Access denied - BD role required' })
);

export const PublicApi = (summary: string, hasParam: boolean = false) => applyDecorators(
  ApiOperation({ summary }),
  ...(hasParam ? [ApiParam({ name: 'id', type: Number, description: 'ID parameter' })] : []),
  ApiOkResponse({ description: 'Operation successful' }),
  ApiNotFoundResponse({ description: 'Resource not found' })
);