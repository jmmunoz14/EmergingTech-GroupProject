import React, { useEffect, useInsertionEffect, useState } from 'react'
import { Form, Button, FloatingLabel, Card,Spinner } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom";
import { registration } from '../../graphql/mutation'
import { userQuery, useMutation } from "@apollo/client";
import { CreateDailyMotivationalFeed } from '../../graphql/mutation'

const DailyMotivationTipNurse = () => {
  const [tipState, setTipState] = useState({
    title: "",
    description: "",
    videoURL: "",
    date:new Date().toISOString()
  })
  const navigate = useNavigate()

  const [createDailyMotivationalFeed, {loading, error,data}] = useMutation(CreateDailyMotivationalFeed)

  const formSubmit = async (e) => {
    e.preventDefault();
   await createDailyMotivationalFeed({
      variables:tipState
    })
  }

  useEffect(()=>{
    if(!data && loading){
      return <Spinner animation="border" role="status" />
    }
    if(data?.createDailyMotivationalFeed.success){
      navigate('/patients')
    }

  },data)


  const setTitle = (input) => {
    setTipState({ ...tipState, title: input })
  }
  const setDescription = (input) => {
    setTipState({ ...tipState, description: input })
  }
  const setvideoURL = (input) => {
    setTipState({ ...tipState, videoURL: input })
  }


  return (
    <>
      <Card border="secondary" className='mt-3'>
        <Card.Body>
          <Card.Title>
            <div className="text-center"><span className="text-dark">Motivational Tip to Patients</span></div>
          </Card.Title>
          <Form onSubmit={e => formSubmit(e)}>

            <FloatingLabel label="Title" className="mb-3" controlId="title">
              <Form.Control type="text" placeholder="title " onChange={e => setTitle(e.target.value)} />
            </FloatingLabel>
            <FloatingLabel label="Description" className="mb-3" controlId="description">
              <Form.Control type="text" placeholder="Description" onChange={e => setDescription(e.target.value)} />
            </FloatingLabel>

            <FloatingLabel label="videoURL" className="mb-3" controlId="videoURL">
              <Form.Control type="text" placeholder="videoURL" onChange={e => setvideoURL(e.target.value)} />
            </FloatingLabel>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  )

}

export default DailyMotivationTipNurse