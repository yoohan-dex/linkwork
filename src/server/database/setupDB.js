import r from './rethinkdriver';
// 数据库
console.log('I yes');
const databases = ['jobtalk', 'ava'];

// 表
const database = [
  {name: 'users', indices: ['email']},
  {name: 'resume', indices: ['userId']},
];

// 判断是否更新，并清空池
export default async function setupDB(isUpdate = false) {
  await Promise.all(databases.map(db => ({db, isUpdate})).map(reset));
  await r.getPool().drain();
  console.log(`>>Database setup complete!`);
};

async function reset({db, isUpdate}) {
  // 判断是否已有数据库，没有就创建
  const dbList = await r.dbList();
  if (dbList.indexOf(db) === -1) {
    console.log(`>>Creating Database: ${db}`);
    await r.dbCreate(db);
  }
  // 判断是否更新表，不是更新就删除表
  const tables = await r.db(db).tableList();
  if (!isUpdate) {
    console.log(`>>Dropping tables on: ${db}`);
    await Promise.all(tables.map(table => r.db(db).tableDrop(table)));
  }
  // 开始创建表
  console.log(`>>Creating tables on: ${db}`);
  await Promise.all(database.map(table => {
    if (!isUpdate || tables.indexOf(table.name) === -1) {
      return r.db(db).tableCreate(table.name);
    }
    return Promise.resolve(false);
  }));
  // 填写索引
  console.log(`>>Adding table indices on: ${db}`);
  const tableIndicies = await Promise.all(database.map(table => {
    return r.db(db).table(table.name).indexList().run();
  }));
  await Promise.all([...database.map((table, i) => {
    const indicies = tableIndicies[i] || [];
    return table.indices.map(index => {
      if (indicies.indexOf(index) === -1) {
        return r.db(db).table(table.name).indexCreate(index).run();
      }
      return Promise.resolve(false);
    });
  })]);
  console.log(`>>Setup complete for: ${db}`);
}
