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
    // const regex = /^([0-9])\\1{1,}$/;

    //// checks if digit appears only once, could be useful
    // const nodots = rowValues.replace(/\./g, "");
    // const regex = /(.).*\1/;
    // if (regex.test(nodots)) return false;
    ////////////////////////////////////////////////////////////////

    // the value is in the row
    if (rowValues.indexOf(value) > -1) return false;
    // Spot already used
    // if (rowValues[column] !== ".") return false;
    // for (var i = 0; i < rowValues.length; i++){
    //   if (rowValues[i] === value) return false;
    // }
    return true;
    // for (let i = 0; i < 9; i++) {
    //   rowValues.push(puzzleString[row * 9 + i]);
    // }

    // const rowStart = (row - 1) * 9;
    // const rowEnd = rowStart + 9;
    // for (let i = rowStart; i < rowEnd; i++) {
    //   if (puzzleString[i] === value.toString()) return false;
    // }
    // return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let columnValues = "";

    for (var i = 0; i < 9; i++) {
      columnValues += puzzleString[column + 9 * i];
    }

    // console.log({ puzzleString, column, columnValues });
    //The value exists in the row
    if (columnValues.indexOf(value) > -1) return false;
    // Spot already used
    // if (columnValues[row] !== ".") return false;
    return true;
    ///////////////
    // const columnValues = [];

    // for (var i = 0; i < 9; i++) {
    //   columnValues.push(puzzleString[column + 9 * i]);
    // }
    // console.log({ puzzleString, column, columnValues });
    // return true;
    /////////////////////
    // for (let i = 0; i < 9; i++) {
    //   columnValues.push(puzzleString[row * 9 + i]);
    // }

    // const colStart = (column - 1) * 9;
    // const colEnd = colStart + 9;
    // for (let i = colStart; i < colEnd; i++) {
    //   if (puzzleString[i] === value.toString()) return false;
    // }
    // return true;
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
      // region += puzzleString.slice(colStart*rowStart, colStart*colStart + 3)
      // columnValues += puzzleString[column + 9 * i];
    }
    // Value is already in the region
    if (region.indexOf(value) > -1) return false;
    // const ind = row * 9 + column;
    // Spot already used
    // if (puzzleString[ind] !== ".") return false;

    // for (let i = 0; i < 3; i++) {
    //   const rowStart = 27 * i + Math.floor(column / 3);
    //   region += puzzleString.slice(rowStart, rowStart + 3);

    //   // const rowStart = Math.floor(column / 3 - 1);
    //   // console.log(rowStart);
    //   // puzzleString.slice(rowStart, rowStart + 3);
    // }
    // console.log({ puzzleString, row, column, region });
    // for(let i = 0; i <3; i++) {
    //   for(let j = 0; j < 3; j++) {
    //     region += puzzleString[i * 9 + j + (column - 1) * 3];
    //   }
    // }

    // const rowStart = Math.floor((row - 1) / 3) * 3;
    // const rowEnd = rowStart + 3;
    // const colStart = Math.floor((column - 1) / 3) * 3;
    // const colEnd = colStart + 3;
    // for (let i = rowStart; i < rowEnd; i++) {
    //   for (let j = colStart; j < colEnd; j++) {
    //     if (puzzleString[i * 9 + j] === value.toString()) return false;
    //   }
    // }
    // console.log("checkRegionPlacement: ", true);
    return true;
  }

  solve(input) {
    const board = input
      .split("")
      .map((char) => (char === "." ? 0 : parseInt(char)));
    const N = 9;
    console.log({ board });

    function isValid(num, row, col) {
      // return (
      //   this.checkRowPlacement(input, row, col, num) &&
      //   this.checkColPlacement(input, row, col, num) &&
      //   this.checkRegionPlacement(input, row, col, num)
      // );

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
          // console.log("boardwhat", board[row * 9 + col]);
          if (board[row * 9 + col] === 0) {
            for (let num = 1; num <= N; num++) {
              // const isValid =
              //   this.checkRowPlacement(input, row, col, num) &&
              //   this.checkColPlacement(input, row, col, num) &&
              //   this.checkRegionPlacement(input, row, col, num);

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

  // solve(puzzleString) {
  //   // this.matrixFormat(puzzleString);
  //   for (var row = 0; row < 9; row++) {
  //     for (var col = 0; col < 9; col++) {
  //       if (puzzleString[row * 9 + col] === ".") {
  //         let solutions = [];
  //         for (var value = 1; value < 10; value++) {
  //           if (
  //             this.checkRowPlacement(puzzleString, row, col, value) &&
  //             this.checkColPlacement(puzzleString, row, col, value) &&
  //             this.checkRegionPlacement(puzzleString, row, col, value)
  //           ) {
  //             const newString =
  //               puzzleString.slice(0, row * 9 + col) +
  //               value +
  //               puzzleString.slice(row * 9 + col + 1, puzzleString.length);
  //             // puzzleString = newString;

  //             // solutions.push({ row, col, value });
  //             solutions.push(newString);
  //             // return this.solve(puzzleString);
  //           }
  //         }
  //         if (solutions.length === 1) {
  //           puzzleString = solutions[0];
  //           return this.solve(puzzleString);
  //         } else {
  //           while (solutions.length > 1) {
  //             if (typeof solutions !== "string") {
  //               // console.log(solutions);
  //               // return this.solve(solutions.pop());
  //               const poppedSol = solutions.pop();
  //               console.log(poppedSol);
  //               return this.solve(poppedSol);
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   return puzzleString;
  // }
  matrixFormat(puzzleString) {
    const matrix = [];

    for (let i = 0; i < 9; i++) {
      //
      const theSubstr = puzzleString.slice(i * 9, (i + 1) * 9);
      matrix.push(theSubstr);
    }
    // matrix.forEach((row, index) => {});

    console.log(matrix);
  }
}

module.exports = SudokuSolver;
