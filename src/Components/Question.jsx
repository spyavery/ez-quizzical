import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid';
import {decode} from 'html-entities';
function Question() {

    const [questions, setQuestions] = useState([])
    const [reset, setReset] = useState(0)
    const [checkAnswer, setCheckAnswer] = useState(false)
    const [triviaAnswers, setTriviaAnwers] = useState(0)



    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
                .then((response) => response.json())
                .then((data) => {
                    let resultArray = [];
                    data.results.map((result) => {
                        return resultArray.push({
                            id: nanoid(),
                            question: result.question,
                            correct_answer: result.correct_answer,
                            answers: result.incorrect_answers
                                .concat(result.correct_answer)
                                .sort(
                                    () => Math.random() - 0.5
                                ) /* Randomize the answers */,
                            selectedAnswer: "",
                        });
                    });
                    setQuestions(resultArray);
                });
    }, [reset])

    function holdAnswer(question, answer){
        !checkAnswer &&
        setQuestions(prevQuestion => prevQuestion.map(quest => {
            return quest.question === question && quest.answers.includes(answer)
            ? {...quest, selectedAnswer: answer }
            : quest
        }))
    }

    function checkResult() {
        let correctAnswers = 0
        questions.map(quest => {
            if(quest.selectedAnswer === quest.correct_answer){
                correctAnswers++
            }
            return correctAnswers
        });
        setTriviaAnwers(correctAnswers)
        setCheckAnswer(true)
    }

    function handleReset() {
        setCheckAnswer(false);
        setQuestions([])
        setTriviaAnwers(0)
        setReset(prevState => prevState + 1)
    }

    const questionElemets = questions.map((question) => {
        // styles block
        const validAnswer = {
            backgroundColor: '#94D7A2', color: '#293264', border: 'none', opacity: '100%'
        }
        const styles = {
        }
        const defaultStyle = {
            opacity: '50%'
        }
        
        return (
            <div key={question.id} >
                <h3 className="question-title">{decode(question.question, {level: 'html5'})}</h3>
                <ul className="question-answers">
                    {question.answers.map((answer) => {
                        return (
                            <li 
                            key={decode(answer, {level: 'html5'})} 
                            id={decode(answer, {level: 'html5'})}
                            className={ checkAnswer
                                        ? question.selectedAnswer !== '' && question.selectedAnswer === answer
                                        ? 'wrong-answer'
                                        : ''
                                        : question.selectedAnswer !== '' &&  question.selectedAnswer === answer
                                        ? 'selected-answer'
                                        : ''
                                    }    
                            onClick={() => holdAnswer(question.question, answer)}
                            style={checkAnswer 
                                ? question.selectedAnswer === question.correct_answer &&  question.selectedAnswer === answer //if answer is correct
                                ? validAnswer // correct answer selected
                                : question.selectedAnswer !== '' && question.selectedAnswer !== question.correct_answer && question.correct_answer === answer  //invalid
                                ? validAnswer
                                : question.selectedAnswer === '' && question.correct_answer === answer //if nothing is selected
                                ? validAnswer //show only valid answers -> nothing selected 
                                : defaultStyle //fallback nothing
                                : styles //fall back to checkanswer
                            }
                        >
                            {decode(answer, {level: 'html5'})}
                        </li>    
                        );
                    })}
                </ul>
            </div>
        );
    })


    return (
        <div className='question-holder'>
            {questionElemets}
            <hr /><hr />
            {
                !checkAnswer &&
                    <button className='qs-btn' onClick={checkResult}>Show Result</button> 
            }
            {
                checkAnswer && (
                    <div className="result-holder">
                        <p className='result'>
                        {triviaAnswers !== 5
                            ? `You scored ${triviaAnswers}/5 correct answers`
                            : `You scored ${triviaAnswers}/5 correct answers`
                        }
                        </p>
                        <button className='qs-btn' onClick={handleReset}>Play Again</button>
                    </div>
                )
            }
        </div>
    );
}

export default Question;