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
import EditCourse from './components/EditCourse'
import Register from './components/Register'
//
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar bg="primary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#home">
              React Client For Courses App
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/home">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/courseslist">
                  List of Courses
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div>
          <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="courseslist" element={<CourseList />} />
            <Route path="course/:id" element={<EditCourse />} />
            <Route path="addcourse" element={<NewCourseForm />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  )
}
//<Route render ={()=> < App />} path="/" />
export default App
