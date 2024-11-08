export const isValidDateFormat = date => {
    const convertedDate = new Date(date);

    return !(!(convertedDate instanceof Date) || Number.isNaN(convertedDate.getTime()));
};
