import client from './client';

export function login(username, password) {
  return client.post('/auth/login', { username, password }).then((res) => res.data);
}

export function logout() {
  return client.post('/auth/logout').then((res) => res.data);
}

export function fetchMe() {
  return client.get('/auth/me').then((res) => res.data);
}
