import { useState } from 'react'
import "@fontsource/karla"
import "@fontsource/inter"
import HeaderImage from '/blob-medium-yellow.png'
import FooterImage from '/blob-medium-blue.png'
import Question from './Components/Question'
import './App.css'

function App() {

  const [start, setStart] = useState(false)

  function handleStart() {
    setStart(prevState => !prevState)
  }


  return (
    <>
      <img className="headerImage" src={HeaderImage} /> 
      <main>
        {!start && (
          <div className="quiz-container">
          <h2 className="title">Quizzical</h2>
          <p className="description">
            Welcome to Quizzical, where you test 
            your general knowledge
          </p>
          <button className='qs-btn' onClick={handleStart}>Start Quiz</button>
        </div>
        )}
        {start && <Question />}
      </main>
      <img className="footerImage" src={FooterImage} /> 
    </>
  )
}

export default App
