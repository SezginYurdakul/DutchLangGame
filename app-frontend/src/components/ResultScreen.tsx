type Props = {
  score: { correct: number; wrong: number };
  questionCount: number;
  secondsElapsed: number;
  onHome: () => void;
};

export default function ResultScreen({
  score,
  questionCount,
  secondsElapsed,
  onHome,
}: Props) {
  return (
    <div className="container" style={{ marginTop: 40 }}>
      <h2>Quiz Completed!</h2>
      <p>
        Correct: <b>{score.correct}</b> / {questionCount}
      </p>
      <p>
        Accuracy: <b>{((score.correct / questionCount) * 100).toFixed(2)}%</b>
      </p>
      <p>
        Time: <b>{`${String(Math.floor(secondsElapsed / 60)).padStart(2, "0")}:${String(
          secondsElapsed % 60
        ).padStart(2, "0")}`}</b>
      </p>
      <button onClick={onHome}>Home Page</button>
    </div>
  );
}