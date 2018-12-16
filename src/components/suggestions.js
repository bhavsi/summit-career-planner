//***************************************************
//    suggestions.js    Author: Sira Nassoko
//    Suggestions for the search-bar.js component
//***************************************************

import React from 'react'

const Suggestions = (props) => {
  const options = props.results.map(r => (
    <li key={r.id}>
      {r.name}
    </li>
  ))
  return <ul>{options}</ul>
}

export default Suggestions
