import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);


    if (!requiredRoles) {
    
      return true;
      
    }

    const request = context.switchToHttp().getRequest();

    
    const role = 
      request.headers['role'] ||  request.body?.role || request.query?.role;            

    if (!role) {
      throw new UnauthorizedException('Role is required. Please provide role in headers (key: "role").');
    }


    const normalizedRole = role.toString().toLowerCase().trim().replace(/['"]/g, '');
    const normalizedRequiredRoles = requiredRoles.map(r => r.toLowerCase().trim());

   
    const allowed = normalizedRequiredRoles.includes(normalizedRole);

    if (!allowed) {
      throw new ForbiddenException(
        `Access denied! Your role '${normalizedRole}' is not authorized. Required role(s): ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }

}