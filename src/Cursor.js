import Cell from './Cell';
import {encodeToVT100} from './util/encodeToVT100';

/**
 * Cursor implements low-level API to terminal cursor.
 *
 * @see http://www.termsys.demon.co.uk/vtansi.htm
 * @see http://misc.flogisoft.com/bash/tip_colors_and_formatting
 * @see http://man7.org/linux/man-pages/man4/console_codes.4.html
 * @see http://www.x.org/docs/xterm/ctlseqs.pdf
 * @see http://wiki.bash-hackers.org/scripting/terminalcodes
 * @since 1.0.0
 */
export default class Cursor {
  /**
   * Creates cursor that writes direct to `stdout`.
   * You can override target stream with another one.
   * Also, you can specify custom width and height of viewport where cursor will render the frame.
   *
   * @constructor
   * @param {Object} [options] Object with options
   * @param {Stream} [options.stream=process.stdout] Writable stream
   * @param {Number} [options.width=stream.columns] Number of columns (width)
   * @param {Number} [options.height=stream.rows] Number of rows (height)
   * @example
   * new Cursor(); // creates cursor with viewport in process.stdout
   *
   * // creates cursor with file as a target source and custom sizes of the viewport
   * new Cursor({
   *   stream: fs.createWriteStream('./test'),
   *   width: 60,
   *   height: 20
   * });
   */
  constructor(options = {}) {
    var {stream = process.stdout, width = stream.columns, height = stream.rows} = options;

    this._stream = stream;
    this._width = width;
    this._height = height;

    this._x = 0;
    this._y = 0;
    this._background = 'none';
    this._foreground = 'none';
    this._display = {bold: false, dim: false, underlined: false, blink: false, reverse: false, hidden: false};

    this._cells = Array.from({length: width * height}).map(() => new Cell());
    this._lastFrame = Array.from({length: width * height}).fill('');
  }

  /**
   * Write to the stream.
   * It doesn't applies immediately but stores in virtual terminal that represented as array of {@link Cell} instances.
   * For applying changes you need to {@link flush} changes.
   *
   * @param {String} data Data to write to the terminal
   * @returns {Cursor}
   * @example
   * cursor.write('Hello, World'); // write Hello, World at current position of the cursor
   * cursor.flush(); // apply changes to the real terminal
   */
  write(data) {
    var width = this._width;
    var height = this._height;
    var background = this._background;
    var foreground = this._foreground;
    var display = this._display;

    for (var i = 0; i < data.length; i++) {
      var char = data[i];
      var x = this._x;
      var y = this._y;
      var pointer = this.getPointerFromXY(x, y);

      if (0 <= x && x < width && 0 <= y && y < height) {
        this._cells[pointer]
          .setChar(char)
          .setX(x)
          .setY(y)
          .setBackground(background)
          .setForeground(foreground)
          .setDisplay(display.bold, display.dim, display.underlined, display.blink, display.reverse, display.hidden)
          .setModified(true);
      }

      this._x++;
    }

    return this;
  }

  /**
   * Takes only modified cells from virtual terminal and flush changes to the real terminal.
   * Before flush the changes, it checks if this modified cell was actually changed.
   * If so, writes to the stream, otherwise ignore this cell.
   *
   * @returns {Cursor}
   * @example
   * cursor.moveTo(10, 10); // Make some changes
   * cursor.write('Hello'); // One more change
   * cursor.write('World'); // The last one
   * cursor.flush(); // When changes is ready, call flush()
   */
  flush() {
    for (var i = 0; i < this._cells.length; i++) {
      if (this._cells[i].isModified()) {
        var cellSeq = this._cells[i].setModified(false).toString();

        if (cellSeq !== this._lastFrame[i]) {
          this._lastFrame[i] = cellSeq;
          this._stream.write(cellSeq);
        }
      }
    }

    return this;
  }

  /**
   * Get index in the virtual terminal representation from (x, y) coordinates.
   *
   * @param {Number} [x] X coordinate on the terminal
   * @param {Number} [y] Y coordinate on the terminal
   * @returns {Number} Returns index in the buffer array
   * @example
   * cursor.getPointerFromXY(0, 0); // returns 0
   * cursor.getPointerFromXY(10, 0); // returns 10
   */
  getPointerFromXY(x = this._x, y = this._y) {
    return y * this._width + x;
  }

  /**
   * Get (x, y) coordinate from the index in the virtual terminal representation.
   *
   * @param {Number} index Index in the buffer which represents terminal
   * @returns {Array} Returns an array [x, y]
   * @example
   * const [x, y] = cursor.getXYFromPointer(0); // returns [0, 0]
   * const [x, y] = cursor.getXYFromPointer(10); // returns [10, 0]
   */
  getXYFromPointer(index) {
    return [index - (Math.floor(index / this._width) * this._width), Math.floor(index / this._width)];
  }

  /**
   * Move the cursor up.
   *
   * @param {Number} [y=1]
   * @returns {Cursor}
   * @example
   * cursor.up(); // move cursor up by 1 cell
   * cursor.up(5); // move cursor up by 5 cells
   */
  up(y = 1) {
    this._y -= Math.floor(y);
    return this;
  }

  /**
   * Move the cursor down.
   *
   * @param {Number} [y=1]
   * @returns {Cursor}
   * @example
   * cursor.down(); // move cursor down by 1 cell
   * cursor.down(5); // move cursor down by 5 cells
   */
  down(y = 1) {
    this._y += Math.floor(y);
    return this;
  }

  /**
   * Move the cursor right.
   *
   * @param {Number} [x=1]
   * @returns {Cursor}
   * @example
   * cursor.right(); // move cursor right by 1 cell
   * cursor.right(5); // move cursor right by 5 cells
   */
  right(x = 1) {
    this._x += Math.floor(x);
    return this;
  }

  /**
   * Move the cursor left.
   *
   * @param {Number} [x=1]
   * @returns {Cursor}
   * @example
   * cursor.left(); // move cursor left by 1 cell
   * cursor.left(5); // move cursor left by 5 cells
   */
  left(x = 1) {
    this._x -= Math.floor(x);
    return this;
  }

  /**
   * Move the cursor position relative current coordinates.
   *
   * @param {Number} x Offset by X coordinate
   * @param {Number} y Offset by Y coordinate
   * @returns {Cursor}
   * @example
   * cursor.moveBy(10, 10); // moves cursor down and right by 10 cells
   * cursor.moveBy(-10, -10); // moves cursor up and left by 10 cells
   */
  moveBy(x, y) {
    if (x < 0) this.left(-x);
    if (x > 0) this.right(x);

    if (y < 0) this.up(-y);
    if (y > 0) this.down(y);

    return this;
  }

  /**
   * Set the cursor position by absolute coordinates.
   *
   * @param {Number} x X coordinate
   * @param {Number} y Y coordinate
   * @returns {Cursor}
   * @example
   * cursor.moveTo(5, 10); // Move cursor to (5, 10) point in the terminal
   */
  moveTo(x, y) {
    this._x = Math.floor(x);
    this._y = Math.floor(y);

    return this;
  }

  /**
   * Set the foreground color.
   * This color is used when text is rendering.
   *
   * @param {String} color Color name or `none` if you want to disable foreground filling
   * @returns {Cursor}
   * @example
   * cursor.foreground('black');
   * cursor.foreground('none');
   */
  foreground(color = 'none') {
    this._foreground = color;

    return this;
  }

  /**
   * Set the background color.
   * This color is used for filling the whole cell in the TTY.
   *
   * @param {String} color Color name or `none` if you want to disable background filling
   * @returns {Cursor}
   * @example
   * cursor.background('black');
   * cursor.background('none');
   */
  background(color = 'none') {
    this._background = color;

    return this;
  }

  /**
   * Toggle bold display mode.
   *
   * @param {Boolean} [isBold=true] If false, disables bold mode
   * @returns {Cursor}
   * @example
   * cursor.bold(); // enables bold mode
   * cursor.bold(false); // disables bold mode
   */
  bold(isBold = true) {
    this._display.bold = isBold;
    return this;
  }

  /**
   * Toggle dim display mode.
   *
   * @param {Boolean} [isDim=true] If false, disables dim mode
   * @returns {Cursor}
   * @example
   * cursor.dim(); // enables dim mode
   * cursor.dim(false); // disables dim mode
   */
  dim(isDim = true) {
    this._display.dim = isDim;
    return this;
  }

  /**
   * Toggle underlined display mode.
   *
   * @param {Boolean} [isUnderlined=true] If false, disables underlined mode
   * @returns {Cursor}
   * @example
   * cursor.underlined(); // enables underlined mode
   * cursor.underlined(false); // disables underlined mode
   */
  underlined(isUnderlined = true) {
    this._display.underlined = isUnderlined;
    return this;
  }

  /**
   * Toggle blink display mode.
   *
   * @param {Boolean} [isBlink=true] If false, disables blink mode
   * @returns {Cursor}
   * @example
   * cursor.blink(); // enables blink mode
   * cursor.blink(false); // disables blink mode
   */
  blink(isBlink = true) {
    this._display.blink = isBlink;
    return this;
  }

  /**
   * Toggle reverse display mode.
   *
   * @param {Boolean} [isReverse=true] If false, disables reverse display mode
   * @returns {Cursor}
   * @example
   * cursor.reverse(); // enables reverse mode
   * cursor.reverse(false); // disables reverse mode
   */
  reverse(isReverse = true) {
    this._display.reverse = isReverse;
    return this;
  }

  /**
   * Toggle hidden display mode.
   *
   * @param {Boolean} [isHidden=true] If false, disables hidden display mode
   * @returns {Cursor}
   * @example
   * cursor.hidden(); // enables hidden mode
   * cursor.hidden(false); // disables hidden mode
   */
  hidden(isHidden = true) {
    this._display.hidden = isHidden;
    return this;
  }

  /**
   * Erase the specified region.
   * The region describes the rectangle shape which need to erase.
   *
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} x2
   * @param {Number} y2
   * @returns {Cursor}
   * @example
   * cursor.erase(0, 0, 5, 5); // erase the specified rectangle (0, 0, 5, 5)
   */
  erase(x1, y1, x2, y2) {
    for (var y = y1; y <= y2; y++) {
      for (var x = x1; x <= x2; x++) {
        var pointer = this.getPointerFromXY(x, y);
        this._cells[pointer] && this._cells[pointer].reset();
      }
    }

    return this;
  }

  /**
   * Erase from current position to end of the line.
   *
   * @returns {Cursor}
   * @example
   * cursor.eraseToEnd();
   */
  eraseToEnd() {
    return this.erase(this._x, this._y, this._width - 1, this._y);
  }

  /**
   * Erase from current position to start of the line.
   *
   * @returns {Cursor}
   * @example
   * cursor.eraseToStart();
   */
  eraseToStart() {
    return this.erase(0, this._y, this._x, this._y);
  }

  /**
   * Erase from current line to down.
   *
   * @returns {Cursor}
   * @example
   * cursor.eraseToDown();
   */
  eraseToDown() {
    return this.erase(0, this._y, this._width - 1, this._height - 1);
  }

  /**
   * Erase from current line to up.
   *
   * @returns {Cursor}
   * @example
   * cursor.eraseToUp();
   */
  eraseToUp() {
    return this.erase(0, 0, this._width - 1, this._y);
  }

  /**
   * Erase current line.
   *
   * @returns {Cursor}
   * @example
   * cursor.eraseLine();
   */
  eraseLine() {
    return this.erase(0, this._y, this._width - 1, this._y);
  }

  /**
   * Erase the entire screen.
   *
   * @returns {Cursor}
   * @example
   * cursor.eraseScreen();
   */
  eraseScreen() {
    return this.erase(0, 0, this._width - 1, this._height - 1);
  }

  /**
   * Save current terminal contents into the buffer.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   * @example
   * cursor.saveScreen();
   */
  saveScreen() {
    this._stream.write(encodeToVT100('[?47h'));
    return this;
  }

  /**
   * Restore terminal contents to previously saved via {@link saveScreen}.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   * @example
   * cursor.restoreScreen();
   */
  restoreScreen() {
    this._stream.write(encodeToVT100('[?47l'));
    return this;
  }

  /**
   * Set the terminal cursor invisible.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   * @example
   * cursor.hideCursor();
   */
  hideCursor() {
    this._stream.write(encodeToVT100('[?25l'));
    return this;
  }

  /**
   * Set the terminal cursor visible.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   * @example
   * cursor.showCursor();
   */
  showCursor() {
    this._stream.write(encodeToVT100('[?25h'));
    return this;
  }

  /**
   * Reset all terminal settings.
   * Applies immediately without calling {@link flush}.
   *
   * @returns {Cursor}
   * @example
   * cursor.reset();
   */
  reset() {
    this._stream.write(encodeToVT100('c'));
    return this;
  }

  /**
   * Wrapper around `new Cursor()`.
   *
   * @static
   * @returns {Cursor}
   */
  static create(...args) {
    return new this(...args);
  }
}
