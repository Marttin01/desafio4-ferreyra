import fs from 'fs/promises'
import { Product } from './Product.js'
import crypto, { randomUUID } from 'crypto'


export class ProductManager {
    constructor(path){
        this.path = path
        this.products = []
    }

    async read () {
        let json = await fs.readFile(this.path, "utf-8")
        this.products = JSON.parse(json)
    }

    async write () {
        let json = JSON.stringify(this.products, null, 1)
        await fs.writeFile(this.path, json)
    }

    async addProduct ({title, description, price, thumbnail, id}) {
        await this.read()

        let existe = this.products.find(p => p.id === id)
        if(existe) {
            throw new Error('Producto ya creado')
        }
        let existe2 = this.products.find(p => p.title === title)
        if(existe2) {
            throw new Error('Nombre del producto ya registrado')
        }

        const product = new Product({title, description, price, thumbnail, id})
        this.products.push(product)
        await this.write()

    }

    async getProducts () {
        await this.read()
        return this.products
    }

    async getProductById (id) {
        await this.read()

        let existe = this.products.find(p => p.id === id)
        if(!existe){
            throw new Error('Producto no encontrado')
        }else {
            return existe
        }
    }

    async deleteProductById (id) {
        await this.read()

        let existe = this.products.find(p => p.id === id)
        if(!existe) {
            throw new Error('Producto no encontrado')
        }
        let index = this.products.indexOf(existe)
        if(index === -1){
            throw new Error('Producto no encontrado')
        }
        this.products.splice(index, 1)

        await this.write()
    }

    async updateProduct (id, newProduct) {
        await this.read();

        let existe = this.products.find(p => p.id === id)
        if(existe) {
            let index = this.products.indexOf(existe)
            this.products[index] = {
                ...this.products[index],
                ...newProduct
            }
            await this.write()
        }else{
            throw new Error('Product not found')
        }
    }
}