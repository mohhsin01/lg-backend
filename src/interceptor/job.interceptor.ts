import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JobInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      
      if (request.body) {
        
        if (request.body.dev_id === undefined || request.body.dev_id === null) {
          request.body.dev_id = 0; 
          
          console.log('JobInterceptor: Set default dev_id to 0');
        }
        
        if (!request.body.assigned_dev_id && request.body.dev_id === undefined) {
          request.body.dev_id = 0;
        }
      }
    }
    
    return next.handle();
  }
}