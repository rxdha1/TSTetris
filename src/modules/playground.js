import { init, configPanel } from './config';

export const playground = {
  blocks: [],
  deletingAnimation: 'init',
  generatePlaygroundGrid() {
    console.log('generating playground blocks');
    const playground = document.getElementById('playground');
    const root = document.querySelector('html');
    root.style.setProperty('--columns', init.columns);
    root.style.setProperty('--rows', init.rows);
    root.style.setProperty('--block-width', init.blockSize + 'px');
    const numberOfBlocks = init.rows * init.columns;
    for (let i = 0; i < numberOfBlocks; i++) {
      let div = document.createElement('div');
      div.className = 'playgroundBlock';
      init.devMode ? (div.innerHTML = i) : null;
      playground.appendChild(div);
    }
    for (let i = 0; i < init.columns; i++) {
      let div = document.createElement('div');
      div.className = 'playgroundBottom taken';
      playground.appendChild(div);
    }
    this.blocks = Array.from(document.querySelectorAll('.grid div'));
    console.log(`${numberOfBlocks} blocks have been generated`);
  },
  cleanPlaygroundGrid() {
    const playgroundToClean = document.getElementById('playground');
    while (playgroundToClean.firstChild) {
      playgroundToClean.removeChild(playgroundToClean.firstChild);
    }
  },
  handleConfigUpdate() {
    console.log('update configuration');
    const haveRowsAndColumnsChanged = configPanel.updateGameConfiguration();
    console.log(haveRowsAndColumnsChanged);
    if (haveRowsAndColumnsChanged) {
      this.cleanPlaygroundGrid();
      this.generatePlaygroundGrid();
    }
  },
  lineIsMade() {
    let checkLine = [];
    let lineToDelete = [];
    for (let i = 0; i < init.columns; i++) {
      checkLine.push(i);
    }
    for (let i = 0; i < init.rows; i++) {
      const lineTaken = checkLine.every((index) => {
        return (
          this.blocks[i * init.columns + index].classList.contains('taken') ||
          this.blocks[i * init.columns + index].classList.contains('tetromino')
        );
      });
      lineTaken ? lineToDelete.push(i) : null;
    }
    lineToDelete.length ? console.log('line complete', lineToDelete) : 0;
    return lineToDelete;
  },
  animateDeleteLine(lineToDelete) {
    for (let i = 0; i < init.columns; i++) {
      lineToDelete.forEach(
        (index) =>
          (this.blocks[init.columns * index + i].className = 'playgroundBlock taken erasing')
      );
    }
  },
  deleteLine(lineArray) {
    for (let j = 0; j < lineArray.length; j++) {
      let saveUpperBlockStyle = [];
      console.log(`deleting line ${lineArray[j]}`);
      for (let i = 0; i < lineArray[j] * init.columns; i++) {
        saveUpperBlockStyle.push(this.blocks[i].className);
        this.blocks[i].className = 'playgroundBlock';
      }
      for (let i = 0; i < lineArray[j] * init.columns; i++) {
        let bottomCheck = this.blocks[i + init.columns].className;
        !bottomCheck.includes('playgroundBottom')
          ? (this.blocks[i + init.columns].className = saveUpperBlockStyle[i])
          : null;
      }
    }
  },
};