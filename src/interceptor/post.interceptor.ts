import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap,map } from 'rxjs/operators';


@Injectable()
export class PostDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('PostDataInterceptor is running before going into the controller');
    const request = context.switchToHttp().getRequest();
    request.body={
      "title":"This is the Title",
        "content":"This is the content"
      
    }

   return next.handle().pipe(
  map(data => ({success: true, message: 'Post Created successfully',order:data}

  ))
);
  }
}

