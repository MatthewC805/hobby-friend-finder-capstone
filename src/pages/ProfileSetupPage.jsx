import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hobbySuggestions } from '../data/sampleProfiles';
import { useAuth } from '../context/AuthContext';

function ProfileSetupPage() {
  const { currentUser, saveProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    hobbiesText: currentUser?.hobbies?.join(', ') || '',
    bio: currentUser?.bio || ''
  });
  const [message, setMessage] = useState('');

  const previewHobbies = useMemo(
    () => formData.hobbiesText.split(',').map((item) => item.trim()).filter(Boolean),
    [formData.hobbiesText]
  );

  function updateField(event) {
    setFormData((oldData) => ({
      ...oldData,
      [event.target.name]: event.target.value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanHobbies = formData.hobbiesText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const result = saveProfile({
      username: formData.username,
      hobbies: cleanHobbies,
      bio: formData.bio
    });

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    navigate('/browse');
  }

  return (
    <main className="single-page-layout">
      <section className="card-panel profile-setup-grid">
        <div>
          <span className="eyebrow">Profile Setup</span>
          <h1>Finish the public part of the profile.</h1>
          <p>
            Other users can only see the username, state, hobbies, and bio. Email and phone number stay private.
          </p>

          <div className="tip-box">
            <strong>Hobbies format</strong>
            <p>Enter hobbies separated by commas so the app can find shared interests more easily.</p>
          </div>

          <div className="hobby-cloud">
            {hobbySuggestions.map((hobby) => (
              <span key={hobby} className="tag tag--soft">{hobby}</span>
            ))}
          </div>
        </div>

        <div>
          {message ? <p className="status-line">{message}</p> : null}
          <form className="form-stack" onSubmit={handleSubmit}>
            <label>
              Username
              <input name="username" value={formData.username} onChange={updateField} placeholder="MatthewC805" required />
            </label>

            <label>
              Hobbies
              <input
                name="hobbiesText"
                value={formData.hobbiesText}
                onChange={updateField}
                placeholder="Videogames, Jogging, Board Games"
                required
              />
            </label>

            <label>
              Bio
              <textarea
                name="bio"
                value={formData.bio}
                onChange={updateField}
                rows="6"
                placeholder="Say a little about the hobbies you want to share with people."
                required
              />
            </label>

            <button className="primary-button" type="submit">Save Profile</button>
          </form>

          <aside className="preview-card">
            <h3>Profile Preview</h3>
            <div className="preview-card__row">
              <div className="profile-card__avatar">{(formData.username || currentUser?.firstName || 'U').slice(0, 2).toUpperCase()}</div>
              <div>
                <strong>{formData.username || 'Username preview'}</strong>
                <p>{currentUser?.state}</p>
              </div>
            </div>
            <div className="tag-list">
              {previewHobbies.map((hobby) => (
                <span key={hobby} className="tag">{hobby}</span>
              ))}
            </div>
            <p className="profile-card__bio">{formData.bio || 'Bio preview will show here.'}</p>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default ProfileSetupPage;
