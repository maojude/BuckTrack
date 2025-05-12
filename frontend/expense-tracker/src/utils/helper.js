import moment from "moment";

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

export const prepareIncomeBarChartData = (data = []) => {
    // [...data] creates a shallow copy of the data array
    // which avoids mutating the original data array
    // sorts the data array by date in ascending order
    const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        month: moment(item?.date).format("Do MMM"),
        amount: item?.amount,
        source: item?.source,
    }));

    return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
    const sortedData = [...data].sort((a,b) => new Date(a.date) - new Date(b.date));
    
    const chartData = sortedData.map((item) => ({
        month: moment(item?.date).format("Do MMM"),
        amount: item?.amount,
        category: item?.category,
    }));
    return chartData;
};
