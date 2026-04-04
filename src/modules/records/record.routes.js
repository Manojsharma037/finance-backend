const router = require('express').Router();
const ctrl = require('./record.controller');
const auth = require('../../middleware/auth');
const guard = require('../../middleware/roleGuard');

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new financial record (Admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *               category:
 *                 type: string
 *                 example: salary
 *               date:
 *                 type: string
 *                 example: "2026-04-01"
 *               notes:
 *                 type: string
 *                 example: April salary
 *               for_user_id:
 *                 type: string
 *                 example: "69d0d94e6c5375729a84726a"
 *                 description: Optional - Admin can create record for any user
 */
router.post('/', auth, guard('admin'), ctrl.create);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all records with optional filters
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           example: "2026-01-01"
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           example: "2026-04-30"
 *     responses:
 *       200:
 *         description: List of records
 */
router.get('/', auth, ctrl.getAll);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update a record (Admin/Analyst only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated
 *       404:
 *         description: Record not found
 */
router.put('/:id', auth, guard('admin'), ctrl.update);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Soft delete a record (Admin only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       403:
 *         description: Access denied
 */
router.delete('/:id', auth, guard('admin'), ctrl.remove);

module.exports = router;