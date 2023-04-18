import { gql } from '@apollo/client'

export const GET_COURSES = gql`
  query GetCourses {
    courses {
      _id
      courseCode
      courseName
      section
      semester
    }
  }
`
export const DELETE_COURSE = gql`
  mutation($_id: String!) {
    deleteCourse(_id: $_id) {
      _id
      courseCode
      courseName
      section
      semester
    }
  }
`

export const ADD_COURSE = gql`
  mutation AddCourse(
    $courseCode: String!
    $courseName: String!
    $section: String!
    $semester: String!
  ) {
    addCourse(
      courseCode: $courseCode
      courseName: $courseName
      section: $section
      semester: $semester
    ) {
      _id
      courseCode
      courseName
      section
      semester
    }
  }
`

export const GET_COURSE = gql`
  query GetCourse($_id: String!) {
    course(_id: $_id) {
      _id
      courseCode
      courseName
      section
      semester
    }
  }
`

export const EDIT_COURSE = gql`
  mutation EditCourse(
    $_id: String!
    $courseCode: String!
    $courseName: String!
    $section: String!
    $semester: String!
  ) {
    editCourse(
      _id: $_id
      courseCode: $courseCode
      courseName: $courseName
      section: $section
      semester: $semester
    ) {
      _id
      courseCode
      courseName
      section
      semester
    }
  }
`
