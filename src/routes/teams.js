
const router = require('express').Router();
const a = require('../middlewares/authMiddleware');
const r = require('../middlewares/roleMiddleware');
const c = require('../controllers/teamController');

router.get('/', a, r(['admin','manager','viewer']), c.list);
router.post('/', a, r(['admin','manager']), c.create);
router.put('/:id', a, r(['admin','manager']), c.update);
router.delete('/:id', a, r(['admin']), c.remove);

module.exports = router;
