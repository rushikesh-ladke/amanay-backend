// jwt-auth.guard.ts
import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    // this.logger.debug(`
    //   Auth Header: ${authHeader}
    //   Token Format: ${authHeader?.split(' ')[0]}
    //   Raw Token: ${authHeader?.split(' ')[1]}
    // `);

    // Validate token structure
    if (authHeader) {
      const [bearer, token] = authHeader.split(' ');
      
      if (bearer !== 'Bearer') {
        this.logger.error('Missing Bearer prefix');
        return false;
      }

      try {
        // Attempt to decode without verification
        const decoded = jwt.decode(token);
        // this.logger.debug(`Decoded token: ${JSON.stringify(decoded)}`);
      } catch (error) {
        this.logger.error(`Decode failed: ${error.message}`);
      }
    }

    return super.canActivate(context);
  }
}