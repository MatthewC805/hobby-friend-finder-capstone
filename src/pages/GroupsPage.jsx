import { useMemo, useState } from 'react';
import ChatPanel from '../components/ChatPanel';
import { createGroup, getGroups, getMatches, sendGroupMessage } from '../services/storage';

function GroupsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const matches = useMemo(() => getMatches(), [refreshKey]);
  const groups = useMemo(() => getGroups(), [refreshKey]);
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) || groups[0] || null;

  function toggleMember(username) {
    setSelectedMembers((oldMembers) =>
      oldMembers.includes(username)
        ? oldMembers.filter((member) => member !== username)
        : [...oldMembers, username]
    );
  }

  function handleCreateGroup(event) {
    event.preventDefault();

    if (!groupName.trim() || selectedMembers.length === 0) {
      setErrorMessage('Add a group name and choose at least one match.');
      return;
    }

    createGroup(groupName, selectedMembers);
    setGroupName('');
    setSelectedMembers([]);
    setErrorMessage('');
    setRefreshKey((count) => count + 1);
  }

  function handleSend(text) {
    if (!selectedGroup) return;
    sendGroupMessage(selectedGroup.id, text);
    setRefreshKey((count) => count + 1);
  }

  return (
    <main className="page-grid page-grid--messages">
      <aside className="card-panel list-panel">
        <span className="eyebrow">Groups</span>
        <h2>Create a hobby group</h2>
        <form className="form-stack" onSubmit={handleCreateGroup}>
          <label>
            Group Name
            <input value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="Weekend Board Game Crew" />
          </label>

          <fieldset className="checkbox-panel">
            <legend>Choose matches</legend>
            {matches.length === 0 ? <p className="empty-copy">Create some matches first.</p> : null}
            {matches.map((match) => (
              <label key={match.id} className="checkbox-row">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(match.username)}
                  onChange={() => toggleMember(match.username)}
                />
                <span>{match.username}</span>
              </label>
            ))}
          </fieldset>

          {errorMessage ? <p className="status-line">{errorMessage}</p> : null}
          <button className="primary-button" type="submit">Create Group</button>
        </form>

        <div className="list-stack list-stack--top-gap">
          {groups.map((group) => (
            <button
              key={group.id}
              className={`list-item-button${selectedGroup?.id === group.id ? ' list-item-button--active' : ''}`}
              onClick={() => setSelectedGroupId(group.id)}
            >
              <div className="list-item-button__avatar">{group.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <strong>{group.name}</strong>
                <p>{group.members.length} members</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section className="card-panel">
        {selectedGroup ? (
          <ChatPanel
            title={selectedGroup.name}
            subtitle={selectedGroup.members.join(', ')}
            messages={selectedGroup.messages}
            onSend={handleSend}
            emptyText="Group messages will show up here."
          />
        ) : (
          <div className="empty-state">
            <h2>No groups yet</h2>
            <p>Pick at least one match and create a group to start a shared hobby chat.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default GroupsPage;
