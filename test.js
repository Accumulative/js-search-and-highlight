const test = require('ava');
const {search, highlightedSearch } = require('./index')

test('matches are separated', t => {
  const result = search('Hello world next world', ['world'], 1)
  t.is(result.length, 2)
  t.is(result[0].end, 12)
  t.is(result[0].start, 5)
  t.is(result[0].highlights.length, 1)
  t.is(result[1].end, 22)
  t.is(result[1].start, 16)
  t.is(result[1].highlights.length, 1)
});
test('matches are aggregated', t => {
  const result = search('Hello world next world', ['world'], 10)
  t.is(result.length, 1)
  t.is(result[0].end, 22)
  t.is(result[0].start, 0)
  t.is(result[0].highlights.length, 2)
});
test('highlighted search', t => {
  const result = highlightedSearch('Hello world next world', ['world'], 10)
  const expected = [
    [
      'Hello ',
      '<span style="background-color: yellow">world</span>',
      'next ...',
      '<span style="background-color: yellow">world</span>',
      '',
    ],
  ]
  t.deepEqual(result, expected)
});
test('long highlighted search', t => {
  const result = highlightedSearch('Tri-tip fatback ham pork belly doner landjaeger biltong spare ribs cow strip steak turducken pork chop andouille. Frankfurter jerky sausage corned beef. Strip steak salami kielbasa t-bone brisket pork belly landjaeger venison drumstick. Bacon sausage turkey ball tip andouille, bresaola ribeye strip steak jerky ham hock meatball chicken porchetta. Ribeye pastrami tenderloin shank. Fatback porchetta pastrami swine, bresaola alcatra shank tenderloin venison biltong beef ribs.', ['Bacon', 'swine'], 10)
  const expected = [
    [
      '...',
      'rumstick. ',
      '<span style="background-color: yellow">Bacon</span>',
      ' sausage t',
    ],
    [
      '...',
      ' pastrami ',
      '<span style="background-color: yellow">swine</span>',
      ', bresaola',
    ],
  ]
  t.deepEqual(result, expected)
});




