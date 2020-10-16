import { NextApiResponse, NextApiRequest } from 'next';
import { ClientFactory, SessionCache } from '../auth0-session';

export type ProfileOptions = {
  refetch?: boolean;
};

export default function profileHandler(sessionCache: SessionCache, getClient: ClientFactory) {
  return async (req: NextApiRequest, res: NextApiResponse, options?: ProfileOptions): Promise<void> => {
    if (!req) {
      throw new Error('Request is not available');
    }

    if (!res) {
      throw new Error('Response is not available');
    }

    const session = await sessionCache.get(req);
    if (!session || !session.user) {
      res.status(401).json({
        error: 'not_authenticated',
        description: 'The user does not have an active session or is not authenticated'
      });
      return;
    }

    if (options && options.refetch) {
      const { tokenSet } = session;

      const client = await getClient();
      const userInfo = await client.userinfo(tokenSet);

      session.user = {
        ...session.user,
        ...userInfo
      };

      res.json(session.user);
      return;
    }

    res.json(session.user);
  };
}
