const router = require('express').Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

router.get('/settings', settingsController.getSettings);
router.put('/settings', auth, authAdmin, settingsController.updateSettings);

module.exports = router;
