const EasySql = require('./EasySql')
EasySql.init(process.env.DATABASE_URL || require('./key'))

test('EasySql: sqlDropTable', async () => {
  expect(
      EasySql.sqlDropTable('test')
  )
  .toEqual(
      'DROP TABLE test;'
  )
})

test('EasySql: sqlCreateTable', async () => {
  expect(
      EasySql.sqlCreateTable({
        name: 'test',
        items: [
          {
            name: 'id',
            type: 'INT',
            notNull: true,
          },
          {
            name: 'name',
            type: 'VARCHAR(50)',
          },
          {
            name: 'age',
            type: 'INT',
          },
        ]
      })
  )
  .toEqual(
      'CREATE TABLE test( id INT NOT NULL, name VARCHAR(50), age INT);'
  )
})

test('EasySql: получения списка таблиц', async () => {
  const res = await EasySql.allTables()
  expect(
      res.includes('actress'),
  )
  .toEqual(
      true,
  )
})

test('EasySql: создание таблицы', async () => {
  let res = await EasySql.allTables()
  if(res.includes('test')){
    res = await EasySql.dropTable('test')
  }
  res = await EasySql.createTable({
    name: 'test',
    items: [
      {
        name: 'name',
        type: 'VARCHAR(50)',
      }
    ]
  })
  res = await EasySql.allTables()
  expect(
      res.includes('test'),
  )
  .toEqual(
      true,
  )
})

test('EasySql: удаление таблицы', async () => {

  let res = await EasySql.allTables()

  if(!res.includes('test')){
    await EasySql.createTable({
      name: 'test',
      items: [
        {
          name: 'name',
          type: 'VARCHAR(50)',
        }
      ]
    })
  }
  
  await EasySql.dropTable('test')

  res = await EasySql.allTables()
  expect(
      res.includes('test'),
  )
  .toEqual(
      false,
  )
})