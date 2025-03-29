/**
 * @openapi
 * components:
 *   schemas:
 *     Branch:
 *       type: object
 *       properties:
 *         name: 
 *          type: string
 *         address:
 *          type: string
 */
export interface Branch {
    id: string;
    name: string;
    address: string;
}