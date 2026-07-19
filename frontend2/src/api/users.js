import client from './client';

export function listUsers() {
  return client.get('/users').then((res) => res.data.users);
}

export function createUser(payload) {
  return client.post('/users', payload).then((res) => res.data.user);
}

export function deactivateUser(id) {
  return client.patch(`/users/${id}/deactivate`).then((res) => res.data.user);
}
