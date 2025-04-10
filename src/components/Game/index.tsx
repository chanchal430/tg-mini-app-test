/** 3P Dependecies */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";

/** Assets */
import bitcoin from "../../assets/images/bitcoin.svg";
import questions from "../../data/questions.json";
import giftGif from "../../assets/images/Confetti.gif";

/** Styles */
import styles from "./styles.module.css";

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
  localStorage.setItem("gamePoints", gamePoints.toString());
}, [gamePoints]);

const handleAnswerSelection = (answer) => {
  setSelectedAnswer(answer);
  setShowFeedbackModal(true);

  let earnedCoins = answer === questionData.correct_answer ? 10 : 0;
  setIsCorrect(answer === questionData.correct_answer);

  setGamePoints((prevPoints) => {
    const newPoints = prevPoints + earnedCoins;
    localStorage.setItem("gamePoints", newPoints.toString()); 
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
    <div className={styles["game-container"]}>
      <span className={styles["game-title"]}>Folks Finance</span>
      <div className={styles["coin-counter"]}>
        <div className={styles["timer-inner-coin"]}>
          <span className={styles["coin-count"]}>{gamePoints}</span>
          <img src={bitcoin} alt="Coins" className={styles["coin-icon"]} />
        </div>
        <div className={styles["timer"]}>
          <div className={styles["timer-circle"]}>{timer}</div>
        </div>
        {/* <IoCloseCircleOutline size={30} onClick={() => navigate("/")} /> */}
      </div>

      {gameFinished ? (
        <div className={styles["game-finished-container"]}>
          {gamePoints === 0 ? (
            <h2 className={styles["oops-text"]}>😞 Oops! Better Luck Next Time!</h2>
          ) : (
            <>
              <h2 className={styles["congratulations-text"]}>
                🎉 Congratulations! You got <span className={styles["highlighted"]}>{gamePoints}</span> coins! 🎉
              </h2>
              <img src={giftGif} alt="gift" />
            </>
          )}
        </div>
      ) : (
        <>
          <div className={styles["image-container"]}>
            <img
              src={require(`../../assets/images/${questionData.images[0]}`)}
              alt="First Hint"
              className="game-image"
            />
            <span className={styles["plus-sign"]}>+</span>
            <img
              src={require(`../../assets/images/${questionData.images[1]}`)}
              alt="Second Hint"
              className="game-image"
            />
          </div>

          <div className={styles["hint-section"]}>
            <p className={styles["question-text"]}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <span className={styles["hint-text"]} onClick={() => setShowHintModal(true)}>
              💡 Hint
            </span>
          </div>

          <h2 className={styles["guess-text"]}>{questionData.question}</h2>

          <div className={styles["options"]}>
            {questionData.options.map((option, index) => (
              <button
                key={index}
                className={`${styles['option-btn']} ${selectedAnswer === option ? (isCorrect ? "correct" : "wrong") : ""}`}
                onClick={() => handleAnswerSelection(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            ))}
          </div>
          <button className={styles["skip-btn"]} onClick={handleNextQuestion}>
            Skip
          </button>

          {showHintModal && (
            <div className={styles["modal-background"]} onClick={() => setShowHintModal(false)}>
              <div className={styles["modal-content"]}>
                <span className={styles["close-btn"]} onClick={() => setShowHintModal(false)}>
                  ✖
                </span>
                <h3>💡 Hint</h3>
                <p>{questionData.hint}</p>
              </div>
            </div>
          )}

          {showFeedbackModal && (
            <div className={styles["modal-background"]} onClick={() => setShowFeedbackModal(false)}>
              <div className={styles["modal-content"]}>
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


