/**
 * Converts the input to a number if possible; otherwise returns 0.
 *
 * This function checks if the input value can be converted to a valid number.
 * If the value is NaN (not a number) or any other non-numeric value (e.g. "-"),
 * it returns 0. Otherwise, it returns the numeric value.
 *
 * @param {any} value - The value to be converted to a number.
 * @returns {number} - The numeric value or 0 if the input is not a valid number.
 */
export const toNumberOrZero = (value) => {
    return isNaN(Number(value)) ? 0 : Number(value);
};