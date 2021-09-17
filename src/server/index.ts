import * as Hapi from '@hapi/hapi';
import * as Pino from 'hapi-pino';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import * as HapiCors from 'hapi-cors';
import * as HapiPulse from 'hapi-pulse';
import * as Qs from 'qs';
import routes from './routes';
import config from './config/config';
import { handleValidationError, responseHandler } from './utils';
import SwaggerOptions from './config/swagger';
import { pinoConfig } from './config/pino';
import initDatabase from './models';

const HapiSwagger = require('hapi-swagger');
const Package = require('../../package.json');

SwaggerOptions.info.version = Package.version;

const init = async () => {
  try {
    const server = await new Hapi.Server({
      port: config.server.port,
      host: config.server.host,
      query: {
        parser: (query) => Qs.parse(query),
      },
      routes: {
        validate: {
          options: {
            abortEarly: false,
          },
          failAction: handleValidationError,
        },
        response: {
          failAction: 'log',
        },
      },
    });
    server.realm.modifiers.route.prefix = '/api';
    await server.register([
      Inert,
      Vision,
      { plugin: Pino, options: pinoConfig(false) },
      { plugin: HapiSwagger, options: SwaggerOptions },
    ]);

    // Settin up routes
    server.route(routes);

    server.app.db = await initDatabase();
    // Error handler
    server.ext('onPreResponse', responseHandler);
    await server.register({
      plugin: HapiPulse,
      options: {
        timeout: 15000,
        signals: ['SIGINT'],
      },
    });

    await server.register({
      plugin: HapiCors,
      options: config.cors,
    });

    // Starting the server
    await server.start();
    server.log('info', `Server running at: ${server.info.uri}`);


    return server;
  } catch (err) {
    console.error('error');
    throw err;
  }
};

export { init };
