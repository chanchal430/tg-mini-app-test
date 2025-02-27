
import React, { useState, useEffect } from "react";
import "./Game.css";
import { IoCloseCircleOutline } from "react-icons/io5";
import bitcoin from "../../assets/images/bitcoin.svg";
import questions from "../../data/questions.json";
import giftGif from "../../assets/images/Confetti.gif";
import { useNavigate } from "react-router-dom";

const Game = () => {

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionData, setQuestionData] = useState(questions[currentQuestionIndex]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [timer, setTimer] = useState(15);
  const [gameFinished, setGameFinished] = useState(false);
  const [gamePoints, setGamePoints] = useState(0); 

  const navigate = useNavigate();

  useEffect(() => {
    if (gameFinished) {
      setTimer(0);
      setTimeout(() => {
        navigate("/");
      }, 2000);
      return;
    }

    if (currentQuestionIndex < questions.length) {
      setQuestionData(questions[currentQuestionIndex]);
      setSelectedAnswer(null);
      setIsCorrect(false);
      setTimer(15);

      const interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime === 1) {
            clearInterval(interval);
            handleNextQuestion();
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentQuestionIndex, gameFinished]);

useEffect(() => {
  localStorage.setItem("gamePoints", gamePoints);
}, [gamePoints]);

const handleAnswerSelection = (answer) => {
  setSelectedAnswer(answer);
  setShowFeedbackModal(true);

  let earnedCoins = answer === questionData.correct_answer ? 10 : 0;
  setIsCorrect(answer === questionData.correct_answer);

  setGamePoints((prevPoints) => {
    const newPoints = prevPoints + earnedCoins;
    localStorage.setItem("gamePoints", newPoints); 
    return newPoints;
  });

  setTimeout(() => {
    setShowFeedbackModal(false);
    handleNextQuestion();
  }, 500);
};


  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setGameFinished(true);
    }
  };

  return (
    <div className="game-container">
      <span className="game-title">Folks Finance</span>
      <div className="coin-counter">
        <div className="timer-inner-coin">
          <span className="coin-count">{gamePoints}</span>
          <img src={bitcoin} alt="Coins" className="coin-icon" />
        </div>
        <div className="timer">
          <div className="timer-circle">{timer}</div>
        </div>
        <IoCloseCircleOutline size={30} onClick={() => navigate("/")} />
      </div>

      {gameFinished ? (
        <div className="game-finished-container">
          {gamePoints === 0 ? (
            <h2 className="oops-text">😞 Oops! Better Luck Next Time!</h2>
          ) : (
            <>
              <h2 className="congratulations-text">
                🎉 Congratulations! You got <span className="highlighted">{gamePoints}</span> coins! 🎉
              </h2>
              <img src={giftGif} alt="gift" />
            </>
          )}
        </div>
      ) : (
        <>
          <div className="image-container">
            <img
              src={require(`../../assets/images/${questionData.images[0]}`)}
              alt="First Hint"
              className="game-image"
            />
            <span className="plus-sign">+</span>
            <img
              src={require(`../../assets/images/${questionData.images[1]}`)}
              alt="Second Hint"
              className="game-image"
            />
          </div>

          <div className="hint-section">
            <p className="question-text">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <span className="hint-text" onClick={() => setShowHintModal(true)}>
              💡 Hint
            </span>
          </div>

          <h2 className="guess-text">{questionData.question}</h2>

          <div className="options">
            {questionData.options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${selectedAnswer === option ? (isCorrect ? "correct" : "wrong") : ""}`}
                onClick={() => handleAnswerSelection(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            ))}
          </div>
          <button className="skip-btn" onClick={handleNextQuestion}>
            Skip
          </button>

          {showHintModal && (
            <div className="modal-background" onClick={() => setShowHintModal(false)}>
              <div className="modal-content">
                <span className="close-btn" onClick={() => setShowHintModal(false)}>
                  ✖
                </span>
                <h3>💡 Hint</h3>
                <p>{questionData.hint}</p>
              </div>
            </div>
          )}

          {showFeedbackModal && (
            <div className="modal-background" onClick={() => setShowFeedbackModal(false)}>
              <div className="modal-content">
                <h3>{isCorrect ? "✅ Correct!" : "❌ Incorrect!"}</h3>
                <p>{isCorrect ? "Moving to the next question..." : "Try again."}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Game;


//  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [questionData, setQuestionData] = useState(questions[currentQuestionIndex]);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(false);
//   const [showHintModal, setShowHintModal] = useState(false);
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [timer, setTimer] = useState(15);
//   const [gameFinished, setGameFinished] = useState(false);
//   const [gamePoints, setGamePoints] = useState(0);
  
//   const [playedQuestions, setPlayedQuestions] = useState(
//     JSON.parse(localStorage.getItem("playedQuestions")) || []
//   );

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (gameFinished) {
//       setTimer(0);
//       setTimeout(() => {
//         localStorage.removeItem("playedQuestions"); 
//         navigate("/");
//       }, 2000);
//       return;
//     }

//     if (currentQuestionIndex < questions.length) {
//       setQuestionData(questions[currentQuestionIndex]);
//       setSelectedAnswer(null);
//       setIsCorrect(false);
//       setTimer(15);

//       const interval = setInterval(() => {
//         setTimer((prevTime) => {
//           if (prevTime === 1) {
//             clearInterval(interval);
//             handleNextQuestion(); // Auto move to next question when timer expires
//           }
//           return prevTime - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [currentQuestionIndex, gameFinished]);

//   const handleAnswerSelection = (answer) => {
//     setSelectedAnswer(answer);
//     setShowFeedbackModal(true);

//     let earnedCoins = answer === questionData.correct_answer ? 10 : 0;
//     setIsCorrect(answer === questionData.correct_answer);
//     setGamePoints((prevPoints) => prevPoints + earnedCoins);

//     // Save played question by ID
//     const updatedPlayedQuestions = [...playedQuestions, questionData.id];
//     setPlayedQuestions(updatedPlayedQuestions);
//     localStorage.setItem("playedQuestions", JSON.stringify(updatedPlayedQuestions));

//     setTimeout(() => {
//       setShowFeedbackModal(false);
//       handleNextQuestion(); // Move to the next question after answer selection
//     }, 500);
//   };

//   const handleNextQuestion = () => {
//     let nextIndex = findNextUnplayedQuestion();
//     if (nextIndex === -1) {
//       setGameFinished(true);
//     } else {
//       setCurrentQuestionIndex(nextIndex);
//       setTimer(15); // Reset timer when moving to the next question
//     }
//   };

//   const findNextUnplayedQuestion = () => {
//     for (let i = 0; i < questions.length; i++) {
//       if (!playedQuestions.includes(questions[i].id)) {
//         return i;
//       }
//     }
//     return -1; // No more questions left
//   };

// import React, { useState, useEffect } from "react";
// import "./Game.css";
// import { IoCloseCircleOutline } from "react-icons/io5";
// import bitcoin from "../../assets/images/bitcoin.svg";
// import questions from "../../data/questions.json";
// import giftGif from "../../assets/images/Confetti.gif";
// import { useNavigate } from "react-router-dom";

// const Game = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [questionData, setQuestionData] = useState(questions[currentQuestionIndex]);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(false);
//   const [showHintModal, setShowHintModal] = useState(false);
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [timer, setTimer] = useState(15);
//   const [gameFinished, setGameFinished] = useState(false);
//   const [gamePoints, setGamePoints] = useState(() => {
//     return parseInt(localStorage.getItem("gamePoints")) || 0;
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (gameFinished) {
//       setTimer(0);
//       setTimeout(() => {
//         navigate("/");
//       }, 2000);
//       return;
//     }

//     if (currentQuestionIndex < questions.length) {
//       setQuestionData(questions[currentQuestionIndex]);
//       setSelectedAnswer(null);
//       setIsCorrect(false);
//       setTimer(15);

//       const interval = setInterval(() => {
//         setTimer((prevTime) => {
//           if (prevTime === 1) {
//             clearInterval(interval);
//             handleNextQuestion();
//           }
//           return prevTime - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [currentQuestionIndex, gameFinished]);

//   const handleAnswerSelection = (answer) => {
//     setSelectedAnswer(answer);
//     setShowFeedbackModal(true);

//     let earnedCoins = answer === questionData.correct_answer ? 10 : 0;
//     setIsCorrect(answer === questionData.correct_answer);

//     // Update local storage instead of calling API
//     const updatedGamePoints = gamePoints + earnedCoins;
//     setGamePoints(updatedGamePoints);
//     localStorage.setItem("gamePoints", updatedGamePoints);

//     setTimeout(() => {
//       setShowFeedbackModal(false);
//       handleNextQuestion();
//     }, 500);
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       setGameFinished(true);
//     }
//   };

//   return (
//     <div className="game-container">
//       <span className="game-title">Folks Finance</span>
//       <div className="coin-counter">
//         <div className="timer-inner-coin">
//           <span className="coin-count">{gamePoints}</span>
//           <img src={bitcoin} alt="Coins" className="coin-icon" />
//         </div>
//         <div className="timer">
//           <div className="timer-circle">{timer}</div>
//         </div>
//         <IoCloseCircleOutline size={30} onClick={() => navigate("/")} />
//       </div>

//       {gameFinished ? (
//         <div className="game-finished-container">
//           {gamePoints === 0 ? (
//             <h2 className="oops-text">😞 Oops! Better Luck Next Time!</h2>
//           ) : (
//             <>
//               <h2 className="congratulations-text">
//                 🎉 Congratulations! You got <span className="highlighted">{gamePoints}</span> coins! 🎉
//               </h2>
//               <img src={giftGif} alt="gift" />
//             </>
//           )}
//         </div>
//       ) : (
//         <>
//           <div className="image-container">
//             <img
//               src={require(`../../assets/images/${questionData.images[0]}`)}
//               alt="First Hint"
//               className="game-image"
//             />
//             <span className="plus-sign">+</span>
//             <img
//               src={require(`../../assets/images/${questionData.images[1]}`)}
//               alt="Second Hint"
//               className="game-image"
//             />
//           </div>

//           <div className="hint-section">
//             <p className="question-text">
//               Question {currentQuestionIndex + 1} of {questions.length}
//             </p>
//             <span className="hint-text" onClick={() => setShowHintModal(true)}>
//               💡 Hint
//             </span>
//           </div>

//           <h2 className="guess-text">{questionData.question}</h2>

//           <div className="options">
//             {questionData.options.map((option, index) => (
//               <button
//                 key={index}
//                 className={`option-btn ${selectedAnswer === option ? (isCorrect ? "correct" : "wrong") : ""}`}
//                 onClick={() => handleAnswerSelection(option)}
//                 disabled={selectedAnswer !== null}
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//           <button className="skip-btn" onClick={handleNextQuestion}>
//             Skip
//           </button>

//           {showHintModal && (
//             <div className="modal-background" onClick={() => setShowHintModal(false)}>
//               <div className="modal-content">
//                 <span className="close-btn" onClick={() => setShowHintModal(false)}>
//                   ✖
//                 </span>
//                 <h3>💡 Hint</h3>
//                 <p>{questionData.hint}</p>
//               </div>
//             </div>
//           )}

//           {showFeedbackModal && (
//             <div className="modal-background" onClick={() => setShowFeedbackModal(false)}>
//               <div className="modal-content">
//                 <h3>{isCorrect ? "✅ Correct!" : "❌ Incorrect!"}</h3>
//                 <p>{isCorrect ? "Moving to the next question..." : "Try again."}</p>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Game;




// import React, { useState, useEffect } from "react";
// import "./Game.css";
// import { IoCloseCircleOutline } from "react-icons/io5";
// import bitcoin from "../../assets/images/bitcoin.svg";
// import questions from "../../data/questions.json";
// // import { useCoins } from "../../context/CoinContext";
// import giftGif from "../../assets/images/Confetti.gif";
// import { useNavigate } from "react-router-dom";

// const Game = () => {
//   const apiIp=process.env.REACT_APP_API_URL
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [questionData, setQuestionData] = useState(questions[currentQuestionIndex]);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [isCorrect, setIsCorrect] = useState(false);
//   const [showHintModal, setShowHintModal] = useState(false);
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [timer, setTimer] = useState(15);
//   const [gameFinished, setGameFinished] = useState(false);
//   const [gamePoints, setGamePoints] = useState(0);

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (gameFinished) {
//       setTimer(0);
//       setTimeout(() => {
//         navigate('/');
//       }, 2000);
//       return;
//     }

//     if (currentQuestionIndex < questions.length) {
//       setQuestionData(questions[currentQuestionIndex]);
//       setSelectedAnswer(null);
//       setIsCorrect(false);
//       setTimer(15);

//       const interval = setInterval(() => {
//         setTimer((prevTime) => {
//           if (prevTime === 1) {
//             clearInterval(interval);
//             handleNextQuestion();
//           }
//           return prevTime - 1;
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [currentQuestionIndex, gameFinished]);

//   const handleAnswerSelection = async (answer) => {
//     setSelectedAnswer(answer);
//     setShowFeedbackModal(true);
  
//     let earnedCoins = answer === questionData.correct_answer ? 10 : 0;
//     setIsCorrect(answer === questionData.correct_answer);
  
//     const walletAddress = localStorage.getItem("walletAddress");
//     try {
//       const response = await fetch(`${apiIp}/api/saveGamePoints`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "wallet-address": walletAddress,
//         },
//         body: JSON.stringify({ gameCoins: earnedCoins }),
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to save game points");
//       }
  
//       const data = await response.json();
//       console.log("Game points saved:", data);
  
//       setGamePoints((prevPoints) => prevPoints + earnedCoins);
//     } catch (error) {
//       console.error("Error saving game points:", error);
//     }
  
//     setTimeout(() => {
//       setShowFeedbackModal(false);
//       handleNextQuestion();
//     }, 500);
//   };
  

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       setGameFinished(true);
//     }
//   };

//   return (
//     <div className="game-container">
//       <span className="game-title">Folks Finance</span>
//       <div className="coin-counter">
//         <div className="timer-inner-coin">
//           <span className="coin-count">{gamePoints}</span>
//           <img src={bitcoin} alt="Coins" className="coin-icon" />
//         </div>
//         <div className="timer">
//           <div className="timer-circle">{timer}</div>
//         </div>
//         <IoCloseCircleOutline size={30} onClick={() => navigate('/')} />
//       </div>

//       {gameFinished ? (
//         <div className="game-finished-container">
//           {gamePoints === 0 ? (
//             <h2 className="oops-text">😞 Oops! Better Luck Next Time!</h2>
//           ) : (
//             <>
//               <h2 className="congratulations-text">
//                 🎉 Congratulations! You got <span className="highlighted">{gamePoints}</span> coins! 🎉
//               </h2>
//               <img src={giftGif} alt="gift" />
//             </>
//           )}
//         </div>
//       ) : (
//         <>
//           <div className="image-container">
//             <img
//               src={require(`../../assets/images/${questionData.images[0]}`)}
//               alt="First Hint"
//               className="game-image"
//             />
//             <span className="plus-sign">+</span>
//             <img
//               src={require(`../../assets/images/${questionData.images[1]}`)}
//               alt="Second Hint"
//               className="game-image"
//             />
//           </div>

//           <div className="hint-section">
//             <p className="question-text">
//               Question {currentQuestionIndex + 1} of {questions.length}
//             </p>
//             <span className="hint-text" onClick={() => setShowHintModal(true)}>
//               💡 Hint
//             </span>
//           </div>

//           <h2 className="guess-text">{questionData.question}</h2>

//           <div className="options">
//             {questionData.options.map((option, index) => (
//               <button
//                 key={index}
//                 className={`option-btn ${selectedAnswer === option ? (isCorrect ? "correct" : "wrong") : ""}`}
//                 onClick={() => handleAnswerSelection(option)}
//                 disabled={selectedAnswer !== null}
//               >
//                 {option}
//               </button>
//             ))}
//           </div>
//           <button className="skip-btn" onClick={handleNextQuestion}>
//             Skip
//           </button>

//           {showHintModal && (
//             <div className="modal-background" onClick={() => setShowHintModal(false)}>
//               <div className="modal-content">
//                 <span className="close-btn" onClick={() => setShowHintModal(false)}>
//                   ✖
//                 </span>
//                 <h3>💡 Hint</h3>
//                 <p>{questionData.hint}</p>
//               </div>
//             </div>
//           )}

//           {showFeedbackModal && (
//             <div className="modal-background" onClick={() => setShowFeedbackModal(false)}>
//               <div className="modal-content">
//                 <h3>{isCorrect ? "✅ Correct!" : "❌ Incorrect!"}</h3>
//                 <p>{isCorrect ? "Moving to the next question..." : "Try again."}</p>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Game;


// import React, { useState, useEffect } from "react";
// import "./Game.css";
// import { IoCloseCircleOutline } from "react-icons/io5";
// import bitcoin from "../../assets/images/bitcoin.svg";
// import questions from "../../data/questions.json";

// const Game = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [questionData, setQuestionData] = useState(null);

//   useEffect(() => {
//     setQuestionData(questions[currentQuestionIndex]);
//   }, [currentQuestionIndex]);

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   if (!questionData) return <p>Loading...</p>;

//   return (
//     <div className="game-container">

//       <span className="game-title">Folks Finance</span>
//       <div className="coin-counter">
//         <IoCloseCircleOutline size={30} />
//         <div className="timer">
//           <div className="timer-circle">05</div>
//         </div>
//         <div className="timer-inner-coin">
//           <span className="coin-count">602</span>
//           <img src={bitcoin} alt="Coins" className="coin-icon" />
//         </div>
//       </div>

//       <div className="image-container">
//       <img src={require(`../../assets/images/${questionData.images[0]}`)} alt="First Hint" className="game-image" />

//         <span className="plus-sign">+</span>
//         <img src={require(`../../assets/images/${questionData.images[1]}`)} alt="Second Hint" className="game-image" />

//       </div>

//       <div className="hint-section">
//         <p className="question-text">Question {currentQuestionIndex + 1} of {questions.length}</p>
//         <span className="hint-text">💡 Hint
//              {/* {questionData.hint} */}
//              </span>
//       </div>

//       <h2 className="guess-text">{questionData.question}</h2>

//       <div className="options">
//         {questionData.options.map((option, index) => (
//           <button key={index} className="option-btn">
//             {option}
//           </button>
//         ))}
//       </div>

//       <button className="skip-btn" onClick={handleNextQuestion}>Skip</button>
//     </div>
//   );
// };

// export default Game;

// import React from "react";
// import "./Game.css";
// import gameImage from "../../assets/images/image 8.png";
// import bitcoin from '../../assets/images/bitcoin.svg'
// import { IoCloseCircleOutline } from "react-icons/io5";
// import tempelImage from '../../assets/images/temple.svg'
// import runImage from '../../assets/images/run.svg'

// const Game = () => {
//   return (
//     <div className="game-container">
//       <span className="game-title">Folks Finance</span>

//         <div className="coin-counter">
//         <IoCloseCircleOutline size={30} />
//           <div className="timer">
//             <div className="timer-circle">05</div>
//           </div>
//           <div className="timer-inner-coin">
//           <span className="coin-count">602</span>
//           <img src={bitcoin} alt="Coins" className="coin-icon" />
//           </div>

//       </div>

//       <div className="image-container">
//        <img src={tempelImage} alt="Temple" className="game-image" />
//         <span className="plus-sign">+</span>
//         <img src={runImage} alt="Runner" className="game-image" />
//       {/* <img src={gameImage} className="game-image12" /> */}
//       </div>

//       <div className="hint-section">
//       <p className="question-text">Question 12 of 20</p>
//         <span className="hint-text">💡 Hint</span>
//       </div>

//       <h2 className="guess-text">Guess The Game?</h2>

//       <div className="options">
//         <button className="option-btn">Subway Surfer</button>
//         <button className="option-btn">Temple Run</button>
//         <button className="option-btn">Happy Run</button>
//       </div>

//       <button className="skip-btn">Skip</button>
//       {/* <Footer /> */}
//     </div>
//   );
// };

// export default Game;
