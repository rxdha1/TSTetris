import { init } from './config';
import { playground } from './playground';

export const tetromino = {
  number: 0,
  position: 0,
  rotation: 0,
  current: [],
  theTetrominoes: [],
  createTetrominoes() {
    const iTetromino = [
      [1, init.columns + 1, init.columns * 2 + 1, init.columns * 3 + 1],
      [0, 1, 2, 3],
      [1, init.columns + 1, init.columns * 2 + 1, init.columns * 3 + 1],
      [0, 1, 2, 3],
    ];
    const llTetromino = [
      [0, init.columns, init.columns + 1, init.columns + 2],
      [1, 2, init.columns + 1, init.columns * 2 + 1],
      [0, 1, 2, init.columns + 2],
      [1, init.columns + 1, init.columns * 2, init.columns * 2 + 1],
    ];
    const lrTetromino = [
      [2, init.columns, init.columns + 1, init.columns + 2],
      [1, init.columns + 1, init.columns * 2 + 1, init.columns * 2 + 2],
      [0, 1, 2, init.columns],
      [0, 1, init.columns + 1, init.columns * 2 + 1],
    ];
    const oTetromino = [
      [1, 2, init.columns + 1, init.columns + 2],
      [1, 2, init.columns + 1, init.columns + 2],
      [1, 2, init.columns + 1, init.columns + 2],
      [1, 2, init.columns + 1, init.columns + 2],
    ];
    const sTetromino = [
      [1, 2, init.columns, init.columns + 1],
      [1, init.columns + 1, init.columns + 2, init.columns * 2 + 2],
      [1, 2, init.columns, init.columns + 1],
      [1, init.columns + 1, init.columns + 2, init.columns * 2 + 2],
    ];
    const zTetromino = [
      [0, 1, init.columns + 1, init.columns + 2],
      [2, init.columns + 1, init.columns + 2, init.columns * 2 + 1],
      [0, 1, init.columns + 1, init.columns + 2],
      [2, init.columns + 1, init.columns + 2, init.columns * 2 + 1],
    ];
    const tTetromino = [
      [1, init.columns, init.columns + 1, init.columns + 2],
      [1, init.columns + 1, init.columns + 2, init.columns * 2 + 1],
      [0, 1, 2, init.columns + 1],
      [2, init.columns + 1, init.columns + 2, init.columns * 2 + 2],
    ];

    return [iTetromino, llTetromino, lrTetromino, oTetromino, sTetromino, zTetromino, tTetromino];
  },
  initTetromino() {
    console.log('init new tetromino');
    init.gameStatut === 'notStarted' ? (this.theTetrominoes = this.createTetrominoes()) : null;
    this.position = Math.floor(init.columns / 2 - 1);
    this.number = Math.floor(Math.random() * this.theTetrominoes.length);
    console.log('tetromino number', this.number);
    this.rotation = Math.floor(Math.random() * this.theTetrominoes[this.number].length);
    this.current = this.theTetrominoes[this.number][this.rotation];
  },
  rotateTetromino(direction) {
    let tempRotationIndex = this.rotation;
    direction === 'right' ? tempRotationIndex++ : tempRotationIndex--;
    tempRotationIndex >= this.theTetrominoes[this.number].length ? (tempRotationIndex = 0) : null;
    tempRotationIndex < 0
      ? (tempRotationIndex = this.theTetrominoes[this.number].length - 1)
      : null;
    // testing boudaries
    const tempTetromino = this.theTetrominoes[this.number][tempRotationIndex];
    const willTouchLimits = tempTetromino.some((index) => {
      return playground.blocks[this.position + index + init.columns].classList.contains('taken');
    });

    const isAtRightEdge = tempTetromino.some((index) => {
      return (index + this.position) % init.columns === 0;
    });

    const isAtLeftEdge = tempTetromino.some((index) => {
      return (index + this.position + 1) % init.columns === 0;
    });
    if (willTouchLimits || (isAtRightEdge && isAtLeftEdge)) {
      console.log('rotation not possible due to boudaries conflict');
    } else {
      this.undraw();
      this.current = tempTetromino;
      this.rotation = tempRotationIndex;
      this.draw();
    }
  },
  draw() {
    this.current.forEach((index) => {
      playground.blocks[this.position + index].classList.add('tetromino');
      playground.blocks[this.position + index].classList.add('colorT' + this.number.toString());
    });
  },
  drawNew() {
    this.initTetromino();
    this.draw();
  },
  undraw() {
    this.current.forEach((index) => {
      playground.blocks[this.position + index].className = 'playgroundBlock';
    });
  },
  moveDown() {
    this.undraw();
    this.position += init.columns;
    this.draw();
  },
  moveLeft() {
    const isAtLeftEdge = this.current.some((index) => {
      return (index + this.position) % init.columns === 0;
    });
    if (!isAtLeftEdge && !this.lateralBlock('left')) {
      this.undraw();
      this.position--;
      this.draw();
    } else {
      console.log('left boudary prevents tetromino movement');
    }
  },
  pushDown() {
    if (playground.deletingAnimation !== 'init') {
      return;
    }
    if (!this.freeze()) {
      this.undraw();
      this.position += init.columns;
      this.draw();
    } else {
      console.log('bottom boudary prevents tetromino movement');
    }
  },
  moveRight() {
    const isAtRightEdge = this.current.some((index) => {
      return (index + this.position + 1) % init.columns === 0;
    });
    if (!isAtRightEdge && !this.lateralBlock('right')) {
      this.undraw();
      this.position++;
      this.draw();
    } else {
      console.log('right boudary prevents tetromino movement');
    }
  },
  // when the current tetromino encouters a boundary it will freeze and become part of the boudaries.
  freeze() {
    const freezeCondition = this.current.some((index) =>
      playground.blocks[this.position + index + init.columns].classList.contains('taken')
    );
    if (freezeCondition) {
      console.log('TOUCH DOWN! new tetromino in the way');
      this.current.forEach((index) => {
        playground.blocks[index + this.position].classList.add('taken');
      });
      return true;
    }
    return false;
  },
  lateralBlock(side) {
    let checkSide;
    side === 'right' ? (checkSide = 1) : (checkSide = -1);
    return this.current.some((index) =>
      playground.blocks[this.position + index + checkSide].classList.contains('taken')
    );
  },
};