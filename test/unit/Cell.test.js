import {assert} from 'chai';
import sinon from 'sinon';
import Cell from '../../src/Cell';

describe('Cell', () => {
  it('Should properly create cell with default arguments', () => {
    const cell = new Cell();

    assert.instanceOf(cell, Cell);
    assert.equal(cell._char, ' ');
    assert.equal(cell._x, 0);
    assert.equal(cell._y, 0);
    assert.equal(cell._background, 'none');
    assert.equal(cell._foreground, 'none');
    assert.deepEqual(cell._display, {
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  });

  it('Should properly create cell with custom arguments', () => {
    const cell = new Cell(' ', {
      x: 10,
      y: 10,
      background: 'white',
      foreground: 'black',
      display: {bold: true}
    });

    assert.instanceOf(cell, Cell);
    assert.equal(cell._char, ' ');
    assert.equal(cell._x, 10);
    assert.equal(cell._y, 10);
    assert.equal(cell._background, 'WHITE');
    assert.equal(cell._foreground, 'BLACK');
    assert.deepEqual(cell._display, {
      bold: true,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  });

  it('Should properly get/set char', () => {
    const cell = new Cell();

    assert.equal(cell.getChar(), ' ');
    assert.instanceOf(cell.setChar('t'), Cell);
    assert.equal(cell.getChar(), 't');
    assert.instanceOf(cell.setChar('long text'), Cell);
    assert.equal(cell.getChar(), 'l');
  });

  it('Should properly get/set X coordinate', () => {
    const cell = new Cell();

    assert.equal(cell.getX(), 0);
    assert.instanceOf(cell.setX(40), Cell);
    assert.equal(cell.getX(), 40);
    assert.instanceOf(cell.setX(50.99), Cell);
    assert.equal(cell.getX(), 50);
  });

  it('Should properly get/set Y coordinate', () => {
    const cell = new Cell();

    assert.equal(cell.getY(), 0);
    assert.instanceOf(cell.setY(40), Cell);
    assert.equal(cell.getY(), 40);
    assert.instanceOf(cell.setY(50.99), Cell);
    assert.equal(cell.getY(), 50);
  });

  it('Should properly get/set background color', () => {
    const cell = new Cell();

    assert.equal(cell.getBackground(), 'none');
    assert.instanceOf(cell.setBackground('black'), Cell);
    assert.equal(cell.getBackground(), 'BLACK');
    assert.instanceOf(cell.setBackground(), Cell);
    assert.equal(cell.getBackground(), 'none');
  });

  it('Should properly get/set foreground color', () => {
    const cell = new Cell();

    assert.equal(cell.getForeground(), 'none');
    assert.instanceOf(cell.setForeground('black'), Cell);
    assert.equal(cell.getForeground(), 'BLACK');
    assert.instanceOf(cell.setForeground(), Cell);
    assert.equal(cell.getForeground(), 'none');
  });

  it('Should properly get/set display modes', () => {
    const cell = new Cell();

    assert.deepEqual(cell.getDisplay(), {
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });

    assert.instanceOf(cell.setDisplay(true, false, true, false, false, false), Cell);
    assert.deepEqual(cell.getDisplay(), {
      bold: true,
      dim: false,
      underlined: true,
      blink: false,
      reverse: false,
      hidden: false
    });

    assert.instanceOf(cell.setDisplay(), Cell);
    assert.deepEqual(cell.getDisplay(), {
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  });

  it('Should properly mark cell as modified', () => {
    const cell = new Cell();

    assert.notOk(cell.isModified());
    assert.instanceOf(cell.setModified(false), Cell);
    assert.notOk(cell.isModified());
    assert.instanceOf(cell.setModified(), Cell);
    assert.ok(cell.isModified());
  });

  it('Should properly reset the cell contents and display settings', () => {
    const cell = new Cell();
    const mock = sinon.mock(cell);

    mock.expects('setChar').once().withExactArgs(' ').returns(cell);
    mock.expects('setBackground').once().withExactArgs('none').returns(cell);
    mock.expects('setForeground').once().withExactArgs('none').returns(cell);
    mock.expects('setDisplay').once().withExactArgs(false, false, false, false, false, false).returns(cell);

    assert.instanceOf(cell.reset(), Cell);
    mock.verify();
  });

  it('Should properly convert Cell into ASCII sequence', () => {
    const cell = new Cell();

    assert.equal(cell.toString(), '\u001b[1;1f \u001b[0m');
    assert.instanceOf(cell.setX(20), Cell);
    assert.equal(cell.toString(), '\u001b[1;21f \u001b[0m');
    assert.instanceOf(cell.setY(10), Cell);
    assert.equal(cell.toString(), '\u001b[11;21f \u001b[0m');
    assert.instanceOf(cell.setBackground('black'), Cell);
    assert.equal(cell.toString(), '\u001b[11;21f\u001b[48;5;0m \u001b[0m');
    assert.instanceOf(cell.setForeground('white'), Cell);
    assert.equal(cell.toString(), '\u001b[11;21f\u001b[48;5;0m\u001b[38;5;15m \u001b[0m');
    assert.instanceOf(cell.setDisplay(true, true, true, true, true, true), Cell);
    assert.equal(cell.toString(), '\u001b[11;21f\u001b[48;5;0m\u001b[38;5;15m\u001b[1m\u001b[2m\u001b[4m\u001b[5m\u001b[7m\u001b[8m \u001b[0m');
  });

  it('Should properly create Cell instance from static create()', () => {
    const cell = Cell.create(' ', {x: 10, y: 20});

    assert.instanceOf(cell, Cell);
    assert.equal(cell._char, ' ');
    assert.equal(cell._x, 10);
    assert.equal(cell._y, 20);
    assert.equal(cell._background, 'none');
    assert.equal(cell._foreground, 'none');
    assert.deepEqual(cell._display, {
      bold: false,
      dim: false,
      underlined: false,
      blink: false,
      reverse: false,
      hidden: false
    });
  })
});
