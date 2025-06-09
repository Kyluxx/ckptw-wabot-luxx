/**
 * Utility class with helper methods for string conversion and comparison.
 */
class Util {
    /**
     * Converts the input data to a string.
     * If the input is a Buffer, it converts it to a base64-encoded string.
     * @param {string|Buffer} data - The input data.
     * @returns {string} The string representation of the data.
     * @throws {TypeError} If `data` is not a string or Buffer.
     */
    static toString(data) {
        if (typeof data === 'string') {
            return data;
        }
        if (Buffer.isBuffer(data)) {
            return data.toString('base64');
        }
        throw new TypeError('Input must be a string or a Buffer.');
    }

    /**
     * Compares two inputs for equality after converting them to strings.
     * Performs a safe substring comparison with a minimum length of 5 characters.
     * @param {string|Buffer|null} a - The first input to compare.
     * @param {string|Buffer|null} b - The second input to compare.
     * @returns {boolean} True if the inputs are considered equal, otherwise false.
     * @throws {Error} If the maximum length of the inputs is less than 5.
     */
    static isEqual(a, b) {
        if (a == null || b == null) {
            return false;
        }

        a = Util.toString(a);
        b = Util.toString(b);

        const maxLength = Math.max(a.length, b.length);
        if (maxLength < 5) {
            throw new Error('Cannot compare inputs: length of inputs is too short (less than 5 characters).');
        }

        // Perform substring comparison
        return a.substring(0, maxLength) === b.substring(0, maxLength);
    }
}

module.exports = Util;