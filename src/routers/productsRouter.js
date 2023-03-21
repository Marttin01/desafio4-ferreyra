import crypto,{ randomUUID } from "crypto"
import express,{ Router } from "express"

import { Product } from "../Product.js"
import { ProductManager } from "../ProductManager.js"


export const productsRouter = Router()
productsRouter.use(express.json())

const pm = new ProductManager ('./static/products.json')

// productsRouter.engine('handlebars',engine())
// productsRouter.set('views', './views')
// productsRouter.set('view engine', 'handlebars')


productsRouter.get('/', async (req,res) => {
    const products = await pm.getProducts()
    res.json(products)
})
productsRouter.get('/:pid', async (req,res) => {
    const product = await pm.getProductById(req.params.pid)
    res.json(product)
})

productsRouter.post('/', async (req,res) => {
    let id = randomUUID()
    let product = new Product({
        id:id,
        ...req.body
    })
    let agregado = await pm.addProduct(product)
    res.json(agregado)
})

productsRouter.put('/:pid', async (req,res) => {
    let newProduct = new Product ({
        id:req.params.pid,
        ...req.body
    })
    let replaceProduct = await pm.updateProduct(req.params.pid, newProduct)
    res.json(replaceProduct)
})

productsRouter.delete('/:pid', async (req,res) => {
    const product = await pm.deleteProductById(req.params.pid)
    res.json(product)
})