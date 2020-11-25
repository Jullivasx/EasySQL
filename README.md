# EasySQL
    Упрощения при создании запросов в SQL(Postgresql)

## Методы

### init(key)
    Привязывает DATABASE_URL к модулю

### query(sql: string, resolveCallback?: function, rejectCallback?: function)
    Выполняет запрос SQL
    sql - запрос
    resolveCallback - исполняется при успехе

### createTable(nameTable, items)
    Создание таблицы nameTable, состоящие из полей items
    Пример items:
        [
            {
                name: 'id', // имя поля
                type: 'INT', // тип поля
                notNull: true, // поле не может быть пустым
            }
        ]
    }

### dropTable(nameTable)
    Удаление таблицы nameTable

### allTables
    Получения списка всех таблиц

### insert(nameTable, items)
    Вставка в таблицу(nameTable) значений items
    Пример:
        {
            id: 0,
            name: 'User',
        }

### select(nameTable, cols)
    Получения строк из таблицы(nameTable) с полями(cols)

## Тестирование
    В файле key.js должен находится модуль передающий DATABASE_URL
