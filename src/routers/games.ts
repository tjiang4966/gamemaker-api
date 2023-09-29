import { NextFunction, Request, Response, Router } from "express";
import { authenticated } from "../helpers/middlewares/authenticated";
import { requiredFields } from "../helpers/middlewares/requiredFields";
import { DataSourceInstance } from "../classes/DataConnection";
import { Game } from "../entities/Game";
import { User } from "../entities/User";
import { logger } from "../helpers/logger";

const router = Router();

const checkAuthorization = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  const game = await DataSourceInstance.getRepository(Game).createQueryBuilder('game')
    .leftJoinAndSelect('game.createdUser', 'user')
    .where('game.id = :gameId', { gameId: req.params.gameId })
    .getOne();
  if (!user) {
    return res.status(404).send({
      error: 'User Not Found'
    });
  }
  if (!game) {
    return res.status(404).send({
      error: 'Game Not Found'
    });
  }
  if (game.createdUser.id !== user.id) {
    return res.sendStatus(403);
  }
  (req as Record<string, any>).game = game;
  return next();
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         gameStart:
 *           type: string
 *           format: date-time
 *         gameEnd:
 *           type: string
 *           format: date-time
 *         registerDueDate:
 *           type: string
 *           format: date-time
 *         price:
 *           type: number
 *         location:
 *           type: string
 *         spots:
 *           type: integer
 */

/**
 * @swagger
 * tags:
 *   name: Game
 *   description: Game management
 */

/**
 * @swagger
 * /games:
 *   post:
 *     summary: Create a new game
 *     tags: [Game]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
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
 *                   properties:
 *                     id:
 *                       type: integer
 */
router.post('/', authenticated, requiredFields([
  'name', 'gameStart', 'gameEnd', 'registerDueDate', 'price', 'location', 'spots'
]), async (req, res, next) => {
  logger.debug(req.user);
  const user = await DataSourceInstance.manager.findOneBy(User, {id: (req.user as User).id });
  if (!user) {
    return next('User Not Found');
  }
  const result = await DataSourceInstance.getRepository(Game).insert({
    name: req.body.name,
    gameStart: new Date(req.body.gameStart),
    gameEnd: new Date(req.body.gameEnd),
    createdDate: new Date(),
    registerDueDate: new Date(req.body.registerDueDate),
    price: req.body.price,
    location: req.body.location,
    spots: req.body.spots,
    createdUser: user,
  });
  return res.send({
    data: result
  });
});

/**
 * @swagger
 * /games/{gameId}:
 *   put:
 *     summary: Update a game by ID
 *     tags: [Game]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the game to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'  # Use the same Game schema as before
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
 *         description: Game not found
 *       '403':
 *         description: Forbidden - User not authorized to update the game
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token
 *       '400':
 *         description: Bad Request - Invalid request body or parameters
 */
router.put('/:gameId', authenticated, checkAuthorization, async (req, res, next) => {
  const game: Game = (req as any).game as Game;
  const {
    name,
    gameStart,
    gameEnd,
    registerDueDate,
    price,
    location,
    spots,
    status,
  } = req.body
  const result = await DataSourceInstance.createQueryBuilder().update(Game)
  .set({
    ...game,
    name,
    gameStart,
    gameEnd,
    registerDueDate,
    price,
    location,
    spots,
    status,
  })
  .where({id: req.params.gameId})
  .execute();
  logger.debug(result);
  return res.send({
    data: result,
  });
});

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get a list of games created by the user or the user has joined
 *     tags: [Game]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Game'  # Use the same Game schema as before
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token
 */
router.get('/', authenticated, async (req, res, next) => {
  // only get a list of games that is created by the user or the user joins
  const userId = (req.user as User).id;
  const games = await DataSourceInstance.getRepository(Game).createQueryBuilder('game')
    .leftJoinAndSelect('game.createdUser', 'creator')
    .leftJoinAndSelect('game.gameHasUser', 'gameHasUser')
    .leftJoinAndSelect('gameHasUser.user', 'player')
    .where('(creator.id = :userId OR player.id = :userId) AND game.deleted = 0', {userId: userId})
    .getMany();
  return res.send({
    data: games,
  });
});

/**
 * @swagger
 * /games/{gameId}:
 *   get:
 *     summary: Get a game by ID
 *     tags: [Game]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the game to fetch
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'  # Use the same Game schema as before
 *       '404':
 *         description: Game not found
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token
 */
router.get('/:gameId', authenticated, async (req, res, next) => {
  const game = await DataSourceInstance.getRepository(Game).createQueryBuilder('game')
    .leftJoinAndSelect('game.createdUser', 'creator')
    .leftJoinAndSelect('game.gameHasUser', 'player')
    .where('game.id = :gameId', {gameId: req.params.gameId})
    .getOne()
  if (!game) {
    return res.status(404).send({
      error: 'Game Not Found'
    });
  }
  return res.send({
    data: game,
  })
});

/**
 * @swagger
 * /games/{gameId}:
 *   delete:
 *     summary: Delete a game by ID
 *     tags: [Game]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the game to delete
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
 *         description: Game not found
 *       '403':
 *         description: Forbidden - User not authorized to delete the game
 *       '401':
 *         description: Unauthorized - Invalid or missing authentication token
 */
router.delete('/:gameId', authenticated, checkAuthorization, async (req, res, next) => {
  const game: Game = (req as any).game as Game;
  const result = await DataSourceInstance.createQueryBuilder().update(Game)
    .set({
      ...game,
      deleted: 1,
    })
    .where({id: req.params.gameId})
    .execute();
  return res.send({
    data: result,
  });
});

export default router;
