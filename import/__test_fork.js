const fs = require("fs")
const path = require("path")

let p = path.join(__dirname, "./")

fs.promises.readdir(p).then(console.log)

console.log(__dirname)
console.log(process.cwd())


