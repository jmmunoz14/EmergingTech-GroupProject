import { gql } from '@apollo/client'

export const registration = gql`
  mutation registration(
    $email: String!
    $firstName: String!
    $lastName: String!
    $usertype:String!
    $password: String!
  ) {
    addUser(
          email: $email 
          firstName:$firstName
          lastName:$lastName
          usertype:$usertype
          password: $password
    ) {
      _id
      email
      firstName
      lastName
      usertype
      password
    }
  }
`
export const logingql = gql`
mutation logingql(
  $email: String!, 
  $password: String!
  ) {
  loginUser(
    email: $email, 
    password: $password
    ) {
      email
      usertype
  }
}
`
export const motivationalList= gql`
query motivationalList {
  motivationalList{
    title,
    description,
    videoURL
  }
}`
export const CreateDailyMotivationalFeed = gql`
mutation createDailyMotivationalFeed($title:String,$description:String,$videoURL:String,$date:String){
  createDailyMotivationalFeed(title: $title,description: $description,videoURL:$videoURL,date:$date){
    success
  }
}
`;
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
