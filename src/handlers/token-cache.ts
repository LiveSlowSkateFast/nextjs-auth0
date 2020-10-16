import { NextApiRequest } from 'next';
import { Config, SessionCache } from '../auth0-session';
import { ITokenCache } from '../tokens/token-cache';
import SessionTokenCache from '../tokens/session-token-cache';

export default function tokenCacheHandler(config: Config, sessionCache: SessionCache) {
  return (req: NextApiRequest): ITokenCache => {
    if (!req) {
      throw new Error('Request is not available');
    }

    return new SessionTokenCache(config, sessionCache, req);
  };
}
