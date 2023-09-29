import { Router } from "express";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         displayName:
 *           type: string
 *         googleId:
 *           type: string
 *         provider:
 *           type: string
 *       # Define the relationships (OneToMany) to other entities if needed
 */

router.get('/');

export default router;