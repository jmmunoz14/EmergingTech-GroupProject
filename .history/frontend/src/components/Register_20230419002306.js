import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

import { ADD_COURSE, GET_COURSES } from '../queries/queries'

const Register = () => {
  const history = useNavigate()

  const [courseCode, setCourseCode] = useState('')
  const [courseName, setCourseName] = useState('')
  const [section, setSection] = useState('')
  const [semester, setSemester] = useState('')

  const [addCourse, { loading, error }] = useMutation(ADD_COURSE, {
    onCompleted() {
      history('/courseslist')
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    addCourse({
      variables: {
        courseCode,
        courseName,
        section,
        semester,
      },
    })
    setCourseCode('')
    setCourseName('')
    setSection('')
    setSemester('')
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
