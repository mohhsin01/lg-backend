import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictEmailException extends HttpException {
  constructor(email: string) {
    super(
      {
        statusCode: HttpStatus.CONFLICT,
        message: `Email "${email}" already exists.`,
        error: 'Conflict',
      },
      HttpStatus.CONFLICT,
    );
  }
}
