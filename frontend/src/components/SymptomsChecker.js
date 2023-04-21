//import withRouter from './withRouter';
import React, { Component, useState } from 'react'
import symptomsBground from '../assets/symptoms.jpg'

function SymptomsChecker() {
  const [symptoms, setSymptoms] = useState({
    fever: false,
    fatigueOrWeakness: false,
    headache: false,
    muscleOrBodyAches: false,
    coughing: false,
    shortnessOfBreath: false,
    chestPainOrTightness: false,
    soreThroat: false,
    runnyOrStuffyNose: false,
    nauseaOrVomiting: false,
    diarrhea: false,
    abdominalPainOrCramping: false,
    rash: false,
    swollenLymphNodes: false,
    weightLoss: false,
    changesInVisionHearingOrSpeech: false,
    jointPainOrStiffness: false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = Object.values(symptoms).map((symptom) => (symptom ? 1 : 0))
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    })
    const result = await response.json()
    alert(
      'should rest:' +
        result.rest +
        '\n' +
        'should see doctor:' +
        result.doctor,
    )
    console.log(result)
  }

  const handleSymptomChange = (symptom) => {
    setSymptoms({ ...symptoms, [symptom]: !symptoms[symptom] })
  }

  return (
    <div
      style={{
        backgroundImage: `url(${symptomsBground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ fontSize: '1.5em', marginTop: '150px' }}
      >
        {Object.keys(symptoms).map((symptom) => (
          <div key={symptom} style={{ transform: 'scale(1.5)' }}>
            <label>
              <input
                type="checkbox"
                checked={symptoms[symptom]}
                onChange={() => handleSymptomChange(symptom)}
              />
              {symptom.charAt(0).toUpperCase() +
                symptom.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
          </div>
        ))}
        <button type="submit" style={{ marginTop: '1em' }}>
          Check Symptoms
        </button>
      </form>
    </div>
  )
}

// withRouter will pass updated match, location, and history props
// to the wrapped component whenever it renders.
export default SymptomsChecker
