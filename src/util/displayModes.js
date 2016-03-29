/**
 * Dictionary of the display modes and VT100 control sequences.
 * There are the most commonly supported control sequences for formatting text and their resetting.
 *
 * @type {Object}
 */
export const DISPLAY_MODES = {
  RESET_ALL: '[0m',
  BOLD: '[1m',
  DIM: '[2m',
  UNDERLINED: '[4m',
  BLINK: '[5m',
  REVERSE: '[7m',
  HIDDEN: '[8m',
  RESET_BOLD: '[21m',
  RESET_DIM: '[22m',
  RESET_UNDERLINED: '[24m',
  RESET_BLINK: '[25m',
  RESET_REVERSE: '[27m',
  RESET_HIDDEN: '[28m'
};
