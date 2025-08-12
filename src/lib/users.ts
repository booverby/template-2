export interface User {
  username: string;
  password: string;
  approved: boolean;
  role: 'admin' | 'user';
  openaiKey?: string;
  claudeKey?: string;
}

const users: User[] = [
  { username: 'Admin', password: 'Admin', approved: true, role: 'admin' },
];

export function findUser(username: string) {
  return users.find(u => u.username === username);
}

export function addUser(username: string, password: string) {
  users.push({ username, password, approved: false, role: 'user' });
}

export function approveUser(username: string) {
  const user = findUser(username);
  if (user) {
    user.approved = true;
  }
}

export function setApiKeys(username: string, openaiKey?: string, claudeKey?: string) {
  const user = findUser(username);
  if (user) {
    user.openaiKey = openaiKey;
    user.claudeKey = claudeKey;
  }
}

export { users };
