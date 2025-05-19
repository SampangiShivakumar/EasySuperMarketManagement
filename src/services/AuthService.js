const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const storeCredentials = async (userData) => {
  const hashedPassword = await hashPassword(userData.password);
  const user = {
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.some(u => u.username === userData.username)) {
    throw new Error('Username already exists');
  }
  
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  return user;
};

export const verifyCredentials = async (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.username === username);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const hashedPassword = await hashPassword(password);
  if (user.password !== hashedPassword) {
    throw new Error('Invalid password');
  }
  
  return { username: user.username, email: user.email };
};
