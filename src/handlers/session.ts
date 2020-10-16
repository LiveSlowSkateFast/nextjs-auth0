import { IncomingMessage } from 'http';
import { Session, SessionCache } from '../auth0-session';

export default function sessionHandler(sessionCache: SessionCache) {
  return (req: IncomingMessage): Session | null | undefined => {
    if (!req) {
      throw new Error('Request is not available');
    }

    return sessionCache.get(req);
  };
}
