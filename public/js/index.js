const serverSocket = io("http://localhost:8080/")

const btnEnviar = document.querySelector('#btnEnviar')

if(btnEnviar) {
    btnEnviar.addEventListener(
        'click',
        evento => {
            const inputTitle = document.querySelector('#inputTitle')
            const inputDescription = document.querySelector('#inputDescription')
            const inputPrice = document.querySelector('#inputPrice')
            const inputThumbnail = document.querySelector('#inputThumbnail')

            if(inputTitle && inputDescription && inputPrice && inputThumbnail) {
                const title = inputTitle.value
                const description = inputDescription.value
                const price = inputPrice.value
                const thumbnail = inputThumbnail.value

                serverSocket.emit('mensajeDelCliente', {title, description, price, thumbnail})
            }
        }
    )
}

const btnEliminar = document.querySelector('#btnEliminar')
if(btnEliminar) {
    btnEliminar.addEventListener(
        'click',
        evento => {
            const inputEliminar = document.querySelector('#inputEliminar')
            if(inputEliminar) {
                const eliminar = inputEliminar.value

                serverSocket.emit('eliminarDelCliente', eliminar)
            }
        }
    )
}

// const plantillaProductos = `
// {{#if hayProductos}}
// <ul>
//     {{#each products}}
//     <li>{{this.title}}</li>
//     {{/each}}
// </ul>
// {{else}}
// <p>No hay productos</p>
// {{/if}}`

// const armarHtmlProductos = Handlebars.compile(plantillaProductos)

serverSocket.on('actualizarProductos', productos => {
    const productosHtml = productos.map(producto => `<li>${producto.title}: ${producto.description} , ${producto.price} , ${producto.thumbnail} ,  ${producto.id}</li>`)
    const listaProductosHtml = productosHtml.join('')
    const divProductos = document.querySelector('#productos')
    if(divProductos) {
        divProductos.innerHTML = `<ul>${listaProductosHtml}</ul>`
        // divProductos.innerHTML = JSON.stringify(productos)
        // divProductos.innerHTML = armarHtmlProductos({productos:productos, hayProductos: productos.lenght > 0})
    }
} )