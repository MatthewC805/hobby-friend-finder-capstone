import { useMemo, useState } from 'react';
import ChatPanel from '../components/ChatPanel';
import { getMatches, sendMatchMessage } from '../services/storage';

function MatchesPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const matches = useMemo(() => getMatches(), [refreshKey]);
  const [selectedMatchId, setSelectedMatchId] = useState(matches[0]?.id || '');

  const selectedMatch = matches.find((match) => match.id === selectedMatchId) || matches[0] || null;

  function handleSend(text) {
    if (!selectedMatch) return;
    sendMatchMessage(selectedMatch.id, text);
    setRefreshKey((count) => count + 1);
  }

  return (
    <main className="page-grid page-grid--messages">
      <aside className="card-panel list-panel">
        <span className="eyebrow">Matches</span>
        <h2>Conversations</h2>
        <p>Choose a match to start planning game nights, meetups, reading clubs, or anything else you share.</p>

        <div className="list-stack">
          {matches.length === 0 ? <p className="empty-copy">No matches yet. Go to Browse to find shared hobbies first.</p> : null}
          {matches.map((match) => (
            <button
              key={match.id}
              className={`list-item-button${selectedMatch?.id === match.id ? ' list-item-button--active' : ''}`}
              onClick={() => setSelectedMatchId(match.id)}
            >
              <div className="list-item-button__avatar">{match.avatar}</div>
              <div>
                <strong>{match.username}</strong>
                <p>{match.state}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="card-panel">
        {selectedMatch ? (
          <ChatPanel
            title={selectedMatch.username}
            subtitle={selectedMatch.hobbies.join(' • ')}
            messages={selectedMatch.messages}
            onSend={handleSend}
            emptyText="Send the first message to break the ice."
          />
        ) : (
          <div className="empty-state">
            <h2>No conversation selected</h2>
            <p>Once a match is created, it will appear here with a private message thread.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default MatchesPage;
