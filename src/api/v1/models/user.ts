/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name: 
 *          type: string
 *         email:
 *          type: string
 *         role:
 *          type: string
 *         password:
 *          type: string
 */
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role?: string;
    created_at: Date;
    update_at: Date;
};
