//email validation function pattern from https://www.geeksforgeeks.org/javascript-program-to-validate-an-email-address/

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const addThousandsSeparator = (num) => {
    if (num == null || isNaN(num)) return "";

    const [integerPart, fractionalPart] = num.toString().split(".");
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return fractionalPart ? `${formattedIntegerPart}.${fractionalPart}` : formattedIntegerPart;
};

//data = [] is a default parameter, if no data is passed, it will be an empty array
//Function loops through the data array and returns a new array of objects with category and amount properties
export const prepareExpenseBarChartData = (data = []) => {
    const chartData = data.map((item) => ({
        category: item?.category,
        amount: item?.amount,
    }));

    return chartData;
};