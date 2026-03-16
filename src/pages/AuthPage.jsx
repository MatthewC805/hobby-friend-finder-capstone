import { useState } from 'react';
import { hobbySuggestions } from '../data/sampleProfiles';
import { useAuth } from '../context/AuthContext';

const blankRegister = {
  firstName: '',
  lastName: '',
  email: '',
  state: '',
  phone: '',
  password: ''
};

function AuthPage() {
  const { register, login } = useAuth();
  const [mode, setMode] = useState('register');
  const [registerForm, setRegisterForm] = useState(blankRegister);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  function updateRegisterField(event) {
    setRegisterForm((oldData) => ({
      ...oldData,
      [event.target.name]: event.target.value
    }));
  }

  function updateLoginField(event) {
    setLoginForm((oldData) => ({
      ...oldData,
      [event.target.name]: event.target.value
    }));
  }

  function handleRegister(event) {
    event.preventDefault();
    const result = register(registerForm);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage('Account created. Finish profile setup to start browsing.');
    setRegisterForm(blankRegister);
  }

  function handleLogin(event) {
    event.preventDefault();
    const result = login(loginForm.email, loginForm.password);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setMessage('Login successful.');
  }

  return (
    <main className="hero-layout">
      <section className="hero-copy card-panel">
        <span className="eyebrow">Capstone Demo Project</span>
        <h1>Find hobby friends in a swipe-style space.</h1>
        <p>
          OrbitFriends helps people connect through shared hobbies, chat with matches, and build small group spaces for planning meetups.
        </p>

        <div className="feature-grid">
          <article>
            <h3>Browse profiles</h3>
            <p>Move through community profiles and react with Interested or Not Interested.</p>
          </article>
          <article>
            <h3>Private matches</h3>
            <p>Chat one-on-one about games, books, crafts, sports, and anything else you both enjoy.</p>
          </article>
          <article>
            <h3>Group planning</h3>
            <p>Create group chats from existing matches and organize hobby hangouts in one place.</p>
          </article>
        </div>

        <div className="tip-box">
          <strong>Quick demo login</strong>
          <p>Email: demo@orbitfriends.app</p>
          <p>Password: demo123</p>
        </div>

        <div className="hobby-cloud">
          {hobbySuggestions.map((hobby) => (
            <span key={hobby} className="tag tag--soft">{hobby}</span>
          ))}
        </div>
      </section>

      <section className="auth-card card-panel">
        <div className="auth-switcher">
          <button className={mode === 'register' ? 'tab-button tab-button--active' : 'tab-button'} onClick={() => setMode('register')}>
            Create Account
          </button>
          <button className={mode === 'login' ? 'tab-button tab-button--active' : 'tab-button'} onClick={() => setMode('login')}>
            Log In
          </button>
        </div>

        {message ? <p className="status-line">{message}</p> : null}

        {mode === 'register' ? (
          <form className="form-stack" onSubmit={handleRegister}>
            <div className="split-fields">
              <label>
                First Name
                <input name="firstName" value={registerForm.firstName} onChange={updateRegisterField} required />
              </label>
              <label>
                Last Name
                <input name="lastName" value={registerForm.lastName} onChange={updateRegisterField} required />
              </label>
            </div>

            <label>
              Email
              <input type="email" name="email" value={registerForm.email} onChange={updateRegisterField} required />
            </label>

            <div className="split-fields">
              <label>
                State
                <input name="state" value={registerForm.state} onChange={updateRegisterField} required />
              </label>
              <label>
                Phone Number
                <input name="phone" value={registerForm.phone} onChange={updateRegisterField} required />
              </label>
            </div>

            <label>
              Password
              <input type="password" name="password" value={registerForm.password} onChange={updateRegisterField} required />
            </label>

            <button className="primary-button" type="submit">Create Account</button>
          </form>
        ) : (
          <form className="form-stack" onSubmit={handleLogin}>
            <label>
              Email
              <input type="email" name="email" value={loginForm.email} onChange={updateLoginField} required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={loginForm.password} onChange={updateLoginField} required />
            </label>
            <button className="primary-button" type="submit">Log In</button>
          </form>
        )}
      </section>
    </main>
  );
}

export default AuthPage;
