import { useMemo, useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../context/AuthContext';
import { getBrowseProfiles, likeProfile, recordDecision } from '../services/storage';

function BrowsePage() {
  const { currentUser } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const profiles = useMemo(() => getBrowseProfiles(), [refreshKey]);
  const activeProfile = profiles[0] || null;

  function moveForward() {
    setRefreshKey((count) => count + 1);
  }

  function handlePass() {
    if (!activeProfile) return;
    recordDecision(activeProfile.id, 'pass');
    setStatusMessage(`Skipped ${activeProfile.username}.`);
    moveForward();
  }

  function handleInterested() {
    if (!activeProfile) return;
    const result = likeProfile(activeProfile);
    setStatusMessage(result.message);
    moveForward();
  }

  const sharedHobbies = activeProfile
    ? activeProfile.hobbies.filter((hobby) => currentUser.hobbies.some((item) => item.toLowerCase() === hobby.toLowerCase()))
    : [];

  return (
    <main className="page-grid">
      <section className="card-panel browse-sidebar">
        <span className="eyebrow">Browse Profiles</span>
        <h2>Friend finder deck</h2>
        <p>
          Use the buttons below like a simple dating-app flow. Interested tries to create a match when at least one hobby overlaps.
        </p>

        <div className="tip-box">
          <strong>Your visible profile</strong>
          <p>{currentUser.username}</p>
          <p>{currentUser.state}</p>
        </div>

        <section>
          <h3>Your hobbies</h3>
          <div className="tag-list">
            {currentUser.hobbies.map((hobby) => (
              <span key={hobby} className="tag tag--soft">{hobby}</span>
            ))}
          </div>
        </section>

        {statusMessage ? <p className="status-line">{statusMessage}</p> : null}
      </section>

      <section className="card-panel browse-main">
        {!activeProfile ? (
          <div className="empty-state">
            <h2>You reached the end of the deck.</h2>
            <p>Every profile has been reviewed for this session. Matches and groups stay available from the top navigation.</p>
          </div>
        ) : (
          <>
            <ProfileCard profile={activeProfile} />

            <div className="mutual-box">
              <h3>Shared hobbies</h3>
              {sharedHobbies.length > 0 ? (
                <div className="tag-list">
                  {sharedHobbies.map((hobby) => (
                    <span key={hobby} className="tag">{hobby}</span>
                  ))}
                </div>
              ) : (
                <p className="empty-copy">No direct overlap yet. Interested will only create a match when a hobby matches.</p>
              )}
            </div>

            <div className="action-row action-row--wide">
              <button className="danger-button" onClick={handlePass}>Not Interested</button>
              <button className="primary-button" onClick={handleInterested}>Interested</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default BrowsePage;
