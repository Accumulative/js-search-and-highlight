function search(string, keywords, range = 5) {
  if (typeof string !== 'string') throw new TypeError('Please provide a string');
  let match;
  const results = [];
  const re = new RegExp(keywords.filter((k) => k).join('|'), 'gi');
  match = re.exec(string);
  while (match !== null) {
    for (let i = 0; i < match.length; i += 1) {
      results.push({
        start: Math.max(match.index - range, 0),
        end: Math.min(match.index + match[i].length + range, string.length),
        highlights: [{ start: match.index, length: match[i].length }],
      });
    }
    match = re.exec(string);
  }
  results.sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < results.length - 1; i += 1) {
    /* if the beginning on the next match is within
     * range of the end of the previous match, join together
     */
    if (results[i + 1].start <= results[i].end) {
      // only update the "end" position of the match if its greater
      if (results[i + 1].end > results[i].end) {
        results[i].end = results[i + 1].end;
        results[i].highlights.push(results[i + 1].highlights[0]);
      }
      // remove from array
      results.splice(i + 1, 1);
      i -= 1;
    }
  }
  return results;
}

function defaultHighlightFunction(text) {
  return `<span style="background-color: yellow">${text}</span>`;
}

module.exports.highlightedSearch = function highlightedSearch(
  string,
  keywords,
  range = 5,
  matchConnector = ' ...',
  highlightFunction = defaultHighlightFunction,
) {
  const matches = search(string, keywords, range);
  const result = [];
  for (let i = 0; i < matches.length; i += 1) {
    const matchString = matches[i].start === 0 ? [] : [matchConnector.trimStart()];
    matchString.push(
      string.substr(
        matches[i].start,
        matches[i].highlights[0].start - matches[i].start,
      ),
    );
    for (let j = 0; j < matches[i].highlights.length; j += 1) {
      const currentMatch = matches[i].highlights[j];
      matchString.push(highlightFunction(string.substr(currentMatch.start, currentMatch.length)));
      if (j !== matches[i].highlights.length - 1) {
        const nextMatch = matches[i].highlights[j + 1];
        const nextString = string.substr(
          currentMatch.start + currentMatch.length,
          nextMatch.start - (currentMatch.start + currentMatch.length),
        );
        matchString.push(nextString);
      }
    }
    const lastHighlight = matches[i].highlights[matches[i].highlights.length - 1];
    matchString.push(string.substr(
      lastHighlight.start + lastHighlight.length,
      matches[i].end - (lastHighlight.start + lastHighlight.length),
    ));
    result.push(matchString);
  }
  return result;
};

module.exports.search = search;
