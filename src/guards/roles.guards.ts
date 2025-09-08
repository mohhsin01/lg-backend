import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
console.log("i am in guards")
    if (!requiredRoles) {
      return true; 
    }

    const request = context.switchToHttp().getRequest();
    const role = request.headers['role'];  // 👈 get role from header

    if (!role) {
      throw new ForbiddenException('Role header not provided');
    }

    if (!requiredRoles.includes(role)) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }
}
