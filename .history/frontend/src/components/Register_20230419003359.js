import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

import { registration } from '../queries/queries'

const Register = () => {
  const history = useNavigate()

  /*const [courseCode, setCourseCode] = useState('')
  const [courseName, setCourseName] = useState('')
  const [section, setSection] = useState('')
  const [semester, setSemester] = useState('')*/

  const [userState, setState] = useState({
    firstName: "",
    lastName: "",
    password: "",
    usertype: "",
    email: "",
    city: "",
    address: "",
    phone: ""
})

  const [register, { loading, error }] = useMutation(registration, {
    onCompleted() {
      history('/courseslist')
    },
  })

  const setFirstname = (input) => {
    setState({ ...userState, firstName: input })
}

const setLastname = (input) => {
    setState({ ...userState, lastName: input })
}

const setPassword = (passwordInput) => {
    setState({ ...userState, password: passwordInput })
    console.log(userState)
}

const setAddress = (input) => {
    setState({ ...userState, address: input })
    console.log(userState)
}
const setCity = (input) => {
    setState({ ...userState, city: input })
    console.log(userState)
}
const setPhoneNumber = (input) => {
    setState({ ...userState, phone: input })
    console.log(userState)
}

const setRadioValue = (input) => {
    setState({ ...userState, usertype: input })
}

const setEmail = (input) => {
    setState({ ...userState, email: input })
}

const handleSubmit = async (e) => {
    e.preventDefault()
    await register({
        variables: userState
    })
}
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <label className="form-label" htmlFor="courseCode">
          Course Code:
        </label>
        <input
          className="form-input"
          type="text"
          id="courseCode"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label className="form-label" htmlFor="courseName">
          Course Name:
        </label>
        <input
          className="form-input"
          type="text"
          id="courseName"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label className="form-label" htmlFor="section">
          Section:
        </label>
        <input
          className="form-input"
          type="text"
          id="section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label className="form-label" htmlFor="semester">
          Semester:
        </label>
        <input
          className="form-input"
          type="text"
          id="semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
      </div>
      <button className="form-button" type="submit" disabled={loading}>
        Submit
      </button>
      {error && <p>Error adding course: {error.message}</p>}
    </form>
  )
}

export default Register
