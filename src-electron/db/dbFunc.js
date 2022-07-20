import db from './index.js'

export const dbSetupUpdate = async (args) => {
  return await db.setup.update(
    { key: args.key },
    { $set: { value: args.value } },
    { upsert: true }
  )
}

export const dbSetupFind = async () => {
  return await db.setup.get({})
}

export const dbSetupFindOne = async (key) => {
  return await db.setup.findOne({ key })
}
