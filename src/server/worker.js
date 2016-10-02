import express from 'express';
import webpack from 'webpack';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import config from '../../webpack/webpack.config.dev';
import createSSR from './createSSR';
const PROD = process.env.NODE_ENV === 'production';

import {apolloExpress, graphiqlExpress} from 'apollo-server';
import {addResolveFunctionsToSchema} from 'graphql-tools';
import schema, {mocked} from './graphql/schemas';

export function run(worker) {
  console.log('   >> Worker PID:', process.pid);
  const app = express();
  const scServer = worker.scServer;
  const httpServer = worker.httpServer;
  httpServer.on('request', app);

  // HMR
  if (!PROD) {
    const compiler = webpack(config);
    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath,
    }));
    app.use(require('webpack-hot-middleware')(compiler));
  }

  // setup middleware
  app.use(bodyParser.json());
  app.use(cors({origin: true, credentials: true}));
  app.use((req, res, next) => {
    if (/\/favicon\.?(jpe?g|png|ico|gif)?$/i.test(req.url)) {
      res.status(404).end();
    } else {
      next();
    }
  });
  if (PROD) {
    app.use(compression());
    app.use('/static', express.static('build'));
  }

  // HTTP GraphQL endpoint
  app.post('/graphql', apolloExpress({
    schema,
  }));
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));
  // server-side rendering
  app.get('*', createSSR);

  // handle sockets
  scServer.on('connection', socket => {
    console.log('Client connected:', socket.id);
    // hold the client-submitted docs in a queue while they get validated & handled in the DB
    // then, when the DB emits a change, we know if the client caused it or not
    socket.docQueue = new Set();
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
  });
}
// TODO: dont let tokens expire while still connected, depends on PR to SC
