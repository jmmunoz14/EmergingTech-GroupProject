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
        <label className="form-label" htmlFor="address">
          Address:
        </label>
        <input
          className="form-input"
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label className="form-label" htmlFor="city">
          City:
        </label>
        <input
          className="form-input"
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label className="form-label" htmlFor="phone">
          Phone:
        </label>
        <input
          className="form-input"
          type="number"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label className="form-label" htmlFor="usertype">
            You are a:
        </label>
        <select
            className="form-select"
            id="usertype"
            value={usertype}
            onChange={(e) => setUsertype(e.target.value)} >
            <option value="">Select your user type</option>
            <option value="nurse">Nurse</option>
            <option value="patient">Patient</option>
        </select>
        </div>

      <button className="form-button" type="submit" disabled={loading}>
        Submit
      </button>
      {error && <p>Error adding user: {error.message}</p>}
    </form>
  )
}

export default Register
