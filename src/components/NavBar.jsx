import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const { currentUser, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-logo">OF</div>
        <div>
          <h1 className="brand-title">OrbitFriends</h1>
          <p className="brand-subtitle">Hobby-based friendships with a swipe-style flow</p>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/browse" className={({ isActive }) => `nav-pill${isActive ? ' nav-pill--active' : ''}`}>
          Browse
        </NavLink>
        <NavLink to="/matches" className={({ isActive }) => `nav-pill${isActive ? ' nav-pill--active' : ''}`}>
          Matches
        </NavLink>
        <NavLink to="/groups" className={({ isActive }) => `nav-pill${isActive ? ' nav-pill--active' : ''}`}>
          Groups
        </NavLink>
      </nav>

      <div className="topbar-actions">
        <div className="user-chip">
          <span className="user-chip__avatar">{(currentUser?.username || currentUser?.firstName || 'U').slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{currentUser?.username || currentUser?.firstName}</strong>
            <p>{currentUser?.state}</p>
          </div>
        </div>
        <button className="secondary-button" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default NavBar;
