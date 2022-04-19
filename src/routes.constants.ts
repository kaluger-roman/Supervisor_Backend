const BASE_API_ROUTE = 'api';

export const ROUTES = {
  API: {
    AUTH: {
      BASE: BASE_API_ROUTE + '/auth',
      LOGIN: 'login',
      REGISTER: 'register',
      LOGOUT: '/logout',
      RECOVER_PASSWORD: '/recover_password',
      CHANGE_PASSWORD: '/change_password',
      VERIFY: '/verify_token',
    },
    AGENT: {
      BASE: BASE_API_ROUTE + '/agent',
      STATUS: '/status',
    },
    USERS: {
      BASE: BASE_API_ROUTE + '/users',
    },
    RECORDS: {
      BASE: BASE_API_ROUTE + '/records',
      FULL: '/full',
      SRC: '/src',
      TRANSCRIPTION: '/transcription',
    },
  },
};
