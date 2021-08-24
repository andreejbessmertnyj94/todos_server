const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.post('/create', controller.create);
router.get('/list', controller.list);
router.patch('/list/update', controller.updateAll);
router.patch('/:id/update', controller.update);
router.delete('/list/delete', controller.deleteAll);
router.delete('/:id/delete', controller.delete);

module.exports = router;
