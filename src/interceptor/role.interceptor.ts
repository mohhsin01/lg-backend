import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (!request.body.role) {
      request.body.role = 'admin';
    }
    if(!request.body.phone){
        request.body.phone='111222333';
    }
    if(!request.body.skill){
        request.body.skill='not Specefied'
    }
    if(!request.body.education){
        request.body.education='not Specefied'
    }
     if(!request.body.experience){
        request.body.experience='not Specefied'
    }

    return next.handle();
  }
}
