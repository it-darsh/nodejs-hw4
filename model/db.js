const low = require('lowdb');
const fileSync = require('lowdb/adapters/FileSync');
const adapter = new fileSync('./model/db.json');
const db = low(adapter);


const dbCRUD = {
  get: table => {
    return db.get(table)
      .value();
  },
  set: (table, arr) => {
    if(arr[0]) {
      db.set(table+'[0].number', Number(arr[0]))
        .write()
    }
    if(arr[1]) {
      db.set(table+'[1].number', Number(arr[1]))
        .write()
    }
    if(arr[2]) {
      db.set(table+'[2].number', Number(arr[2]))
        .write()
    }
    if(arr[3]) {
      db.set(table+'[3].number', Number(arr[3]))
        .write()
    }
  },
  add: (table, obj) => {
    db.get(table)
      .push(obj)
      .write()
  },
}

module.exports = dbCRUD;