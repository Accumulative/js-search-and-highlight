# js-search-and-highlight

## Installation
`npm install https:/github.com/Accumulative/js-search-and-highlight`

## Usage in React
```js
import React, { useState } from 'react';
import { highlightedSearch } from '@Accumulative/js-search-and-highlight';

const MyComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const highlightFunction = (text) => <span style={{ background: 'yellow' }}>{text}</span>;

  return (
    <div>
      <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      {searchTerm && highlightedSearch("I want to search this text", searchTerm.split(' '), 15, ' ...', highlightFunction)}
    </div>
  );
}
```
