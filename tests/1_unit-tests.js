const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
  // Logic handles a valid puzzle string of 81 characters
  test("Logic handles a valid puzzle string of 81 characters", () => {
    assert.equal(
      solver.validate(
        "123456789987654321765432189631789452489215637517863492345972186269348751872156943"
      ),
      "123456789987654321765432189631789452489215637517863492345972186269348751872156943"
    );
  });

  // Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
    assert.equal(
      solver.validate(
        "123456789987654321765432189631789452489215637517863492345972186269348751872156943a"
      ),
      "Invalid characters in puzzle"
    );
  });

  // Logic handles a puzzle string that is not 81 characters in length
  test("Logic handles a puzzle string that is not 81 characters in length", () => {
    assert.equal(
      solver.validate(
        "1234567899876543217654321896317894524892156375178634923459721862693487215694"
      ),
      "Expected puzzle to be 81 characters long"
    );
  });

  // Logic handles a valid row placement
  test("Logic handles a valid row placement", () => {
    assert.equal(
      solver.checkRowPlacement(
        ".234567892.......................................................................",
        0,
        0,
        1
      ),
      true
    );
  });

  // Logic handles an invalid row placement
  test("Logic handles an invalid row placement", () => {
    var str = new Array(81 + 1).join(".").split("");
    str[0] = "1";
    str[2] = "2";
    str[4] = "3";
    str[7] = "4";
    str = str.join("");
    assert.equal(solver.checkRowPlacement(str, 0, 0, 2), false);
  });

  // Logic handles a valid column placement
  test("Logic handles a valid column placement", () => {
    var str = new Array(81 + 1).join(".").split("");
    str[0] = "1";
    str[9] = "2";
    str[27] = "3";
    str[36] = "4";
    str[54] = "7";
    str = str.join("");

    assert.equal(solver.checkColPlacement(str, 0, 0, 9), true);
  });

  // Logic handles an invalid column placement
  test("Logic handles an invalid column placement", () => {
    var str = new Array(81 + 1).join(".").split("");
    str[0] = "1";
    str[9] = "2";
    str[27] = "3";
    str[36] = "4";
    str[54] = "8";
    str = str.join("");

    assert.equal(solver.checkColPlacement(str, 0, 0, 8), false);
  });

  // Logic handles a valid region (3x3 grid) placement
  test("Logic handles a valid region (3x3 grid) placement", () => {
    var str = new Array(81 + 1).join(".").split("");
    str[0] = "1";
    str[9] = "2";
    str[10] = "3";
    str[11] = "4";
    str[19] = "8";
    str[20] = "9";
    str = str.join("");
    assert.equal(solver.checkRegionPlacement(str, 0, 0, 5), true);
  });

  // Logic handles an invalid region (3x3 grid) placement
  test("Logic handles an invalid region (3x3 grid) placement", () => {
    var str = new Array(81 + 1).join(".").split("");
    str[0] = "1";
    str[9] = "2";
    str[10] = "3";
    str[11] = "4";
    str[19] = "8";
    str[20] = "9";
    str = str.join("");
    assert.equal(solver.checkRegionPlacement(str, 0, 0, 1), false);
  });

  // Valid puzzle strings pass the solver
  test("Valid puzzle strings pass the solver", () => {
    assert.equal(
      solver.solve(
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      ),
      "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
    );
  });

  // Invalid puzzle strings fail the solver
  test("Invalid puzzle strings fail the solver", () => {
    assert.equal(
      solver.solve(
        ".79..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      ),
      ".79..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
    );
  });

  // Solver returns the expected solution for an incomplete puzzle
  test("Solver returns the expected solution for an incomplete puzzle", () => {
    assert.equal(
      solver.solve(
        "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
      ),
      "769235418851496372432178956174569283395842761628713549283657194516924837947381625"
    );
  });
});
