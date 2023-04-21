import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Routes,
} from 'react-router-dom'
//
// This app requires react-bootstrap and bootstrap installed:
//    npm install react-bootstrap bootstrap
//
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import './App.css'

import { ApolloProvider } from '@apollo/client'
import client from './apollo/client'

import Home from './components/Home'
import CourseList from './components/CourseList'
import NewCourseForm from './components/NewCourseForm'
import SymptomsChecker from './components/SymptomsChecker'

import EditCourse from './components/EditCourse'
import Register from './components/Register'
import Login from './components/Login'

//
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        {/* <Navbar bg="light" variant="dark" expand="lg" style={{backgroundColor: "#f5f5f5", fontSize: "1.2rem"}}>
          <Container>
            <Navbar.Brand href="#home"  style={{color: "#444"}}>
              COMP 308 Nurse & Patient System
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/home"  style={{color: "#444"}}>
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/symptoms-checker"  style={{color: "#444"}}>
                  Symptoms Checker
                </Nav.Link>
                <Nav.Link as={Link} to="/register"  style={{color: "#444"}}>
                  Register
                </Nav.Link>  
                <Nav.Link as={Link} to="/login"  style={{color: "#444"}}>
                  Login
                </Nav.Link> 
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar> */}


        <nav>
          <ul className="menu-container">
          <li className="menu-items">
              <div className="menu-item">
              COMP 308 Nurse & Patient System
              </div>
            </li>

            <li className="menu-items">
              <Link className="menu-item active" to="/">
                Home
              </Link>
            </li>
            <li className="menu-items">
              <Link className="menu-item" to="/symptoms-checker">
              Symptoms Checker
              </Link>
            </li>
            <li className="menu-items">
              <Link className="menu-item" to="/register">
              Register
              </Link>
            </li>
            <li className="menu-items">
              <Link className="menu-item" to="/login">
              Login
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="courseslist" element={<CourseList />} />
            <Route path="course/:id" element={<EditCourse />} />
            <Route path="addcourse" element={<NewCourseForm />} />
            <Route path="symptoms-checker" element={<SymptomsChecker />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  )
}
//<Route render ={()=> < App />} path="/" />
export default App
