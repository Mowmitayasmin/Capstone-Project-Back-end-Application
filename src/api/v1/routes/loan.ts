import express, { Router } from 'express';
import { approve, create, remove, review, getAll, loanDetails } from '../controllers/loan';
import { validateRequest } from '../middleware/validate';
import { loanSchema } from '../validation/loan';

const router: Router = express.Router();
/**
 * @openapi
 * /loan/create:
 *   post:
 *     summary: Create a new loan
 *     description: Create a new loan application.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Loan"
 *     responses:
 *       201:
 *         description: Loan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan created successfully"
 *                 item:
 *                   $ref: "#/components/schemas/Loan"
 */
router.post('/create',validateRequest(loanSchema), create)
/**
 * @openapi
 * /loan/{id}/review:
 *   put:
 *     summary: Review a loan
 *     description: Mark a loan as reviewed.
 *     tags: [Loans]
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
 *         description: Loan reviewed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reviewed successfully"
 *                 loan:
 *                   $ref: "#/components/schemas/Loan"
 */
router.put('/:id/review',review)
/**
 * @openapi
 * /loan/{id}/approve:
 *   put:
 *     summary: Approve a loan
 *     description: Mark a loan as approved.
 *     tags: [Loans]
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
 *         description: Loan approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Approved successfully"
 *                 loan:
 *                   $ref: "#/components/schemas/Loan"
 */
router.put('/:id/approve', approve)
/**
 * @openapi
 * /loan:
 *   get:
 *     summary: Get all loans
 *     description: Retrieve a list of all loans.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of loans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Loan"
 */
router.get('/', getAll)
/**
 * @openapi
 * /loan/{id}:
 *   delete:
 *     summary: Get a loan
 *     description: Get an existing loan details.
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Get loan details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Get loan details successfully"
 */
router.get(
    "/:id",
    loanDetails
);
/**
 * @openapi
 * /loan/{id}:
 *   delete:
 *     summary: Delete a loan
 *     description: Delete an existing loan.
 *     tags: [Loans]
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
 *         description: Loan deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Loan deleted successfully"
 */
router.delete(
    "/:id/delete",
    remove
);

export default router