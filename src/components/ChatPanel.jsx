import { useState } from 'react';

function ChatPanel({ title, subtitle, messages, onSend, emptyText = 'No messages yet.' }) {
  const [draft, setDraft] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft('');
  }

  return (
    <section className="chat-panel">
      <div className="chat-panel__header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>

      <div className="chat-panel__messages">
        {messages.length === 0 ? <p className="empty-copy">{emptyText}</p> : null}
        {messages.map((message) => (
          <div key={message.id} className={`message-bubble${message.sender === 'System' ? ' message-bubble--system' : ''}`}>
            <strong>{message.sender}</strong>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <form className="chat-panel__composer" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button className="primary-button" type="submit">Send</button>
      </form>
    </section>
  );
}

export default ChatPanel;
