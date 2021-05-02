const router = require('express').Router();

router.post('/create', function(req, res) {
    res.status(200).send("Deprecated endpoint");
});

module.exports = router;