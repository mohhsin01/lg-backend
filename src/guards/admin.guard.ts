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

    // If no roles are required, allow access
    if (!requiredRoles) {
      console.log('No roles required for this route');
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Since no JWT, get role from headers only
    const role = 
      request.headers['role'] ||      
      request.headers['x-user-role'] ||
      request.body?.role ||           // Fallback to body
      request.query?.role;            // Fallback to query

    console.log('Headers received:', request.headers);
    console.log('Role from headers:', role);
    console.log('Required roles:', requiredRoles);

    if (!role) {
      throw new UnauthorizedException('Role is required. Please provide role in headers (key: "role").');
    }

    // Clean up the role value - remove quotes and normalize
    const normalizedRole = role.toString().toLowerCase().trim().replace(/['"]/g, '');
    const normalizedRequiredRoles = requiredRoles.map(r => r.toLowerCase().trim());

    console.log('Normalized role:', normalizedRole);
    console.log('Normalized required roles:', normalizedRequiredRoles);

    const allowed = normalizedRequiredRoles.includes(normalizedRole);

    if (!allowed) {
      throw new ForbiddenException(
        `Access denied! Your role '${normalizedRole}' is not authorized. Required role(s): ${requiredRoles.join(', ')}`
      );
    }

    console.log('Access granted for role:', normalizedRole);
    return true;
  }
}