const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectedUnauthenticated,
} = require('../modules/authentication-middleware');

router.get('/', rejectedUnauthenticated, (req, res) => {
  console.log('req.user:', req.user);
  const clearanceLevel = req.user.clearance_level;
  const queryText = `SELECT "secret".* FROM "secret"
        WHERE "secret".secrecy_level <= $1;`;
  pool
    .query(queryText, [clearanceLevel])
    .then((results) => res.send(results.rows))
    .catch((error) => {
      console.log('Error making SELECT for secrets:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
