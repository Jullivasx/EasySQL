const { Client } = require('pg')

class EasySql {

  static #key = null

  /**
   * Привязывает DATABASE_URL к модулю
   * @param {*} key 
   */
  static init(key){
    EasySql.#key = key
  }

  /**
   * Выполняет запрос SQL
   * @param {*} sql 
   * @param {*} resolveCallback 
   * @param {*} rejectCallback 
   */
  static query(sql, resolveCallback, rejectCallback){
    const client = new Client({
      connectionString:  EasySql.#key,
      ssl: {
        rejectUnauthorized: false
      }
    })
    client.connect()
    return new Promise((resolve, reject) => {
      client.query(sql, (err, res) => {
        client.end()
        if(err){
          console.error('ERROR SQL: ' + sql + ' err: ' + err)
          if(typeof(rejectCallback) === 'function'){
            reject(rejectCallback(res))
          }else{
            reject()
          }
        }else{
          if(typeof(resolveCallback) === 'function'){
            resolve(resolveCallback(res))
          }else{
            resolve()
          }
        }
      })
    })
  }
  

  /**
   * Запрос на создание таблицы
   * @param {*} nameTable 
   * @param {*} items 
   */
  static sqlCreateTable(nameTable, items){
    let sql = 'CREATE TABLE ' + nameTable + '('
    sql += items.reduce((r, item, i, m) => {
      if(!item || typeof(item) !== 'object') return r
      if(!item.name) return r
      if(!item.type) return r
      r += ' ' + item.name + ' ' + item.type
      if(item.notNull) r+= ' ' + 'NOT NULL'
      if(i !== m.length - 1) r+= ','
      return r
    }, '')
    sql += ');'
    return sql
  }

  /**
   * Создание таблицы nameTable, состоящие из полей items
      Пример items:
          [
              {
                  name: 'id', // имя поля
                  type: 'INT', // тип поля
                  notNull: true, // поле не может быть пустым
              }
          ]
      }
   * @param {*} nameTable
   * @param {*} items 
   */
  static async createTable(nameTable, items){
    try{
      await EasySql.query(EasySql.sqlCreateTable(nameTable, items))
      return true
    }catch(e){
      return false
    }
  }

  /**
   * SQL запрос на удаление таблицы
   * @param {*} nameTable 
   */

  static sqlDropTable(nameTable){
    return `DROP TABLE ${nameTable};`
  }

  /**
   * Удаление таблицы nameTable
   * @param {*} nameTable 
   */
  static async dropTable(nameTable){
    try{
      await EasySql.query(EasySql.sqlDropTable(nameTable))
      return true
    }catch(e){
      return false
    }
  }

  /**
   * Получения списка всех таблиц
   */
  static async allTables(){
    const sql = `SELECT table_name FROM information_schema.tables  WHERE table_schema='public' ORDER BY table_name;`
    try{
      const res = await EasySql.query(sql, 
        (res) => {
          return res.rows.map( v => v.table_name)
      })
      return res
    }catch(e){
      return []
    }
  }

  

  /**
   * SQL запрос на вставку строки
   * @param {string} nameTable 
   * @param {object} items 
   */

  static sqlInsert(nameTable, items){
    if(typeof(nameTable) !== 'string'){
      return ''
    }
    const keys = Object.keys(items).join(', ')
    const values = Object.values(items).map(v => {
      if(typeof(v) === 'string' || typeof(v) === 'boolean') return `'${v}'`
      if(typeof(v) === 'number') return v
      return ''
    }).join(', ')
    return `INSERT INTO ${nameTable} (${keys}) VALUES(${values});`
  }

  /**
   * Вставка в таблицу(nameTable) значений items
   * Пример:
   * {
   *  id: 0,
   *  name: 'User',
   * }
   * @param {string} nameTable 
   * @param {object} items 
   */
  static async insert(nameTable, items){
    try{
      const res = await EasySql.query(EasySql.sqlInsert(nameTable, items))
      return res
    }catch(e){
      return null
    }
  }

  /**
   * Запрос на получения строки
   * @param {*} nameTable 
   * @param {*} cols 
   */
  static sqlSelect(nameTable, cols){
    if(typeof(nameTable) !== 'string'){
      return ''
    }
    let _cols = '*'
    if(typeof(cols) === 'string'){
      _cols = cols
    }
    if(Array.isArray(cols)){
      _cols = cols.join(', ')
    }
    return `SELECT ${_cols} FROM ${nameTable};`
  }

  /**
   * Получения строк из таблицы(nameTable) с полями(cols)
   * @param {string} nameTable
   * @param {string|array} cols 
   */
  static async select(nameTable, cols){
    try{
      const res = await EasySql.query(EasySql.sqlSelect(nameTable, cols), (v) => {
        return v.rows
      })
      return res
    }catch(e){
      return null
    }
  }

}

module.exports = EasySql