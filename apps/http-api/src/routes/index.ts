import { FastifyInstance, RouteOptions } from 'fastify';
import { healthCheckRoute } from './health-check';

const routes: RouteOptions[] = [
    healthCheckRoute
]

export const registerRoutes = (fasitfy: FastifyInstance) => {
    routes.map((route) => {
        fasitfy.route(route);
    })
}