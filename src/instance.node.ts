import {
  ConfigParameters,
  getConfig,
  CookieStore,
  TransientCookieHandler,
  loginHandler,
  logoutHandler,
  callbackHandler,
  clientFactory
} from './auth0-session';
import { profileHandler, sessionHandler, requireAuthentication, tokenCache } from './handlers';
import { NextApiRequest, NextApiResponse } from 'next';
import onHeaders from 'on-headers';

export default function createInstance(params: ConfigParameters) {
  const config = getConfig(params);
  const getClient = clientFactory(config);
  const transientHandler = new TransientCookieHandler(config);
  const cookieStore = new CookieStore(config, getClient);
  const sessionCache = new WeakMap();

  const wrap = (fn: Function) => (req: NextApiRequest, res: NextApiResponse, ...args: any) => {
    sessionCache.set(req, cookieStore.read(req));
    onHeaders(res, () => cookieStore.save(req, res, sessionCache.get(req)));
    return fn(req, res, ...args);
  };

  const wrapReadOnly = (fn: Function) => (req: NextApiRequest, ...args: any) => {
    sessionCache.set(req, cookieStore.read(req));
    return fn(req, ...args);
  };

  return {
    handleLogin: loginHandler(config, getClient, transientHandler),
    handleLogout: wrap(logoutHandler(config, getClient, sessionCache)),
    handleCallback: wrap(callbackHandler(config, getClient, sessionCache, transientHandler)),
    handleProfile: wrap(profileHandler(sessionCache, getClient)),
    getSession: wrapReadOnly(sessionHandler(sessionCache)),
    requireAuthentication: wrap(requireAuthentication(sessionCache)),
    tokenCache: wrapReadOnly(tokenCache(config, sessionCache))
  };
}
