type Props = {
  current: number;
  questionCount: number;
  secondsElapsed: number;
  isDutchToEnglish: boolean;
  question: string;
  options: string[];
  correct: string;
  answers: string[];
  handleAnswer: (option: string) => void;
  score: { correct: number; wrong: number };
};

export default function QuizScreen({
  current,
  questionCount,
  secondsElapsed,
  isDutchToEnglish,
  question,
  options,
  correct,
  answers,
  handleAnswer,
  score,
}: Props) {
  return (
    <div className="container" style={{ marginTop: 40 }}>
      <span style={{ float: "right" }}>
          Time: {`${String(Math.floor(secondsElapsed / 60)).padStart(2, "0")}:${String(
            secondsElapsed % 60
          ).padStart(2, "0")}`}
        </span>
      <div id="progress-container">
        <span id="progress-text">
          Question {current + 1} / {questionCount}
        </span>
        <progress id="progress-bar" value={current + 1} max={questionCount} />
        
      </div>
      <h2 id="game-mode-text">
        {isDutchToEnglish ? "Dutch to English" : "English to Dutch"}
      </h2>
      <p id="question-text"> {question}</p>
      <div id="options-container">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={answers.length > current}
            className={
              answers[current] === opt
                ? opt === correct
                  ? "correct"
                  : "wrong"
                : ""
            }
          >
            {opt}
          </button>
        ))}
      </div>
      <div id="feedback">
        {answers[current]
          ? answers[current] === correct
            ? <span className="correct-text">Correct!</span>
            : <span className="wrong-text">Incorrect! (Correct: {correct})</span>
          : ""}
      </div>
      <div id="stats-container">
        <div>
          Correct: <span id="correct-score">{score.correct}</span>
        </div>
        <div>
          Incorrect: <span id="wrong-score">{score.wrong}</span>
        </div>
        <div>
          Total: <span id="total-score">{current + 1}</span>
        </div>
      </div>
    </div>
  );
}