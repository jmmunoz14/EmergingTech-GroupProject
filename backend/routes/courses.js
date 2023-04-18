const express = require('express')
const router = express.Router()
const Course = require('../models/course')

// Getting all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
    console.log('hasta aqui todo bienss')

    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Getting One course
router.get('/:id', getCourse, (req, res) => {
  console.log('hasta aqui todo bien')

  res.json(res.course)
})

// Creating one course
router.post('/', async (req, res) => {
  const course = new Course({
    courseCode: req.body.courseCode,
    courseName: req.body.courseName,
    section: req.body.section,
    semester: req.body.semester,
  })
  try {
    const newcourse = await course.save()
    console.log('hasta aqui todo bien')
    res.status(201).json(newcourse)
  } catch (err) {
    console.log('hasta aqui todo mal')
    res.status(400).json({ message: err.message })
  }
})

// Updating One course
router.patch('/:id', getCourse, async (req, res) => {
  if (req.body.courseCode != null) {
    res.course.courseCode = req.body.courseCode
  }
  if (req.body.courseName != null) {
    res.course.courseName = req.body.courseName
  }
  if (req.body.section != null) {
    res.course.section = req.body.section
  }
  if (req.body.semester != null) {
    res.course.semester = req.body.semester
  }
  try {
    const updatedCourse = await res.course.save()
    res.json(updatedCourse)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Deleting One course
router.delete('/:id', getCourse, async (req, res) => {
  try {
    await res.course.remove()
    res.json({ message: 'Deleted Course' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getCourse(req, res, next) {
  let course
  try {
    course = await Course.findById(req.params.id)
    if (course == null) {
      return res.status(404).json({ message: 'Cannot find course' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.course = course
  next()
}

module.exports = router
