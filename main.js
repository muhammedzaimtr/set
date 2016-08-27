var sets = [
  ["one", "two", "three"],
  ["striped", "blank", "full"],
  ["red", "green", "purple"],
  ["diamonds", "rounded", "curly"]
].map(group => group.map(feature => `f-${feature}`))

_.mixin({
  combine(self, ...arr) {
    return _.reduce(arr, (ret, newarr) => {
      return _.reduce(ret, (memo, oldi) => {
        return memo.concat(_.map(newarr, newi => oldi.concat(newi)))
      }, [])
    }, _.map(arguments[0], i => [i]))
  }
})

var points = 0
var cards = _.shuffle(_.combine.apply(null, sets))

function checkSet(cards) {
  var features = cards
    .map(card => card.split(" ")
      .filter(feature => feature.match(/^f\-/)))
  for (var i in features) {
    var feature = features.map(feature => feature[i])
    if (_.uniq(feature).length == 2) {
      return false
    }
  }
  return true
}

function addCard(card) {
  var className = card.join(" ")
  var board = document.getElementById("board")
  var card = document.createElement('li')
  card.onclick = function() {
    var selected = board.getElementsByClassName('selected')
    if (card.classList.contains('selected')) {
      card.classList.remove('selected')
      return
    } else if (selected.length < 3) {
      card.classList.add('selected')
    }
    if (selected.length == 3) {
      var check = checkSet([...selected].map(card => card.className))
      if (check) {
        setTimeout(() => {
          [...selected].forEach(card => card.parentNode.removeChild(card))
          addPoint()
          if (board.getElementsByTagName('li').length < 12) {
            addCards(3)
          }
        }, 300)
      } else {
        setTimeout(() => {
          [...selected].forEach(card => card.classList.remove('selected'))
        }, 500)
      }
    }
  }
  card.className = className
  board.appendChild(card)
}

function addPoint() {
	points++
  document.getElementById('points').innerHTML = points
}

function addCards(count) {
	if (cards.length < count) {
  	count = cards.length
  }
	_.times(count, () => cards.pop()).forEach(addCard)
}

document.getElementById("newCards").onclick = function () {
  addCards(3)
}

addCards(12)

