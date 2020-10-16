import { IncomingMessage } from 'http';
import Session from './session';

export interface SessionCache {
  get: (req: IncomingMessage) => Session | null | undefined;
  set: (req: IncomingMessage, session: Session | null | undefined) => void;
  has: (req: IncomingMessage) => boolean;
  delete: (req: IncomingMessage) => void;
}
