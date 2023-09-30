import { Router } from "express";
import { authenticated } from "../helpers/middlewares/authenticated";
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
 *     summary: Get the user's own profile
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'  # Reference to the User schema
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token
 *       '404':
 *         description: Not Found - User not found
 */
router.get('/self', authenticated, async (req, res, next) => {
  try {
    const user = await DataSourceInstance.manager.findOneBy(User, { id: (req.user as User).id})
    res.send({
      data: user,
    })
  } catch (err) {
    next(err);
  }
});

export default router;