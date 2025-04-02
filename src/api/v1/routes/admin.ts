import express, { Router } from 'express';
import { customClaims } from '../controllers/admin';

const router: Router = express.Router();

/**
 * @openapi
 * /admin/set-custom-claims:
 *   post:
 *     summary: Set custom user claims (Admin only)
 *     description: Assign custom permissions/roles to a user (e.g., admin access, branch assignment)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - role
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               role:
 *                 type: string
 *                 example: "admin"

 *     responses:
 *       200:
 *         description: Custom claims set successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Custom claims updated successfully"
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *       403:
 *         description: Unauthorized (admin access required)
 *       404:
 *         description: User not found
 */
router.post('/set-custom-claims', customClaims);

export default router;