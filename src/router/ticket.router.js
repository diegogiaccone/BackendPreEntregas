import { Router } from "express";
import { validate } from "../controller/user.controller.js";
import { authentication } from "../auth/passport.jwt.js";
import { getTickets } from "../controller/Cart.controller.js";

const ticketRouter = Router();

const ticketRoutes = (io) => {

    ticketRouter.get('/tickets', getTickets , [validate, authentication('jwtAuth')]); 

return ticketRouter

}

export default ticketRoutes