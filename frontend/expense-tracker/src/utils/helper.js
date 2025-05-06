//email validation function pattern from https://www.geeksforgeeks.org/javascript-program-to-validate-an-email-address/

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
