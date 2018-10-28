var toPull = require('stream-to-pull-stream')
var pull = require('pull-stream')
var CSV = require('pull-csv').parse
var Split = require('pull-split')
var Graph = require('./')
var i = 0

var filter = process.argv[2].split(/,/).map(function (e) { return e.trim() })
var headers = null
pull(
  toPull.source(process.stdin),
  Split(),
  CSV(),
  pull.filter(function (e) {
    if(!headers) {
      headers = {}
      e.forEach(function (k, j) {
        headers[k] = j
      })
      return true
    }
    return e.length
  }),
  pull.map(function (e) {
    return filter.map(function (k) { return e[headers[k]] })
  }),
  pull.collect(function (err, rows) {
    if(err) throw err
    console.log(Graph(rows.slice(1))) //slice to drop headers
  })
)




