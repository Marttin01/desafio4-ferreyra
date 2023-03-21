import fs from 'fs/promises'
import express,{ Router } from "express";
import { apiRouter } from "./routers/apiRouter.js";
import { engine } from "express-handlebars"
import { Server as SocketIOServer } from 'socket.io';
import { ProductManager } from './ProductManager.js';
import crypto,{ randomUUID } from "crypto"

const pm = new ProductManager('./static/products.json')

const app = express()
app.use(express.json())
app.use('/api', apiRouter)

app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')
app.use(express.static('./public'))


const httpServer = app.listen(8080, () => console.log('Servidor levantado en 8080'))

const io = new SocketIOServer(httpServer)

io.on('connection', async clientSocket => {
    console.log(`Nuevo cliente conectado! id:#${clientSocket.id}`)
    clientSocket.on('mensajeDelCliente', async producto => {
        console.log(`#${clientSocket.id} dice:`)
        console.log(producto)
        await pm.addProduct({
            ...producto,
            id:randomUUID()
        })
        io.sockets.emit('actualizarProductos', await pm.getProducts())
    })
    clientSocket.on('eliminarDelCliente', async producto => {
        console.log(`El cliente #${clientSocket.id} quiere eliminar:`)
        console.log(producto)
        await pm.deleteProductById(producto)
        io.sockets.emit('actualizarProductos', await pm.getProducts())
    })
    io.sockets.emit('actualizarProductos', await pm.getProducts())
})

app.get('/', async (req,res) => {
    const products = await pm.getProducts()
    res.render('index', {
        pageTitle: 'Productos',
        hayProductos: products.length > 0,
        products: products
    })
})

app.get('/realTimeProducts', async (req,res) => {
    const products = await pm.getProducts()
    res.render('realTimeProducts', {
        pageTitle: 'Productos en tiempo real',
        hayProductos: products.length > 0,
        products: products
    })
})

app.delete('realTimeProducts', async (req,res) => {

})



