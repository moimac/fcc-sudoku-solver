const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

//.....1......82.........41.7..4..6.......32....9.7..81.14...83..93......2.82.6..9.

suite("Functional Tests", () => {
  // Solve a puzzle with valid puzzle string: POST request to /api/solve
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          ".....1......82.........41.7..4..6.......32....9.7..81.14...83..93......2.82.6..9.",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution.length, 81);
        assert.equal(
          res.body.solution,
          "325671948471829653869354127754186239618932574293745816147298365936517482582463791"
        );
        done();
      });
  });

  // Solve a puzzle with missing puzzle string: POST request to /api/solve
  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });

  // Solve a puzzle with invalid characters: POST request to /api/solve
  test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          ".....1......82.........41.7..4..6.......32....9.7..81.14...83..93......2.82.6..9a",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  // Solve a puzzle with incorrect length: POST request to /api/solve
  test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          ".....1......82.......41.7..4..6.......32....9.7..81.14...83..93......2.82.6..9.",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  // Solve a puzzle that cannot be solved: POST request to /api/solve
  test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          ".....1......22.........41.7..4..6.......32....9.7..81.14...83..93......2.82.6..9.",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });

  // Check a puzzle placement with all fields: POST request to /api/check
  test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          ".....1......82.........41.7..4..6.......32....9.7..81.14...83..93......2.82.6..9.",
        coordinate: "A1",
        value: "2",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });

  // Check a puzzle placement with single placement conflict: POST request to /api/check
  test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          ".....1......82.........41.7..4..6.......32....9.7..81.14...83..93......2.82.6..9.",
        coordinate: "A1",
        value: "9",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 1);
        assert.equal(res.body.conflict[0], "column");
        done();
      });
  });

  // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          ".....1......82.........41.7..4..6.......32....9.7..81.14...83..93......2.82.6..9.",
        coordinate: "A1",
        value: "1",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 2);
        assert.equal(res.body.conflict[0], "row");
        assert.equal(res.body.conflict[1], "column");
        done();
      });
  });

  // Check a puzzle placement with all placement conflicts: POST request to /api/check
  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          ".....1.." +
          "....82..." +
          "....3.41." +
          "7..4..6.." +
          ".....32.." +
          "..9...381" +
          ".14...83." +
          ".93......" +
          "2.82.6..9.",
        coordinate: "F4",
        value: "3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 3);
        assert.equal(res.body.conflict[0], "region");
        assert.equal(res.body.conflict[1], "row");
        assert.equal(res.body.conflict[2], "column");
        done();
      });
  });

  // Check a puzzle placement with missing required fields: POST request to /api/check
  test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  // Check a puzzle placement with invalid characters: POST request to /api/check
  test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          ".....1.." +
          "....82..." +
          "....3.41." +
          "7..4..6.." +
          ".....32.." +
          "..9...381" +
          ".14...83." +
          ".93......" +
          "2.82.6..9a",
        coordinate: "F4",
        value: "3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  // Check a puzzle placement with incorrect length: POST request to /api/check
  test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          ".....1.." +
          "....82..." +
          "....3.41." +
          "7..4..6.." +
          ".....32.." +
          "..9...381" +
          ".14...83." +
          ".93......" +
          "2.82.6..9...",
        coordinate: "F4",
        value: "3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          ".....1.." +
          "....82..." +
          "....3.41." +
          "7..4..6.." +
          ".....32.." +
          "..9...381" +
          ".14...83." +
          ".93......" +
          "2.82.6..9.",
        coordinate: "F44",
        value: "3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });

  // Check a puzzle placement with invalid placement value: POST request to /api/check
  test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          ".....1.." +
          "....82..." +
          "....3.41." +
          "7..4..6.." +
          ".....32.." +
          "..9...381" +
          ".14...83." +
          ".93......" +
          "2.82.6..9.",
        coordinate: "F4",
        value: "33",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});
