import {readCert} from './readCert';
import flag from 'node-env-flag';

export default () => {
  const config = {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.envDATABASE_PORT || 28015,
    authKey: process.env.DATABASE_AUTH_KEY || '',
    db: process.env.NODE_ENV === 'testing' ? 'ava' : 'jobtalk',
    min: process.env.NODE_ENV === 'production' ? 50 : 3,
    buffer: process.env.NODE_ENV === 'production' ? 50 : 3,
  };

  if (process.env.NODE_ENV && flag(process.env.DATABASE_SSL)) {
    Object.assign(config, {
      ssl: {
        ca: readCert(),
      },
    });
  }
  return config;
};
