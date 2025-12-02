'use client';
import { useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

import styles from './page.module.css';

type Question = {
  key: string;
  art: string;
  plural: string;
  trans: string;
};
type DataList = {
  items: Question[];
};

const shuffle = (array: Question[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // random index 0..i
    [array[i], array[j]] = [array[j], array[i]]; // swap
  }
  return array;
};

export default function Home() {
  const [started, setStarted] = useState<boolean>(false);
  const [end, setEnded] = useState<boolean>(false);
  const [chosenAnswer, setChosenAnswer] = useState<number | null>(null);
  const [currentKey, setCurrentKey] = useState<number>(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const startGame = () => {
    fetch('/de.json')
      .then((response) => response.json())
      .then((data: DataList) => setQuestions(shuffle(data.items)))
      .catch((error) => console.error('Error fetching data:', error));
    setStarted(true);
    setEnded(false);
    setAnswers([]);
    setCurrentKey(0);
  };
  const startAgain = () => {
    fetch('/de.json')
      .then((response) => response.json())
      .then((data: DataList) => setQuestions(shuffle(data.items)))
      .catch((error) => console.error('Error fetching data:', error));
    setStarted(true);
    setEnded(false);
    setAnswers([]);
    setCurrentKey(0);
  };
  const handleAnswer = (value: number, correct: boolean) => {
    if (chosenAnswer !== null) {
      return; // prevent multiple clicks
    }
    nextQuestion(value, correct);
  };
  const nextQuestion = (answer: number, correct: boolean) => {
    setChosenAnswer(answer);
    setAnswers((prevItems) => [...prevItems, correct]);
    setTimeout(() => {
      setChosenAnswer(null);
      if (questions.length > currentKey + 1) {
        setCurrentKey(currentKey + 1);
        return;
      }
      setEnded(true);
    }, 800);
  };

  const buttonFunc = (
    chosenAnswer: number | null,
    correctArt: string,
    art: string,
    value: number
  ) =>
    chosenAnswer === null || chosenAnswer !== value ? (
      art
    ) : chosenAnswer === value && correctArt === art ? (
      <FiCheck />
    ) : (
      <FiX />
    );

  // console.log(questions);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {started && end && (
          <>
            <div className={styles.starttitle}>The End</div>
            <div className={styles.progress}>
              {answers.map((i: boolean, index: number) => (
                <span
                  key={index}
                  className={i ? styles.correct : styles.incorrect}
                ></span>
              ))}
            </div>
            <div className={styles.start} onClick={() => startAgain()}>
              Start Again
            </div>
          </>
        )}
        {/* <span>started: {started ? 'true' : 'false'}</span>
        <span>ended: {end ? 'true' : 'false'}</span>
        <span>q: {questions.length}</span>
        <span>key: {currentKey}</span> */}
        {!started && !end && (
          <>
            <div className={styles.starttitle}>Start a Game ?</div>
            <div className={styles.start} onClick={() => startGame()}>
              Start
            </div>
          </>
        )}
        {started && !end && questions.length < 1 && (
          <>
            <div>No Questions</div>
          </>
        )}
        {started && !end && questions.length > 0 && (
          <div>
            <div className={styles.progress}>
              {answers.map((i: boolean, index: number) => (
                <span
                  key={index}
                  className={i ? styles.correct : styles.incorrect}
                ></span>
              ))}
            </div>
            <div className={styles.question}>
              {questions[currentKey].key}
              <span>{questions[currentKey].trans}</span>
            </div>
            <div className={styles.buttons}>
              <span
                className={styles.fam}
                onClick={() =>
                  handleAnswer(1, questions[currentKey].art === 'die')
                }
              >
                {buttonFunc(chosenAnswer, questions[currentKey].art, 'die', 1)}
              </span>
              <span
                className={styles.uomo}
                onClick={() =>
                  handleAnswer(-1, questions[currentKey].art === 'der')
                }
              >
                {buttonFunc(chosenAnswer, questions[currentKey].art, 'der', -1)}
              </span>
              <span
                className={styles.neut}
                onClick={() =>
                  handleAnswer(0, questions[currentKey].art === 'das')
                }
              >
                {buttonFunc(chosenAnswer, questions[currentKey].art, 'das', 0)}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
