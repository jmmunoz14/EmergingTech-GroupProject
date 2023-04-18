import { Link } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'

import { GET_COURSES } from '../queries/queries'
import { useEffect, useState } from 'react'

function CourseList() {
  const { loading, error, data, refetch } = useQuery(GET_COURSES)

  useEffect(() => {
    refetch() // Call the query again to get updated data
  }, [])

  useEffect(() => {
    if (data) {
      setCourseData(data)
    }
  }, [data])

  const [courseData, setCourseData] = useState(loading || error ? {} : data)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div>
      <h2>List of Courses</h2>

      <div className="add-btn">
        <a className="search" href={'addcourse/'}>
          {' '}
          Add Course
        </a>
      </div>

      <ul className="course-list">
        {courseData.courses &&
          courseData.courses.map((course) => (
            <li className="course-item" key={course._id}>
              <Link to={`/course/${course._id}`}>
                {course.courseCode} - {course.courseName}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default CourseList
