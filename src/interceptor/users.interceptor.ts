import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap,map } from 'rxjs/operators';


@Injectable()
export class UserDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('UserDataInterceptor is running before going into the controller');
    const request = context.switchToHttp().getRequest();
    if(!request.body.email){
    request.body={
      "email":"bcd@gmail.com",
      "name":"User Name",
      "password":"123456",
      "role":"user"
      
    };}
    

   return next.handle().pipe(
  tap(data => ({success: true, message: 'User Created successfully',order:data}

  ))
);
  }
}

