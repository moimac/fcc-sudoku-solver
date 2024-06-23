"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // value has to be a number between 1 and 9
    if (!puzzle || !coordinate || !value)
      return res.json({ error: "Required field(s) missing" });
    if (!/^[A-I][1-9]$/.test(coordinate))
      return res.json({ error: "Invalid coordinate" });
    if (!/^[1-9]$/.test(value)) return res.json({ error: "Invalid value" });
    const validatedPuzzle = solver.validate(puzzle);
    if (validatedPuzzle !== puzzle) return res.json({ error: validatedPuzzle });

    const row = coordinate[0].toLowerCase().charCodeAt(0) - 97;
    const col = parseInt(coordinate[1]) - 1;
    const valAtCoord = validatedPuzzle[row * 9 + col];
    if (valAtCoord === value) return res.json({ valid: true });
    const conflict = [];
    if (!solver.checkRegionPlacement(puzzle, row, col, value))
      conflict.push("region");
    if (!solver.checkRowPlacement(puzzle, row, col, value))
      conflict.push("row");
    if (!solver.checkColPlacement(puzzle, row, col, value))
      conflict.push("column");
    if (conflict.length > 0)
      return res.json({ valid: false, conflict: conflict });
    if (valAtCoord !== ".") return res.json({ valid: false });
    return res.json({ valid: true });
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;
    // if no puzzle is provided, return an error message
    if (!puzzle) return res.json({ error: "Required field missing" });
    // regular expression for a string containing only numbers and "."
    const validatedPuzzle = solver.validate(puzzle);
    if (validatedPuzzle !== puzzle) return res.json({ error: validatedPuzzle });
    let solution = solver.solve(validatedPuzzle);
    if (solution.indexOf(".") > -1) {
      return res.json({ error: "Puzzle cannot be solved" });
    }
    console.log({ puzzle, solution });
    return res.json({ solution });
  });
};
