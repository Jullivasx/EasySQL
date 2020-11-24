const { Client } = require('pg')

class EasySql {

  static #key = null

  //Инициализация
  static init(key){
    EasySql.#key = key
  }

  //Запрос
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
          console.error('ERROR SQL: ' + sql)
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

  //удаление таблицы
  static sqlDropTable(name){
    return `DROP TABLE ${name};`
  }

  //создание таблицы
  static sqlCreateTable(shema){
    if(
      !shema ||
      typeof(shema) !== 'object'
    ) return

    const { name, items } = shema
    
    let sql = 'CREATE TABLE ' + name + '('
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

  //CreateTable
  static async createTable(shema){
    try{
      await EasySql.query(EasySql.sqlCreateTable(shema))
      return true
    }catch(e){
      return false
    }
  }

  //DropTable
  static async dropTable(name){
    try{
      await EasySql.query(EasySql.sqlDropTable(name))
      return true
    }catch(e){
      return false
    }
  }

  //AllTables
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

}

module.exports = EasySql