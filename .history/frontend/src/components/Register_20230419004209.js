import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

import { registration } from '../queries/queries'

const Register = () => {
  const history = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [usertype, setUsertype] = useState('')


  const [register, { loading, error }] = useMutation(registration, {onCompleted() {
      history('/courseslist')
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    register({
      variables: {
        firstName,
        lastName,
        email,
        password,
        address,
        city,
        phone,
        usertype,
      },
    })
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setAddress('')
    setCity('')
    setPhone('')
    setUsertype('')
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="input-container">
        <label className="form-label" htmlFor="firstName">
          First Name
        </label>
        <input
          className="form-input"
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label className="form-label" htmlFor="lastName">
          Last Name:
        </label>
        <input
          className="form-input"
          type="text"
          id="courseName"
          value={lastName}
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
