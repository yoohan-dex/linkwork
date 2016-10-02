import r from '../../database/rethinkdriver';

export const getUserByEmail = async email => {
  const users = await r.table('users').getAll(email, {index: 'email'}).limit(1).run();
  return users[0];
};
