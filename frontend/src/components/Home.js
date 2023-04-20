//import withRouter from './withRouter';
import React, { Component } from 'react'
import nurse from '../assets/nursepatient.jpg';

function Home(props) {
  
  return (
    <section 
      style={{ 
        backgroundImage: `url(${nurse})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        height: "800px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        textAlign: "center"
      }}
    >
    </section>
  )
}
// withRouter will pass updated match, location, and history props
// to the wrapped component whenever it renders.
export default Home
