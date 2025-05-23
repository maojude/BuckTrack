export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js
// created object to organize all the API paths by category
export const API_PATHS = {
  AUTH: {
    LOGIN: "api/v1/auth/login",
    SIGNUP: "api/v1/auth/register",
    GET_USER_INFO: "api/v1/auth/getUser",
    GOOGLE_LOGIN: "api/v1/auth/google-login",
    UPDATE_THEME: "api/v1/auth/updateTheme",
    GET_PREFERENCE: "api/v1/auth/getPreferences",
  },
  DASHBOARD: {
    GET_DATA: "api/v1/dashboard",
  },
  INCOME: {
    ADD_INCOME: "api/v1/income/add",
    GET_ALL_INCOME: "api/v1/income/get",
    DELETE_INCOME: (incomeId) => `api/v1/income/delete/${incomeId}`,
    UPDATE_INCOME: (incomeId) => `api/v1/income/update/${incomeId}`,
  },
  EXPENSE: {
    ADD_EXPENSE: "api/v1/expense/add",
    GET_ALL_EXPENSE: "api/v1/expense/get",
    DELETE_EXPENSE: (expenseId) => `api/v1/expense/delete/${expenseId}`,
    UPDATE_EXPENSE: (expenseId) => `api/v1/expense/update/${expenseId}`,
  },
  SAVINGS: {
    ADD_SAVING_GOAL: "api/v1/savings/addSavingGoal",
    GET_ALL_SAVING_GOALS: "api/v1/savings/getAllSavingGoals",
    DELETE_SAVING_GOAL: (savingsId) =>
      `api/v1/savings/deleteSavingGoal/${savingsId}`,
    ADD_SAVING_FUNDS: (savingsId) =>
      `api/v1/savings/addSavingFunds/${savingsId}`,
    REMOVE_SAVING_FUNDS: (savingsId) =>
      `api/v1/savings/removeSavingFunds/${savingsId}`,
    GET_SAVING_TRANSACTIONS: (savingsId) =>
      `api/v1/savings/getSavingTransactions/${savingsId}`,
    UPDATE_SAVING_GOAL: (id) => `api/v1/savings/updateSavingGoal/${id}`,
    PATCH_SAVING_GOAL: (savingId) => `api/v1/savings/reminder/${savingId}`,
  },
  REPORT: {
    GET_REPORT: "api/v1/reports/overview",
  },
};
