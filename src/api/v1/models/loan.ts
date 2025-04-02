/**
 * @openapi
 * components:
 *   schemas:
 *     Loan:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name: 
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         is_reviewed:
 *           type: boolean
 *         is_approved:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         update_at:
 *           type: string
 *           format: date-time
 *       required:
 *         - id
 *         - name
 *         - description
 *         - is_reviewed
 *         - is_approved
 */
export type Loan = {
    id: string,
    name: string;
    description: string;
    price?: number;
    created_at: Date;
    updated_at: Date;
    is_reviewed: Boolean;
    is_approved: Boolean
};
