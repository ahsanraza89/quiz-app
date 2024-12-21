"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './page.css'

export default function Quiz() {

    let [questions, setQuestion] = useState([]);
    let [currentQuestion , setCurrentQuestion] = useState(0);
    let [selectedAnswer , setSelectedAnswer] = useState("");
    let [score , setScore] = useState(0);
    let [completed,setCompleted] = useState(false);

    const APIKEY = process.env.NEXT_PUBLIC_QUIZ_API_KEY;

    useEffect(() => {
        axios.get("https://quizapi.io/api/v1/questions", {
            params: {
                apiKey: APIKEY,
                limit: 5
                
            }
            
        }).then((resp) => {
            console.log(resp.data);
            setQuestion(resp.data);

        })

    }, [])

    const nextQuestion = ()=>{

        if(!selectedAnswer){
        //   alert("Please click on some qs");
          toast.warning("Please select any option")
          return 
        }

                let correctAnswer = Object.keys(questions[currentQuestion].correct_answers).find((key) => {
                    return questions[currentQuestion].correct_answers[key] === "true";
                 });
                 
                 console.log(correctAnswer);
                if(selectedAnswer+'_correct'===correctAnswer){
                //   console.log('correct');
                    setScore(score + 1)   ;                
                    }else{
                        console.log('wrong');
                    }


                    if(currentQuestion < questions.length - 1 ){
                    setCurrentQuestion(currentQuestion + 1);
                    setSelectedAnswer("");
                }else {
                    // Last question, show success message
                    toast.success("Quiz is completed!");
                    setCompleted(true);
                }
            }
    

    const previousQuestion = ()=>{

        if(currentQuestion > 0 && !completed) {
            setCurrentQuestion(currentQuestion - 1);
        }
    }

    const restartQuiz = () => {
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer("");
      setCompleted(false);
  };


    return (
    <div className="d-flex flex-column align-items-center vh-100 bg-light poppins-medium"> 
    <h2 className="mt-2">Quiz App</h2>

        {questions.length > 0 ? (

            
                <div key={currentQuestion} className="card shadow-lg p-4 m-5" style= {{width : '80%'}}>
                    <h2>{questions[currentQuestion].question}</h2>

                  { Object.entries(questions[currentQuestion].answers).map(([key, value]) => {

                            if (value) {
                                return <div key={key} className="form-check">
                                    <input className="form-check-input" type="radio" name="answer" value={key}
                                    
                                    onChange={()=>{setSelectedAnswer(key)}}
                                     />

                                    <label className="form-check-label"  > {value}</label>
                                </div>

                            }
                            // return null;

                        })
                    }
            <div className="button-container mt-4 p-2"> 
                  {!completed && currentQuestion > 0 &&
                    <button className="btn btn-secondary" onClick={previousQuestion} disabled = {currentQuestion == 0}>
                    PREVIOUS</button>}

                  { !completed && <button className="btn btn-primary" onClick={nextQuestion} disabled = {completed}>
                    NEXT</button>}
                  </div>

                { completed == true ?
                      <h3 className="text-center text-success mt-3 p-1">
                      Your Score is: {score}
                      </h3> : null
                }

  {/* questions.length is not necessary unless you want to show the total number of questions.
   If you only care about the score, just use score. */}
                </div>
            
        ) : (
            <p className="mt-4">loading</p>
        )}

{completed && (
    <div className="mt-2">
        <button className="btn btn-success" onClick={restartQuiz}>Restart Quiz</button>
    </div>
)}


    </div>)

}