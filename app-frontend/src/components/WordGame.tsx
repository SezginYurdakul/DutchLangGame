import { useState, useMemo, useEffect } from "react";
import { wordList } from "../wordList";
import UsernameForm from "./UsernameForm";
import StartScreen from "./StartScreen";
import QuizScreen from "./QuizScreen";
import ResultScreen from "./ResultScreen";
import HistoryScreen from "./HistoryScreen";
import "../styles.css";

type GameMode = "dutch-to-english" | "english-to-dutch";
type Difficulty = "easy" | "medium" | "hard" | "all";

// Shuffle helper
function shuffle<T>(array: T[]): T[] {
  return array
    .map((a) => [Math.random(), a] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

// Get distractor options
function getDistractors(
  correct: string,
  allOptions: string[],
  count: number
): string[] {
  const filtered = allOptions.filter((opt) => opt !== correct);
  return shuffle(filtered).slice(0, count);
}

// Speak text in a given language, with slower rate for Dutch
function speak(text: string, lang: string) {
  if (!window.speechSynthesis) return;
  const utter = new window.SpeechSynthesisUtterance(text);
  utter.lang = lang;
  // Set a slower rate for Dutch to avoid skipping syllables
  if (lang === "nl-NL") {
    utter.rate = 0.9; // You can try 0.7 or 0.9 if needed
  } else {
    utter.rate = 1;
  }
  // Try to select a Dutch voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const match = voices.find(v => v.lang === lang);
    if (match) utter.voice = match;
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export default function WordGame() {
  const [screen, setScreen] = useState<"username" | "start" | "quiz" | "result" | "history">(
    localStorage.getItem("woordquiz_username") ? "start" : "username"
  );
  const [username, setUsername] = useState(localStorage.getItem("woordquiz_username") || "");
  const [gameMode, setGameMode] = useState<GameMode>("dutch-to-english");
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [questionCount, setQuestionCount] = useState(10);

  // Quiz state
  const filteredList = useMemo(
    () => wordList.filter((w) => difficulty === "all" || w.difficulty === difficulty),
    [difficulty]
  );
  const quizList = useMemo(
    () => shuffle(filteredList).slice(0, questionCount),
    [filteredList, questionCount]
  );
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  useEffect(() => {
    let timer: number | undefined;
    if (screen === "quiz" && !showResult) {
      timer = window.setInterval(() => setSecondsElapsed((s) => s + 1), 1000);
    }
    return () => {
      if (timer !== undefined) {
        clearInterval(timer);
      }
    };
  }, [screen, showResult]);

  // Reset state when switching between screens
  useEffect(() => {
    if (screen === "quiz") {
      setCurrent(0);
      setScore({ correct: 0, wrong: 0 });
      setAnswers([]);
      setShowResult(false);
      setSecondsElapsed(0);
    }
  }, [screen, quizList]);

  // Question and options
  const word = quizList[current];
  const isDutchToEnglish = gameMode === "dutch-to-english";
  const question = word ? (isDutchToEnglish ? word.dutch : word.english) : "";
  const correct = word ? (isDutchToEnglish ? word.english : word.dutch) : "";
  const allOptions = isDutchToEnglish
    ? wordList.map((w) => w.english)
    : wordList.map((w) => w.dutch);
  const options = useMemo(
    () =>
      word
        ? shuffle([correct, ...getDistractors(correct, allOptions, 3)])
        : [],
    [current, gameMode, difficulty, word]
  );

  // Speak the question when it changes
  useEffect(() => {
    if (!word || screen !== "quiz") return;
    if (isDutchToEnglish) {
      speak(question, "nl-NL");
    } else {
      speak(question, "en-US");
    }
    // eslint-disable-next-line
  }, [question, isDutchToEnglish, screen]);

  // Answer check and speak the answer
  function handleAnswer(option: string) {
    if (!word) return;
    // Speak the selected answer in the answer's language
    if (isDutchToEnglish) {
      speak(option, "en-US");
    } else {
      speak(option, "nl-NL");
    }
    const isCorrect = option === correct;
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1),
    }));
    setAnswers((a) => [...a, option]);
    setTimeout(() => {
      if (current + 1 >= quizList.length) setShowResult(true);
      else setCurrent((c) => c + 1);
    }, 1000);
  }

  // Result screen: Automatically opens and saves history when the game ends
  useEffect(() => {
    if (showResult && screen === "quiz") {
      // Save game history
      const history = JSON.parse(localStorage.getItem("woordquiz_history") || "{}");
      const userHistory = history[username] || [];
      userHistory.push({
        date: new Date().toLocaleString(),
        mode: gameMode,
        difficulty,
        questionCount,
        correct: score.correct,
        wrong: score.wrong,
        accuracy: ((score.correct / questionCount) * 100).toFixed(2),
        time: `${String(Math.floor(secondsElapsed / 60)).padStart(2, "0")}:${String(
          secondsElapsed % 60
        ).padStart(2, "0")}`,
      });
      history[username] = userHistory;
      localStorage.setItem("woordquiz_history", JSON.stringify(history));
      setScreen("result");
    }
  }, [showResult]);

  // Screens
  if (screen === "username") {
    return (
      <UsernameForm
        username={username}
        setUsername={setUsername}
        onContinue={() => {
          localStorage.setItem("woordquiz_username", username);
          setScreen("start");
        }}
      />
    );
  }

  if (screen === "start") {
    return (
      <StartScreen
        gameMode={gameMode}
        setGameMode={setGameMode}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        onStart={() => setScreen("quiz")}
        onShowHistory={() => setScreen("history")}
      />
    );
  }

  if (screen === "history") {
    return <HistoryScreen username={username} onBack={() => setScreen("start")} />;
  }

  if (screen === "result") {
    return (
      <ResultScreen
        score={score}
        questionCount={questionCount}
        secondsElapsed={secondsElapsed}
        onHome={() => setScreen("start")}
      />
    );
  }

  // Quiz screen
  if (!word) return <div>Loading...</div>;

  return (
    <QuizScreen
      current={current}
      questionCount={questionCount}
      secondsElapsed={secondsElapsed}
      isDutchToEnglish={isDutchToEnglish}
      question={question}
      options={options}
      correct={correct}
      answers={answers}
      handleAnswer={handleAnswer}
      score={score}
    />
  );
}