const EasySql = require('./EasySql')

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
        EasySql.sqlCreateTable('test',
          [
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
        )
    )
    .toEqual(
        'CREATE TABLE test( id INT NOT NULL, name VARCHAR(50), age INT);'
    )
})

test('EasySql: sqlSelect', async () => {
    expect(
        EasySql.sqlSelect('test', 'name')
    )
    .toEqual(
        'SELECT name FROM test;'
    )
})
  
test('EasySql: sqlSelect - список полей', async () => {
    expect(
        EasySql.sqlSelect('test', ['name', 'id'])
    )
    .toEqual(
        'SELECT name, id FROM test;'
    )
})
  
test('EasySql: sqlInsert', async () => {
    expect(
        EasySql.sqlInsert('test', {
          'id': 0,
          'name': 'Lena',
        })
    )
    .toEqual(
        "INSERT INTO test (id, name) VALUES(0, 'Lena');"
    )
})