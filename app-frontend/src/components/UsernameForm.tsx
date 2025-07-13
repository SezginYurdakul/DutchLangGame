export default function UsernameForm({
  username,
  setUsername,
  onContinue,
}: {
  username: string;
  setUsername: (v: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="container" style={{ marginTop: 40 }}>
      <h2>Enter your username</h2>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button
        onClick={onContinue}
        style={{ marginTop: 16 }}
        disabled={!username}
      >
        Continue
      </button>
    </div>
  );
}