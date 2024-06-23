class SudokuSolver {
  validate(puzzleString) {
    const regex = /^[0-9.]+$/;
    if (!regex.test(puzzleString)) return "Invalid characters in puzzle";
    if (puzzleString.length !== 81)
      return "Expected puzzle to be 81 characters long";
    return puzzleString;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowValues = puzzleString.slice(row * 9, (row + 1) * 9 - 1);

    // the value is in the row
    if (rowValues.indexOf(value) > -1) return false;

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let columnValues = "";

    for (var i = 0; i < 9; i++) {
      columnValues += puzzleString[column + 9 * i];
    }

    //The value exists in the row
    if (columnValues.indexOf(value) > -1) return false;

    return true;
  }

  /**
   * Checks if a given value can be placed in the specified region of the puzzle.
   *
   * @param {string} puzzleString - The puzzle string representation.
   * @param {number} row - The row index (1-based) of the cell to check.
   * @param {number} column - The column index (1-based) of the cell to check.
   * @param {number} value - The value to check for placement.
   * @returns {boolean} - True if the value can be placed in the specified region, false otherwise.
   */
  checkRegionPlacement(puzzleString, row, column, value) {
    let region = "";

    const colStart = Math.floor(column / 3);
    const rowStart = Math.floor(row / 3);
    const index = colStart * 3 + rowStart * 27;
    // Isolate the values from the region

    for (var i = 0; i < 3; i++) {
      region += puzzleString.slice(index + i * 9, index + i * 9 + 3);
    }
    // Value is already in the region
    if (region.indexOf(value) > -1) return false;

    return true;
  }

  solve(input) {
    const board = input
      .split("")
      .map((char) => (char === "." ? 0 : parseInt(char)));
    const N = 9;

    function isValid(num, row, col) {
      for (let i = 0; i < N; i++) {
        if (board[row * 9 + i] === num || board[i * 9 + col] === num) {
          return false;
        }
      }

      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          if (board[i * 9 + j] === num) {
            return false;
          }
        }
      }

      return true;
    }

    function solutionCheck() {
      for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
          if (board[row * 9 + col] === 0) {
            for (let num = 1; num <= N; num++) {
              if (isValid(num, row, col)) {
                board[row * 9 + col] = num;
                if (solutionCheck()) {
                  return true;
                }
                board[row * 9 + col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    }
    solutionCheck();
    return board.join("").replaceAll("0", ".");
  }
}

module.exports = SudokuSolver;
