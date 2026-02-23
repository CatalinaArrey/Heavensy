export const environment = {
  production: false,
  apiUrl: 'https://heavensy-api-backend.onrender.com/api', 
  socketUrl: 'https://heavensy-api-backend.onrender.com'   
};

// Control whether the app should auto-login with default credentials on startup
export const environmentFlags = {
  autoLogin: false
};

// Default credentials for local/dev auto-login (can be overridden in production)
export const defaultCredentials = {
  username: 'admin',
  password: 'Admin123!'
};
