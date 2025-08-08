import { JwtPayload } from '../types';

export class JwtUtils {
  static createPayload(user: any): JwtPayload {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
  }
}