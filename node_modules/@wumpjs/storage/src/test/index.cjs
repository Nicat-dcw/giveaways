const Storage = require("../index.cjs").default

const db = new Storage()

db.set("a", "c")

console.log(db)