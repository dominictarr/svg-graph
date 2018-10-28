
function h (tag, attrs, children) {
  return {name: tag, attrs: attrs, children: children ? [].concat(children): []}
}

function toString(s) {
  if('string' === typeof s) return s
  return '<'+
    [s.name].concat(Object.keys(s.attrs)
      .map(function (k) {
        return k+'='+JSON.stringify(s.attrs[k].toString())
      })).join(' ')+
    (
      !s.children.length
      ? '/>'
      : '>' + s.children.map(toString).join('') + '</'+s.name+'>'
    )
}

module.exports = function (rows, opts) {
  opts = opts || {}
  var padding = opts.padding || 20
  var spacing = opts.spacing || 10
  var width = opts.width || 600
  var height = opts.height || 400
  var inner_height = height - padding * 2

  var step = (width - (padding*2 + spacing*(rows.length-1))) / rows.length

  var scale = inner_height/rows.reduce(function (a, e) {
    return Math.max(a, e[1])
  }, 0)

  function sideText(x,y,text) {
    return h('text', {
      x: 0, y: 0,
      transform: 'translate('+(x)+', '+ (y) +') rotate(-90)'
    }, text)
  }

  return toString(h('svg', {
    viewBox:[0, 0, width, height].join(' '),
    xmlns: "http://www.w3.org/2000/svg"
  },[
    h('style', {}, 'text { font-size: 8px; }'),
    h('g', {},
      rows.map(function (row, i) {
        var colour = 'hsl('+ ~~(i*360/rows.length) + ',100%,50%)'
        var x = padding + i * (step + spacing)
        return h('g', {}, [
          h('rect', {
            fill: colour,
            x: x, y: 0, width: step, height: row[1]*scale,
            transform: 'scale(1, -1) translate(0, '+-(height)+')'
          }),
          sideText(x + step, height, row[0]),
          h('text', {
            x: x,
            y: height - row[1]*scale - padding,
//            textLength: step
          },
            row[1].toString()
          ),
        ])
      })
    )
    ]
  ))
}

if(!module.parent) {
  console.log(module.exports([
    ['a', 3],
    ['b', 5],
    ['c', 4]
  ]))
}

