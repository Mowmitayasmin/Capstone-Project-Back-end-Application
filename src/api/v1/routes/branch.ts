import express, { Router } from 'express';
import { getAll, create, branchDetails, update, remove } from '../controllers/branch';
import { validateRequest } from '../middleware/validate';
import { branchSchema } from '../validation/branch';

const router: Router = express.Router();

/**
 * @openapi
 * /branch/create:
 *   post:
 *     summary: Create a new branch
 *     description: Register a new branch location
 *     tags: [Branches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Branch"
 *     responses:
 *       201:
 *         description: Branch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Branch created successfully"
 *                 branch:
 *                   $ref: "#/components/schemas/Branch"
 */
router.post('/create', validateRequest(branchSchema), create);

/**
 * @openapi
 * /branch:
 *   get:
 *     summary: Get all branches
 *     description: Retrieve a list of all branches
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of branches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Branch"
 */
router.get('/', getAll);

/**
 * @openapi
 * /branch/{id}:
 *   get:
 *     summary: Get branch details
 *     description: Get details of a specific branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Branch details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Branch"
 */
router.get('/:id', branchDetails);

/**
 * @openapi
 * /branch/{id}:
 *   put:
 *     summary: Update branch
 *     description: Update branch information
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Branch"
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Branch updated successfully"
 *                 branch:
 *                   $ref: "#/components/schemas/Branch"
 */
router.put('/:id', update);

/**
 * @openapi
 * /branch/{id}:
 *   delete:
 *     summary: Delete branch
 *     description: Delete a branch
 *     tags: [Branches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Branch deleted successfully"
 */
router.delete('/:id', remove);

export default router;