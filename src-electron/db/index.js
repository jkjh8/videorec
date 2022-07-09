import { app } from 'electron'
import Datastore from 'nedb-promises'

function dbInit(file) {
  const dbPath = app.getPath('userData')
  return new Datastore({
    filename: `${dbPath}/qlab/${file}`,
    timestampData: true,
    autoload: true
  })
}

const db = {
  setup: dbInit('recSetup')
}

export default db
