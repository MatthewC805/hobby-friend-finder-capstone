import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';
import AuthPage from './pages/AuthPage';
import BrowsePage from './pages/BrowsePage';
import GroupsPage from './pages/GroupsPage';
import MatchesPage from './pages/MatchesPage';
import ProfileSetupPage from './pages/ProfileSetupPage';

function ProtectedRoute({ children, needsProfile = true }) {
  const { isLoggedIn, hasProfile } = useAuth();

  if (!isLoggedIn) return <Navigate to="/" replace />;
  if (needsProfile && !hasProfile) return <Navigate to="/profile-setup" replace />;

  return children;
}

function App() {
  const { isLoggedIn, hasProfile } = useAuth();

  return (
    <div className="app-shell">
      {isLoggedIn && hasProfile ? <NavBar /> : null}

      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to={hasProfile ? '/browse' : '/profile-setup'} replace /> : <AuthPage />} />
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute needsProfile={false}>
              <ProfileSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <BrowsePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <MatchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <ProtectedRoute>
              <GroupsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
