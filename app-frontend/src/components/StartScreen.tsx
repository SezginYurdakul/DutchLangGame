type Props = {
  gameMode: string;
  setGameMode: (v: any) => void;
  difficulty: string;
  setDifficulty: (v: any) => void;
  questionCount: number;
  setQuestionCount: (v: number) => void;
  onStart: () => void;
  onShowHistory: () => void;
};

export default function StartScreen({
  gameMode,
  setGameMode,
  difficulty,
  setDifficulty,
  questionCount,
  setQuestionCount,
  onStart,
  onShowHistory,
}: Props) {
  const handleMode = (mode: string) => {
    setGameMode(mode);
    onStart();
  };

  return (
    <div className="container" style={{ marginTop: 40 }}>
      <h1 id="game-title">Dutch Word Game</h1>
      <h4 id="selection-text">Select the number of questions:</h4>
      <div>
        {[10, 20, 30, 50].map((n) => (
          <button
            key={n}
            className={
              "question-count-button" +
              (questionCount === n ? " selected-button" : "")
            }
            onClick={() => setQuestionCount(n)}
          >
            {n} Questions
          </button>
        ))}
      </div>
      <h4 id="selection-text">Select difficulty:</h4>
      <div>
        {["easy", "medium", "hard", "all"].map((d) => (
          <button
            key={d}
            className={
              "difficulty-button" +
              (difficulty === d ? " difficulty-selected" : "")
            }
            onClick={() => setDifficulty(d)}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>
      <div style={{ margin: "16px 0" }}>
        <button
          className={
            "mode-button-dutch" +
            (gameMode === "dutch-to-english" ? " selected-button" : "")
          }
          onClick={() => handleMode("dutch-to-english")}
        >
          Dutch to English
        </button>
        <button
          className={
            "mode-button-english" +
            (gameMode === "english-to-dutch" ? " selected-button" : "")
          }
          onClick={() => handleMode("english-to-dutch")}
        >
          English to Dutch
        </button>
      </div>
      <button id="show-history-button" style={{ marginLeft: 8 }} onClick={onShowHistory}>
        Show History
      </button>
    </div>
  );
}