import { NextFunction, Request, Response, Router } from "express";
import { authenticated } from "../helpers/middlewares/authentications";
import { requiredFields } from "../helpers/middlewares/requiredFields";
import { DataSourceInstance } from "../classes/DataConnection";
import { GameHasUser } from "../entities/GameHasUser";
import { Game } from "../entities/Game";
import { User } from "../entities/User";
import { RegisterStatusEnum } from "../classes/Enums";
import { logger } from "../helpers/logger";

const checkAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    return res.status(404).send({
      error: 'User Not Found'
    });
  }
  const gameHasUser = await DataSourceInstance.getRepository(GameHasUser).createQueryBuilder('ghu')
    .leftJoinAndSelect('ghu.user', 'user')
    .where('ghu.id = :ghuId', {ghuId: req.params.gameHasUserId})
    .getOne();
  if (!gameHasUser) {
    return res.status(404).send({
      error: 'GameHasUser Not Found'
    });
  }
  if (gameHasUser.user.id !== user.id) {
    return res.sendStatus(403);
  }
  (req as Record<string, any>).gameHasUser = gameHasUser;
  return next();
}

const router = Router();

/**
 * @swagger
 * tags:
 *   name: GameHasUser
 *   description: Game user registration management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     GameHasUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         game:
 *           $ref: '#/components/schemas/Game'  # Reference to the Game schema, update as needed
 *         user:
 *           $ref: '#/components/schemas/User'  # Reference to the User schema
 *         inGameName:
 *           type: string
 *         registerStatus:
 *           $ref: '#/components/schemas/RegisterStatusEnum'  # Reference to the RegisterStatusEnum schema, update as needed
 *         registerDate:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /gameHasUser:
 *   post:
 *     summary: Register a user for a game
 *     tags: [GameHasUser]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              game:
 *                type: number
 *                default: 0
 *              inGameName:
 *                type: string
 *                default: 'Random Name'
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       '404':
 *         description: Not Found - Either user or game not found
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token
 *       '400':
 *         description: Bad Request - Invalid request body or parameters
 *       '422':
 *         description: Unprocessable Entity - Duplicate records
 */
router.post('/', authenticated, requiredFields([
  'game', 'inGameName'
]), async (req, res, next) => {
  try {
    // validate that the user exists
    const user = await DataSourceInstance.manager.findOneBy(User, {id: req.user?.id})
    if (!user) {
      return res.status(404).send({
        error: 'User Not Found'
      });
    }
    // validate that the game exists
    const game = await DataSourceInstance.getRepository(Game).createQueryBuilder('game')
      .leftJoinAndSelect('game.gameHasUser', 'player')
      .where('game.id = :gameId AND game.deleted = 0', {gameId: req.body.game})
      .getOne();
    if (!game) {
      return res.status(404).send({
        error: 'Game Not Found'
      });
    }
    // check duplicate
    const dup = game.gameHasUser.some((player) => player.id === user.id);
    if (dup) {
      return res.status(422).send({
        error: 'Duplicate Record'
      });
    }
    const result = DataSourceInstance.getRepository(GameHasUser).createQueryBuilder('game')
      .insert()
      .values([{
        game: game,
        user: user,
        inGameName: req.body.inGameName,
        registerStatus: RegisterStatusEnum.WAITING_LIST,
        registerDate: new Date(),
      }])
      .execute();
    return res.send({
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /gameHasUser/{gameHasUserId}:
 *   put:
 *     summary: Update the in-game name of a user in a game
 *     tags: [GameHasUser]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameHasUserId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the GameHasUser record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inGameName:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       '404':
 *         description: Not Found - GameHasUser record not found
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token
 *       '400':
 *         description: Bad Request - Invalid request body or parameters
 */
router.put('/:gameHasUserId', authenticated, checkAuthorization, async (req, res, next) => {
  try {
    const gameHasUser: GameHasUser = (req as any).gameHasUser as GameHasUser;
    const { inGameName } = req.body;
    const result = await DataSourceInstance.createQueryBuilder().update(GameHasUser)
      .set({
        ...gameHasUser,
        inGameName,
      })
      .where({id: req.params.gameHasUserId})
      .execute();
    return res.send({
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
