
function search(string, keywords, range = 5) {
  if (typeof string !== "string") throw new TypeError("Please provide a string");
  var results = []
  var re = new RegExp(keywords.join("|"), 'gi');
  while ((match = re.exec(string)) !== null) {
    for (var i = 0; i < match.length; i++) {
      results.push({start: Math.max(match.index - range, 0), end: Math.min(match.index + match[i].length + range, string.length), highlights: [{start: match.index, length: match[i].length}]})
    }
  }
  results.sort((a, b) => a[0] - b[0])
  for (var i = 0; i < results.length - 1; i++) {
    // if the beginning on the next match is within range of the end of the previous match, join together
    if (results[i + 1].start <= results[i].end) {
      // only update the "end" position of the match if its greater
      if (results[i + 1].end > results[i].end) {
        results[i].end = results[i + 1].end
        results[i].highlights.push(results[i + 1].highlights[0])
      }
      // remove from array
      results.splice(i+1, 1)
    }
  }
  return results
};

function defaultHighlightFunction(text) {
  return '<span style="background-color: yellow">' + text + '</span>'
}

module.exports.highlightedSearch = function highlightedSearch(
  string,
  keywords,
  range = 5,
  matchConnector = ' ...',
  highlightFunction = defaultHighlightFunction
) {
  var matches = search(string, keywords, range)
  var result = [];
  for (var i = 0; i < matches.length; i++) {
    var matchString = matches[i].start === 0 ? [] : [matchConnector.trimStart()]
    matchString.push(string.substr(matches[i].start, matches[i].highlights[0].start - matches[i].start))
    for (var j = 0; j < matches[i].highlights.length; j++) {
      var currentMatch = matches[i].highlights[j]
      matchString.push(highlightFunction(string.substr(currentMatch.start, currentMatch.length)))
      if (j !== matches[i].highlights.length - 1) {
        var nextMatch = matches[i].highlights[j + 1]
        var nextString = string.substr(currentMatch.start + currentMatch.length, nextMatch.start - (currentMatch.start + currentMatch.length))
        matchString.push(nextString.trim() + matchConnector)
      }
    }
    var lastHighlight = matches[i].highlights[matches[i].highlights.length-1]
    matchString.push(string.substr(lastHighlight.start + lastHighlight.length, matches[i].end - (lastHighlight.start + lastHighlight.length)))
    result.push(matchString)
  }
  return result
}

module.exports.search = search
