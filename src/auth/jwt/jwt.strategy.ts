
// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "sdfljhsdiufhisdbnfjksdbfhjksdfbjksdg",
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }
    
    return {
      id: payload.sub,
      email: payload.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}

// src/auth/jwt.interface.ts
export interface JwtPayload {
  email: string;
  sub: string;  // user id
  iat?: number; // issued at
  exp?: number; // expiration
}