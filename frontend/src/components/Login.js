import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

import { logingql } from '../queries/queries'

const Login = () => {
  const history = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [login, { loading, error }] = useMutation(logingql, {onCompleted() {
    alert("User successfully logged in.");  
    //history('/courseslist')//change this to login page.
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    login({
      variables: {
        email,
        password,
      },
    })
    setEmail('')
    setPassword('')
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
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
      <button className="form-button" type="submit" disabled={loading}>
        Submit
      </button>
      {error && <p>Error logging in: {error.message}</p>}
    </form>
  )
}

export default Login