export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js
// created object to organize all the API paths by category
export const API_PATHS = {
    AUTH: {
        LOGIN: "api/v1/auth/login",
        SIGNUP: "api/v1/auth/register",
        GET_USER_INFO: "api/v1/auth/getUser",
        GOOGLE_LOGIN: "api/v1/auth/google-login",
    },
    DASHBOARD: {
        GET_DATA: "api/v1/dashboard",
    },
    INCOME: {
        ADD_INCOME: "api/v1/income/add",
        GET_ALL_INCOME: "api/v1/income/get",
        DELETE_INCOME: (incomeId) => `api/v1/income/delete/${incomeId}`,
    },
    EXPENSE: {
        ADD_EXPENSE: "api/v1/expense/add",
        GET_ALL_EXPENSE: "api/v1/expense/get",
        DELETE_EXPENSE: (expenseId) => `api/v1/expense/delete/${expenseId}`,
    }
};