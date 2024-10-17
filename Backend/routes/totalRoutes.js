import express from 'express';
import { getTotals } from '../Controller/totalController.js';

const router = express.Router();

// Define the route for fetching totals and map it to the controller
router.get('/totals', getTotals);

export default router;
