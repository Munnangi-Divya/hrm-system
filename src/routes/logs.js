const router = require('express').Router();
const a = require('../middlewares/authMiddleware');
const r = require('../middlewares/roleMiddleware');
const c = require('../controllers/logController');

router.get('/', a, r(['admin']), c.list);

module.exports = router;
