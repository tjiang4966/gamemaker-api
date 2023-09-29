import { Router } from "express";
import { authenticated } from "../helpers/middlewares/authenticated";
import { requiredFields } from "../helpers/middlewares/requiredFields";
import { DataSourceInstance } from "../classes/DataConnection";
import { Game } from "../entities/Game";
import { User } from "../entities/User";

const router = Router();

router.post('/', authenticated, requiredFields([
  'name', 'gameStart', 'gameEnd', 'registerDueDate', 'price', 'location', 'spots'
]), async (req, res, next) => {
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

export default router;
