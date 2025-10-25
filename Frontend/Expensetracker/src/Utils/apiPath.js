export const BASE_URL = 'http://localhost:3030';

export const API_PATHS = {
  AUTH: {
    LOGIN: `/api/auth/login`,
    SIGNUP: `/api/auth/register`,
    PROFILE: `/api/auth/profile`,
  },
  EXPENSES: {
    GET: `/api/expenses/get-expense`,
    ADD: `/api/expenses/add-expense`,
    DELETE: `/api/expenses/delete-expense/:id`,
    DOWNLOAD: `/api/expenses/download-expense`,
  },
  INCOME: {
    GET: `/api/income/get-incomes`,
    ADD: `/api/income/add-income`,
    DELETE: `/api/income/delete-income/:id`,
    DOWNLOAD: `/api/income/download-income`,
  },
  DASHBOARD: `/api/dashboard/data`,
  IMAGE_UPLOAD: `/api/auth/profile-image`,
};
