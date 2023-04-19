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
  const [usertype, setUsertype] = useState('')

  const [register, { loading, error }] = useMutation(registration, {onCompleted() {
    alert("User successfully registered");  
    //history('/courseslist')//change this
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
        usertype,
      },
    })
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
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
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label className="form-label" htmlFor="email">
          Email:
        </label>
        <input
          className="form-input"
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label className="form-label" htmlFor="password">
          Password:
        </label>
        <input
          className="form-input"
          type="text"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label className="form-label" htmlFor="usertype">
          You are a (Nurse or Patient):
        </label>
        <input
          className="form-input"
          type="text"
          id="usertype"
          value={usertype}
          onChange={(e) => setUsertype(e.target.value)}
        />
      </div>
      <button className="form-button" type="submit" disabled={loading}>
        Submit
      </button>
      {error && <p>Error adding user: {error.message}</p>}
    </form>
  )
}

export default Register
