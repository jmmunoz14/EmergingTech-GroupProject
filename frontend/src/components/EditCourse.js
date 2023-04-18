import React, { useEffect, useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { useParams, useNavigate } from 'react-router-dom'
import { EDIT_COURSE, GET_COURSE, DELETE_COURSE } from '../queries/queries'

function EditCourse() {
  const history = useNavigate()
  const { id } = useParams()

  // Retrieve course data
  const { loading, error, data } = useQuery(GET_COURSE, {
    variables: { _id: id },
  })

  useEffect(() => {
    if (data) {
      setCourseData(data.course)
    }
  }, [data])

  // Set initial form state with course data
  const [courseData, setCourseData] = useState(
    loading || error ? {} : data.course,
  )

  // Update form state when inputs change
  const handleChange = (e) => {
    const { name, value } = e.target
    setCourseData({ ...courseData, [name]: value })
  }

  // Submit form data
  const [updateCourse] = useMutation(EDIT_COURSE, {
    onCompleted: () => {
      history('/courseslist')
    },
  })

  const [deleteCourse] = useMutation(DELETE_COURSE, {
    onCompleted: () => {
      history('/courseslist')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    updateCourse({
      variables: {
        _id: courseData._id,
        courseCode: courseData.courseCode,
        courseName: courseData.courseName,
        section: courseData.section,
        semester: courseData.semester,
      },
    })
  }

  const handleDelete = (e) => {
    e.preventDefault()
    deleteCourse({
      variables: {
        _id: courseData._id,
      },
    })
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div>
      <h2>Edit Course</h2>
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="input-container">
          <label className="form-label" htmlFor="courseCode">
            Course Code
          </label>
          <input
            className="form-input"
            type="text"
            name="courseCode"
            value={courseData.courseCode}
            onChange={handleChange}
          />
        </div>
        <div className="input-container">
          <label className="form-label" htmlFor="courseName">
            Course Name
          </label>
          <input
            className="form-input"
            type="text"
            name="courseName"
            value={courseData.courseName}
            onChange={handleChange}
          />
        </div>
        <div className="input-container">
          <label className="form-label" htmlFor="section">
            Section
          </label>
          <input
            className="form-input"
            type="text"
            name="section"
            value={courseData.section}
            onChange={handleChange}
          />
        </div>
        <div className="input-container">
          <label className="form-label" htmlFor="semester">
            Semester
          </label>
          <input
            className="form-input"
            type="text"
            name="semester"
            value={courseData.semester}
            onChange={handleChange}
          />
        </div>
        <button className="form-button" type="submit">
          Save Changes
        </button>

        <button className="delete-button" type="button" onClick={handleDelete}>
          Delete Course
        </button>
      </form>
    </div>
  )
}

export default EditCourse
