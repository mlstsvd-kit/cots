import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface Session {
    userId?: string;
    oauthProvider?: string;
    oauthId?: string;
  }
}