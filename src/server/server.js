import {SocketCluster} from 'socketcluster';
import os from 'os';
import path from 'path';
import getDotenv from '../universal/utils/dotenv';

const numCpus = os.cpus().length;
getDotenv();

export const options = {
  authKey: process.env.JWT_SECRET,
  logLevel: 1,
  workers: 1 || numCpus,
  brokers: 1,
  port: process.env.PORT || 2333,
  appName: 'JOBtalk',
  allowClientPulish: false,
  initController: path.join(__dirname, '/init.js'),
  workerController: path.join(__dirname, './worker.js'),
  brokerController: path.join(__dirname, '/broker.js'),
  socketChannelLimit: 1000,
  rebootWorkerOnCrash: true,
};
new SocketCluster(options);

