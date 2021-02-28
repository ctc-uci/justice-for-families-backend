const router = require('express').Router()

router.get('/', function(req, res) {
    tags = ["resources", "j4f", "queens", "community", "rules", "newfacilities"];
    res.send(tags);
})

module.exports = router;