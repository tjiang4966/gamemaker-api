import { NextFunction, Request, Response, Router } from "express";
import { authenticateUserLogin } from "../helpers/middlewares/authentications";
import { DataSourceInstance } from "../classes/DataConnection";
import { User } from "../entities/User";

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

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /user/self:
 *   get:
 *     summary: Get the authenticated user's information.
 *     tags:
 *       - User
 *     security:
 *       - JWT: []
 *     responses:
 *       200:
 *         description: Successful response with user information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
router.get('/self', authenticateUserLogin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await DataSourceInstance.manager.findOneBy(User, { id: req.user?.id})
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;