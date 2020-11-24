# EasySQL
    Упрощения при создании запросов в SQL(Postgresql)

## Методы

### init(key)
    Привязывает DATABASE_URL к модулю

### query(sql: string, resolveCallback?: function, rejectCallback?: function)
    Выполняет запрос
    sql - запрос
    resolveCallback - исполняется при успехе

### createTable(shema)
    Создание таблицы

    Пример shema: {
        name: 'test', // имя таблицы
        items: [
            {
                name: 'id', // имя поля
                type: 'INT', // тип поля
                notNull: true, // поле не может быть пустым
            }
        ]
    }

### dropTable(name)
    Удаление таблицы

### allTables
    Получения списка всех таблиц

## Тестирование
    В файле key.js должен находится модуль передающий DATABASE_URL
