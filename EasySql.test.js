const EasySql = require('./EasySql')
EasySql.init(process.env.DATABASE_URL || require('./key'))

test('EasySql: создание/удаление таблицы, получения списка таблиц', async () => {
  
  let result = ''

  let list = await EasySql.allTables()
  if(list.includes('test')){
    await EasySql.dropTable('test')
  }

  await EasySql.createTable('test',
    [
      {
        name: 'name',
        type: 'VARCHAR(50)',
      }
    ]
  )
  list = await EasySql.allTables()
  if(list.includes('test')){
    result += 'C'
    await EasySql.dropTable('test')
    list = await EasySql.allTables()
    if(!list.includes('test')){
      result += 'D'
    }
  }

  expect(
      result,
  )
  .toEqual(
      'CD',
  )
}, 30000)

test('EasySql: вставка и проверка значения', async () => {

  let list = await EasySql.allTables()
  if(list.includes('test')){
    await EasySql.dropTable('test')
  }
  await EasySql.createTable('test',
    [
      {
        name: 'id',
        type: 'INT',
      },
      {
        name: 'name',
        type: 'VARCHAR(50)',
      },
    ]
  )

  await EasySql.insert('test', {
    id: 0,
    name: 'Lena',
  })

  const res = await EasySql.select('test', ['id', 'name'])

  list = await EasySql.allTables()
  if(list.includes('test')){
    await EasySql.dropTable('test')
  }

  expect(
      res,
  )
  .toEqual(
      [{
        id: 0,
        name: 'Lena',
      }]
  )

}, 30000)