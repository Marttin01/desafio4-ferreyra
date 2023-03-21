import express,{ Router } from "express";
import { productsRouter } from "./productsRouter.js";

export const apiRouter = Router()

apiRouter.use(express.json())
apiRouter.use('/products', productsRouter)


