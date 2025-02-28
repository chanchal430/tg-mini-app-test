
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


