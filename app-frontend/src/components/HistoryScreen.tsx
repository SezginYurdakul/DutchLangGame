type Props = {
  username: string;
  onBack: () => void;
};

export default function HistoryScreen({ username, onBack }: Props) {
  const history = JSON.parse(localStorage.getItem("woordquiz_history") || "{}");
  const userHistory = history[username] || [];
  return (
    <div className="history-container" style={{ marginTop: 40 }}>
      <h2>History</h2>
      {userHistory.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Mode</th>
              <th>Difficulty</th>
              <th>Questions</th>
              <th>Correct</th>
              <th>Wrong</th>
              <th>Accuracy</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {userHistory.map((entry: any, i: number) => (
              <tr key={i}>
                <td>{entry.date}</td>
                <td>{entry.mode}</td>
                <td>{entry.difficulty}</td>
                <td>{entry.questionCount}</td>
                <td>{entry.correct}</td>
                <td>{entry.wrong}</td>
                <td>{entry.accuracy}%</td>
                <td>{entry.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button id="back-to-home-button" style={{ marginTop: 16 }} onClick={onBack}>
        Back to Home
      </button>
    </div>
  );
}