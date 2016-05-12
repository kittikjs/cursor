import {COLORS} from './util/colors';
import {DISPLAY_MODES} from './util/displayModes';
import {encodeToVT100} from './util/encodeToVT100';

/**
 * Cell responsible for mapping separate cells in the real terminal to the virtual one.
 *
 * @since 3.1.0
 */
export default class Cell {
  /**
   * Create Cell instance which are able to convert itself to ASCII control sequence.
   *
   * @constructor
   * @param {String} [char] Char that you want to wrap with control sequences
   * @param {Object} [options] Options object where you can set additional style to char
   * @param {Number} [options.x] X coordinate
   * @param {Number} [options.y] Y coordinate
   * @param {String} [options.background] Background color name, `none` to disable color
   * @param {String} [options.foreground] Foreground color name, `none` to disable color
   * @param {Object} [options.display] Object with display modes
   * @param {Boolean} [options.display.bold] Bold style
   * @param {Boolean} [options.display.dim] Dim style
   * @param {Boolean} [options.display.underlined] Underlined style
   * @param {Boolean} [options.display.blink] Blink style
   * @param {Boolean} [options.display.reverse] Reverse style
   * @param {Boolean} [options.display.hidden] Hidden style
   */
  constructor(char, options = {}) {
    var {x, y, background, foreground, display = {}} = options;

    this._char = ' ';
    this._x = 0;
    this._y = 0;
    this._background = 'none';
    this._foreground = 'none';
    this._display = {bold: false, dim: false, underlined: false, blink: false, reverse: false, hidden: false};
    this._modified = false;

    this.setChar(char);
    this.setX(x);
    this.setY(y);
    this.setBackground(background);
    this.setForeground(foreground);
    this.setDisplay(display.bold, display.dim, display.underlined, display.blink, display.reverse, display.hidden);
    this.setModified(false);
  }

  /**
   * Get current char.
   *
   * @returns {String}
   */
  getChar() {
    return this._char;
  }

  /**
   * Set new char to cell.
   * If char is longer than 1 char, it slices string to 1 char.
   *
   * @param {String} [char=' ']
   * @returns {Cell}
   */
  setChar(char = ' ') {
    this._char = char.slice(0, 1);
    return this;
  }

  /**
   * Get X coordinate of this cell.
   *
   * @returns {Number}
   */
  getX() {
    return this._x;
  }

  /**
   * Set new X coordinate for cell.
   *
   * @param {Number} [x=0]
   * @returns {Cell}
   */
  setX(x = 0) {
    this._x = Math.floor(x);
    return this;
  }

  /**
   * Get Y coordinate.
   *
   * @returns {Number}
   */
  getY() {
    return this._y;
  }

  /**
   * Set new Y coordinate for cell.
   *
   * @param {Number} [y=0]
   * @returns {Cell}
   */
  setY(y = 0) {
    this._y = Math.floor(y);
    return this;
  }

  /**
   * Get current background color.
   *
   * @returns {String}
   */
  getBackground() {
    return this._background;
  }

  /**
   * Set new background color.
   *
   * @param {String} [colorName=none] Color name from {@link COLORS} dictionary.
   * @returns {Cell}
   */
  setBackground(colorName = 'none') {
    const color = colorName.toUpperCase();
    this._background = COLORS[color] ? color : 'none';

    return this;
  }

  /**
   * Get current foreground color.
   *
   * @returns {String}
   */
  getForeground() {
    return this._foreground;
  }

  /**
   * Set new foreground color.
   *
   * @param {String} [colorName=none] Color name from {@link COLORS} dictionary.
   * @returns {Cell}
   */
  setForeground(colorName = 'none') {
    const color = colorName.toUpperCase();
    this._foreground = COLORS[color] ? color : 'none';

    return this;
  }

  /**
   * Get current display modes.
   *
   * @returns {{bold: Boolean, dim: Boolean, underlined: Boolean, blink: Boolean, reverse: Boolean, hidden: Boolean}}
   */
  getDisplay() {
    return this._display;
  }

  /**
   * Set new display modes to cell.
   *
   * @param {Boolean} [bold=false] Bold style
   * @param {Boolean} [dim=false] Dim style
   * @param {Boolean} [underlined=false] Underlined style
   * @param {Boolean} [blink=false] Blink style
   * @param {Boolean} [reverse=false] Reverse style
   * @param {Boolean} [hidden=false] Hidden style
   * @returns {Cell}
   */
  setDisplay(bold = false, dim = false, underlined = false, blink = false, reverse = false, hidden = false) {
    this._display.bold = bold;
    this._display.dim = dim;
    this._display.underlined = underlined;
    this._display.blink = blink;
    this._display.reverse = reverse;
    this._display.hidden = hidden;

    return this;
  }

  /**
   * Mark cell as modified or not.
   *
   * @param {Boolean} [isModified=true] Flag shows if cell is modified
   * @returns {Cell}
   */
  setModified(isModified = true) {
    this._modified = isModified;
    return this;
  }

  /**
   * Check if cell has been modified.
   *
   * @returns {Boolean}
   */
  isModified() {
    return !!this._modified;
  }

  /**
   * Reset display settings.
   * It resets char, background, foreground and display mode.
   *
   * @returns {Cell}
   */
  reset() {
    return this.setChar(' ').setBackground('none').setForeground('none').setDisplay(false, false, false, false, false, false).setModified(true);
  }

  /**
   * Convert cell to VT100 compatible control sequence.
   *
   * @returns {String}
   */
  toString() {
    var [char, x, y, background, foreground, display] = [this.getChar(), this.getX(), this.getY(), this.getBackground(), this.getForeground(), this.getDisplay()];

    return (
      encodeToVT100(`[${y + 1};${x + 1}f`) +
      (background !== 'none' ? encodeToVT100(`[48;5;${COLORS[background]}m`) : '') +
      (foreground !== 'none' ? encodeToVT100(`[38;5;${COLORS[foreground]}m`) : '') +
      (display.bold ? encodeToVT100(DISPLAY_MODES.BOLD) : '') +
      (display.dim ? encodeToVT100(DISPLAY_MODES.DIM) : '') +
      (display.underlined ? encodeToVT100(DISPLAY_MODES.UNDERLINED) : '') +
      (display.blink ? encodeToVT100(DISPLAY_MODES.BLINK) : '') +
      (display.reverse ? encodeToVT100(DISPLAY_MODES.REVERSE) : '') +
      (display.hidden ? encodeToVT100(DISPLAY_MODES.HIDDEN) : '') +
      char +
      encodeToVT100(DISPLAY_MODES.RESET_ALL)
    );
  }

  /**
   * Wrapper around `new Cell()`.
   *
   * @static
   * @returns {Cell}
   */
  static create(...args) {
    return new this(...args);
  }
}
