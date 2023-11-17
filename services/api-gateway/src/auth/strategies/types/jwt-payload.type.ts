import { Session } from 'src/session/entities/session.entity';
import { User } from 'src/../users/entities/user.entity';

export type JwtPayloadType = Pick<User, 'id' | 'role'> & {
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
