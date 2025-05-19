import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    console.log('user authentication middleware path :: ', req.path);
    next();
  }
}
