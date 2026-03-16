import { sampleProfiles } from '../data/sampleProfiles';

const ACCOUNTS_KEY = 'orbitfriends_accounts';
const SESSION_KEY = 'orbitfriends_session';
const MATCHES_KEY = 'orbitfriends_matches';
const GROUPS_KEY = 'orbitfriends_groups';
const DECISIONS_KEY = 'orbitfriends_decisions';

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function makeId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function seedDemoAccount() {
  const accounts = readJson(ACCOUNTS_KEY, []);
  if (accounts.length > 0) return accounts;

  const demoAccount = {
    id: 'demo-user',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@orbitfriends.app',
    password: 'demo123',
    state: 'New Jersey',
    phone: '555-101-2020',
    username: 'DemoCommander',
    hobbies: ['Videogames', 'Jogging', 'Board Games', 'Sci-Fi Movies'],
    bio: 'A sample account for quick exploring. Loves easygoing game nights and active weekend plans.',
    createdAt: new Date().toISOString()
  };

  saveJson(ACCOUNTS_KEY, [demoAccount]);
  return [demoAccount];
}

export function getAccounts() {
  return seedDemoAccount();
}

export function registerAccount(formData) {
  const accounts = getAccounts();
  const alreadyExists = accounts.find(
    (account) => account.email.toLowerCase() === formData.email.toLowerCase()
  );

  if (alreadyExists) {
    return { ok: false, message: 'An account with that email already exists.' };
  }

  const nextAccount = {
    id: makeId('user'),
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim(),
    password: formData.password,
    state: formData.state.trim(),
    phone: formData.phone.trim(),
    username: '',
    hobbies: [],
    bio: '',
    createdAt: new Date().toISOString()
  };

  saveJson(ACCOUNTS_KEY, [...accounts, nextAccount]);
  saveJson(SESSION_KEY, nextAccount.id);

  return { ok: true, account: nextAccount };
}

export function loginAccount(email, password) {
  const accounts = getAccounts();
  const foundAccount = accounts.find(
    (account) => account.email.toLowerCase() === email.toLowerCase() && account.password === password
  );

  if (!foundAccount) {
    return { ok: false, message: 'Email or password was not correct.' };
  }

  saveJson(SESSION_KEY, foundAccount.id);
  return { ok: true, account: foundAccount };
}

export function getCurrentUser() {
  const accounts = getAccounts();
  const currentUserId = readJson(SESSION_KEY, null);
  if (!currentUserId) return null;

  return accounts.find((account) => account.id === currentUserId) || null;
}

export function logoutAccount() {
  localStorage.removeItem(SESSION_KEY);
}

export function updateProfile(profileData) {
  const accounts = getAccounts();
  const currentUser = getCurrentUser();
  if (!currentUser) return { ok: false, message: 'No account is signed in.' };

  const usernameTaken = accounts.find(
    (account) =>
      account.id !== currentUser.id &&
      account.username &&
      account.username.toLowerCase() === profileData.username.toLowerCase()
  );

  if (usernameTaken) {
    return { ok: false, message: 'That username is already in use.' };
  }

  const updatedAccounts = accounts.map((account) => {
    if (account.id !== currentUser.id) return account;

    return {
      ...account,
      username: profileData.username.trim(),
      bio: profileData.bio.trim(),
      hobbies: profileData.hobbies,
      avatar: profileData.username.slice(0, 2).toUpperCase()
    };
  });

  saveJson(ACCOUNTS_KEY, updatedAccounts);
  return { ok: true, account: updatedAccounts.find((account) => account.id === currentUser.id) };
}

export function getBrowseProfiles() {
  const currentUser = getCurrentUser();
  const accounts = getAccounts();
  const decisions = readJson(DECISIONS_KEY, {});
  const currentDecisions = decisions[currentUser?.id] || { liked: [], passed: [] };
  const matches = getMatches();
  const matchedIds = matches.map((match) => match.profileId);

  const userProfiles = accounts
    .filter((account) => account.id !== currentUser?.id && account.username)
    .map((account) => ({
      id: account.id,
      username: account.username,
      state: account.state,
      hobbies: account.hobbies,
      bio: account.bio,
      avatar: account.avatar || account.username.slice(0, 2).toUpperCase()
    }));

  return [...sampleProfiles, ...userProfiles].filter(
    (profile) =>
      !currentDecisions.passed.includes(profile.id) &&
      !currentDecisions.liked.includes(profile.id) &&
      !matchedIds.includes(profile.id)
  );
}

export function recordDecision(profileId, type) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const decisions = readJson(DECISIONS_KEY, {});
  const currentDecisions = decisions[currentUser.id] || { liked: [], passed: [] };

  if (type === 'like' && !currentDecisions.liked.includes(profileId)) {
    currentDecisions.liked.push(profileId);
  }

  if (type === 'pass' && !currentDecisions.passed.includes(profileId)) {
    currentDecisions.passed.push(profileId);
  }

  decisions[currentUser.id] = currentDecisions;
  saveJson(DECISIONS_KEY, decisions);
}

function getMutualHobbyCount(userHobbies = [], profileHobbies = []) {
  return profileHobbies.filter((hobby) =>
    userHobbies.some((item) => item.toLowerCase() === hobby.toLowerCase())
  ).length;
}

export function likeProfile(profile) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return { matched: false, message: 'Sign in to continue browsing.' };
  }

  recordDecision(profile.id, 'like');

  const mutualCount = getMutualHobbyCount(currentUser.hobbies, profile.hobbies);
  if (mutualCount === 0) {
    return {
      matched: false,
      message: `Request sent to ${profile.username}. A match appears after at least one shared hobby.`
    };
  }

  const matches = getMatches();
  const alreadyMatched = matches.find((match) => match.profileId === profile.id);
  if (alreadyMatched) {
    return { matched: true, message: `You already matched with ${profile.username}.` };
  }

  const nextMatch = {
    id: makeId('match'),
    profileId: profile.id,
    username: profile.username,
    state: profile.state,
    hobbies: profile.hobbies,
    bio: profile.bio,
    avatar: profile.avatar || profile.username.slice(0, 2).toUpperCase(),
    messages: [
      {
        id: makeId('msg'),
        sender: profile.username,
        text: `Hey ${currentUser.username || currentUser.firstName}, looks like we both like ${profile.hobbies[0]}. Want to chat?`,
        createdAt: new Date().toISOString()
      }
    ]
  };

  saveMatches([...matches, nextMatch]);
  return { matched: true, message: `It is a match with ${profile.username}.` };
}

export function getMatches() {
  const currentUser = getCurrentUser();
  const matchStore = readJson(MATCHES_KEY, {});
  return currentUser ? matchStore[currentUser.id] || [] : [];
}

function saveMatches(matches) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const matchStore = readJson(MATCHES_KEY, {});
  matchStore[currentUser.id] = matches;
  saveJson(MATCHES_KEY, matchStore);
}

export function syncMatchesShape() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  const store = readJson(MATCHES_KEY, {});
  if (!store[currentUser.id]) {
    store[currentUser.id] = [];
    saveJson(MATCHES_KEY, store);
  }
}

export function sendMatchMessage(matchId, text) {
  const currentUser = getCurrentUser();
  const matches = getMatches();

  const updatedMatches = matches.map((match) => {
    if (match.id !== matchId) return match;

    return {
      ...match,
      messages: [
        ...match.messages,
        {
          id: makeId('msg'),
          sender: currentUser.username || currentUser.firstName,
          text: text.trim(),
          createdAt: new Date().toISOString()
        }
      ]
    };
  });

  saveMatches(updatedMatches);
}

export function getGroups() {
  const currentUser = getCurrentUser();
  const groupStore = readJson(GROUPS_KEY, {});
  return currentUser ? groupStore[currentUser.id] || [] : [];
}

function saveGroups(groups) {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const groupStore = readJson(GROUPS_KEY, {});
  groupStore[currentUser.id] = groups;
  saveJson(GROUPS_KEY, groupStore);
}

export function createGroup(groupName, memberNames) {
  const currentUser = getCurrentUser();
  const groups = getGroups();

  const nextGroup = {
    id: makeId('group'),
    name: groupName.trim(),
    members: [currentUser.username || currentUser.firstName, ...memberNames],
    messages: [
      {
        id: makeId('msg'),
        sender: 'System',
        text: `${groupName.trim()} was created. Start planning a hobby hangout here.`,
        createdAt: new Date().toISOString()
      }
    ]
  };

  saveGroups([...groups, nextGroup]);
}

export function sendGroupMessage(groupId, text) {
  const currentUser = getCurrentUser();
  const groups = getGroups();

  const updatedGroups = groups.map((group) => {
    if (group.id !== groupId) return group;

    return {
      ...group,
      messages: [
        ...group.messages,
        {
          id: makeId('msg'),
          sender: currentUser.username || currentUser.firstName,
          text: text.trim(),
          createdAt: new Date().toISOString()
        }
      ]
    };
  });

  saveGroups(updatedGroups);
}

export function clearAppData() {
  localStorage.removeItem(ACCOUNTS_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(MATCHES_KEY);
  localStorage.removeItem(GROUPS_KEY);
  localStorage.removeItem(DECISIONS_KEY);
}
