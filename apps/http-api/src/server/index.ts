import "dotenv/config";
import os from "os";
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyRateLimit from "@fastify/rate-limit";
import {
  ConsoleTransport,
  Logger,
  LoggerTransportName,
  MonoContext,
} from "@repo/core-modules";
import { version, name } from "../../package.json";
import { registerRoutes } from "../routes";
import { initDataSources } from '@repo/data-sources';
import { setLogger } from "@repo/constant-definitions";
import { swaggerOptions, swaggerUiOptions } from "../docs";

const { PORT, HOST, REGION, CORS_ORIGIN, ENVIRONMENT } = process.env;

const consoleOptions = {
  transport: LoggerTransportName.CONSOLE,
  options: {
    destination: LoggerTransportName.CONSOLE,
    channelName: LoggerTransportName.CONSOLE,
  },
};

const logger = new Logger({
  optionsByLevel: {
    debug: [consoleOptions],
    info: [consoleOptions],
    warn: [consoleOptions],
    error: [consoleOptions],
    fatal: [consoleOptions],
    all: [consoleOptions],
    raw: [consoleOptions],
  },
  transports: {
    [LoggerTransportName.CONSOLE]: ConsoleTransport,
  },
  appIdentifiers: {
    region: REGION,
    clusterType: "",
    hostname: os.hostname(),
    app: name,
    version: version,
    environment: ENVIRONMENT,
    developer: os.userInfo().username
  },
  catchTransportErrors: true,
  logLevel: "all",

});

const corsOptions = {
  origin: CORS_ORIGIN!.split(","),
};

setLogger(logger);

MonoContext.setState({
  version,
  secret: null,
});

const main = async () => {
  await initDataSources({
    postgresqldb: {
      postgresUrl: "postgres://postgres:lrcjy7Ee1bP3m5dEVumX@joobs-dev-database.cnogsjm6nhj6.us-east-2.rds.amazonaws.com/postgres"
    },
    mongoose: {
      mongoUrl: "mongodb+srv://devdevops:PuTCtTJXRrtwbAEc@helebba-cluster.2ook891.mongodb.net/boilerplate?retryWrites=true"
    }
  })
  const server = fastify({
    logger: false,
  });

  server.register(fastifyCors, corsOptions);
  server.register(fastifyRateLimit, {
    max: 30,
    timeWindow: "1 minute",
    keyGenerator: (request) => request.ip,
    errorResponseBuilder: (request, context) => {
      return {
        code: 429,
        error: "Too Many Requests",
        message: `Rate limit exceeded, retry in ${context.after}`,
        date: Date.now(),
        expiresIn: context.after,
      };
    },
  });

  server.register(fastifySwagger, swaggerOptions);
  server.register(fastifySwaggerUi, swaggerUiOptions);

  server.register(
    (instance, options, next) => {
      registerRoutes(instance);
      next();
    },
    { prefix: "/api/v1" }
  );

    server.listen(
    { port: PORT || 8000, host: HOST },
    (err, address) => {
      logger.all(`Server successfully started on: `, { address });
      logger.info("Press CTRL-c to stop");
    }
  );
};

void main();