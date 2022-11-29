import {Router} from 'express';

import {fakerController} from '../controllers/fakerController.js';

const router = new Router();

router.get('/faker', async (req, res) => await fakerController(req, res));

export default router;
