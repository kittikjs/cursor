/**
 * Encode control sequence to VT100 compatible control sequence.
 *
 * @param {String} code Control sequence that you want to encode
 * @returns {String} Returns encoded string
 */
export const encodeToVT100 = code => '\u001b' + code;
