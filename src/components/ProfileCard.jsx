function ProfileCard({ profile }) {
  return (
    <article className="profile-card">
      <div className="profile-card__header">
        <div className="profile-card__avatar">{profile.avatar || profile.username.slice(0, 2).toUpperCase()}</div>
        <div>
          <h2>{profile.username}</h2>
          <p>{profile.state}</p>
        </div>
      </div>

      <section className="profile-card__section">
        <h3>Hobbies</h3>
        <div className="tag-list">
          {profile.hobbies.map((hobby) => (
            <span key={hobby} className="tag">{hobby}</span>
          ))}
        </div>
      </section>

      <section className="profile-card__section">
        <h3>Bio</h3>
        <p className="profile-card__bio">{profile.bio}</p>
      </section>
    </article>
  );
}

export default ProfileCard;
