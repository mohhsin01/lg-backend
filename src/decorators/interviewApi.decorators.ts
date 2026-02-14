import { applyDecorators } from '@nestjs/common';
import { 
  ApiHeader, ApiOperation, ApiCreatedResponse, ApiOkResponse, 
  ApiParam, ApiBody, ApiBadRequestResponse, ApiNotFoundResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';

// ========== SPECIFIC INTERVIEW API DECORATORS ==========

export const CreateInterviewApi = () => applyDecorators(
  ApiOperation({ summary: 'Assign an interview to a developer for a job (Admin only)' }),
  ApiHeader({
    name: 'role',
    description: 'User role must be (admin)',
    required: true,
    example: 'admin'
  }),
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        job_id: { type: 'number', example: 1, description: 'Job ID - must exist in jobs table' },
        user_id: { type: 'number', example: 5, description: 'Developer/User ID - must exist in users table' },
        round_no: { type: 'number', example: 1, description: 'Interview round number' },
        date: { type: 'string', example: '2025-09-15', description: 'Interview date (YYYY-MM-DD)' },
        time: { type: 'string', example: '10:00', description: 'Interview time (HH:MM)' },
        status: { type: 'string', example: 'scheduled', description: 'Interview status (optional, defaults to "scheduled")' },
      },
      required: ['job_id', 'user_id', 'round_no', 'date', 'time'],
    },
  }),
  ApiCreatedResponse({ description: 'Interview assigned successfully' }),
  ApiBadRequestResponse({ description: 'Invalid input data or user/job not found' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin role required' })
);

export const GetAllInterviewsApi = () => applyDecorators(
  ApiOperation({ summary: 'Get all interviews with job and user information (Admin only)' }),
  ApiHeader({
    name: 'role',
    description: 'User role must be (admin)',
    required: true,
    example: 'admin'
  }),
  ApiOkResponse({ description: 'List of interviews returned successfully' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin role required' })
);

export const GetInterviewsByJobApi = () => applyDecorators(
  ApiOperation({ summary: 'Get interviews by job ID (Admin only)' }),
  ApiHeader({
    name: 'role',
    description: 'User role must be (admin)',
    required: true,
    example: 'admin'
  }),
  ApiParam({ name: 'job_id', type: Number, description: 'Job ID' }),
  ApiOkResponse({ description: 'Interviews found for job' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin role required' }),
  ApiNotFoundResponse({ description: 'No interviews found for this job' })
);

export const GetInterviewsByUserApi = () => applyDecorators(
  ApiOperation({ 
    summary: 'Get interviews by user ID (Admin or the specific developer only)',
    description: 'Admin can view any user\'s interviews. Developers can only view their own interviews.'
  }),
  ApiHeader({
    name: 'role',
    description: 'User role must be (admin) or (developer)',
    required: true,
    example: 'admin'
  }),
  ApiHeader({
    name: 'user_id',
    description: 'Current user ID (required for developers to ensure they can only access their own interviews)',
    required: false,
    example: '5'
  }),
  ApiParam({ name: 'user_id', type: Number, description: 'Target user ID to get interviews for' }),
  ApiOkResponse({ description: 'Interviews found for user' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin role required or developers can only view their own interviews' }),
  ApiNotFoundResponse({ description: 'No interviews found for this user' })
);

export const UpdateInterviewApi = () => applyDecorators(
  ApiOperation({ summary: 'Update interview details (Admin only)' }),
  ApiHeader({
    name: 'role',
    description: 'User role must be (admin)',
    required: true,
    example: 'admin'
  }),
  ApiParam({ name: 'id', type: Number, description: 'Interview ID' }),
  ApiBody({
    schema: {
      type: 'object',
      properties: {
        job_id: { type: 'number', example: 2, description: 'Job ID (optional)' },
        user_id: { type: 'number', example: 7, description: 'Developer/User ID (optional)' },
        round_no: { type: 'number', example: 2, description: 'Interview round number (optional)' },
        date: { type: 'string', example: '2025-09-20', description: 'Interview date (optional)' },
        time: { type: 'string', example: '14:00', description: 'Interview time (optional)' },
        status: { type: 'string', example: 'completed', description: 'Interview status (optional)' },
      },
    },
  }),
  ApiOkResponse({ description: 'Interview updated successfully' }),
  ApiBadRequestResponse({ description: 'Invalid input data or user/job not found' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin role required' }),
  ApiNotFoundResponse({ description: 'Interview not found' })
);

export const DeleteInterviewApi = () => applyDecorators(
  ApiOperation({ summary: 'Delete an interview (Admin only)' }),
  ApiHeader({
    name: 'role',
    description: 'User role must be (admin)',
    required: true,
    example: 'admin'
  }),
  ApiParam({ name: 'id', type: Number, description: 'Interview ID' }),
  ApiOkResponse({ description: 'Interview deleted successfully' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin role required' }),
  ApiNotFoundResponse({ description: 'Interview not found' })
);

// ========== REUSABLE COMPONENTS FOR INTERVIEWS ==========

export const AdminOnlyInterviewApi = (summary: string, hasParam: boolean = false) => applyDecorators(
  ApiOperation({ summary }),
  ApiHeader({
    name: 'role',
    description: 'User role must be (admin)',
    required: true,
    example: 'admin'
  }),
  ...(hasParam ? [ApiParam({ name: 'id', type: Number, description: 'Interview ID' })] : []),
  ApiOkResponse({ description: 'Operation successful' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin role required' }),
  ApiNotFoundResponse({ description: 'Interview not found' })
);

export const AdminOrDeveloperApi = (summary: string, hasParam: boolean = false) => applyDecorators(
  ApiOperation({ summary }),
  ApiHeader({
    name: 'role',
    description: 'User role must be (admin) or (developer)',
    required: true,
    example: 'admin'
  }),
  ApiHeader({
    name: 'user_id',
    description: 'Current user ID (required for developers)',
    required: false,
    example: '5'
  }),
  ...(hasParam ? [ApiParam({ name: 'user_id', type: Number, description: 'Target user ID' })] : []),
  ApiOkResponse({ description: 'Operation successful' }),
  ApiForbiddenResponse({ description: 'Access denied - Admin or specific developer role required' }),
  ApiNotFoundResponse({ description: 'Resource not found' })
);