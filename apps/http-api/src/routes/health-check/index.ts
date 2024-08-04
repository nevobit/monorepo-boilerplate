import { RouteOptions } from 'fastify';
import { MonoContext } from '@repo/core-modules';
import { verify } from '@repo/business-logic';

export const healthCheckRoute: RouteOptions = {
  method: 'GET',
  url: '/health-check',
  handler: async (req, replay) => {
    console.log(JSON.stringify({
      appVersion: MonoContext.getStateValue('version'),
      status: 'ok',
      uptime: process.uptime(),
    }, null, 2));

    await verify(req, replay)
    return {
      appVersion: MonoContext.getStateValue('version'),
      status: 'ok',
      uptime: process.uptime(),
    };
  },
};