//import withRouter from './withRouter';

import React, { Component } from 'react'

function Home(props) {
  return (
    <div>
      <h2> Welcome to COMP308 Nurse & Patient System</h2>
      <p>
        Click on Register or Login to start.
      </p>
    </div>
  )
}
// withRouter will pass updated match, location, and history props
// to the wrapped component whenever it renders.
export default Home
