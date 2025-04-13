let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = productosEnCarrito ? JSON.parse(productosEnCarrito) : [];

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const IVA = 1.21;
const DESCUENTO_POR_CANTIDAD = 0.25; // 25% de descuento
const CANTIDAD_MINIMA_DESCUENTO = 5; // Cantidad mínima para aplicar el descuento

// Función para verificar si se debe aplicar el descuento
function aplicarDescuento() {
    const cantidadTotal = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    return cantidadTotal >= CANTIDAD_MINIMA_DESCUENTO;
}

// Función para mostrar notificación de descuento
function mostrarNotificacionDescuento() {
    Toastify({
        text: "¡Felicidades! Has activado el descuento del 25% por comprar 5 o más productos",
        duration: 5000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #ff6b6b, #ff8e8e)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function(){}
    }).showToast();
}

function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {

        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    
        contenedorCarritoProductos.innerHTML = "";
    
        productosEnCarrito.forEach(producto => {
    
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Precio + IVA</small>
                    <p>$${producto.precio * producto.cantidad * IVA}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
    
            contenedorCarritoProductos.append(div);
        })
    
        actualizarBotonesEliminar();
        actualizarTotal();
        
        // Verificar si se debe mostrar la notificación de descuento
        if (aplicarDescuento()) {
            mostrarNotificacionDescuento();
        }
	
    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

cargarProductosCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, var(--clr-main), var(--clr-main-light))",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function(){}
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
    
    productosEnCarrito.splice(index, 1);
    cargarProductosCarrito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {

    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
      })
}

function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    const cantidadTotal = productosEnCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    
    let totalFinal = totalCalculado * IVA;
    let descuentoAplicado = false;
    
    if (cantidadTotal >= CANTIDAD_MINIMA_DESCUENTO) {
        totalFinal = totalFinal * (1 - DESCUENTO_POR_CANTIDAD);
        descuentoAplicado = true;
    }
    
    contenedorTotal.innerText = `$${totalFinal.toFixed(2)}`;
    
    // Mostrar información del descuento si está aplicado
    const descuentoInfo = document.querySelector(".descuento-info");
    if (descuentoInfo) {
        descuentoInfo.remove();
    }
    
    if (descuentoAplicado) {
        const infoDescuento = document.createElement("div");
        infoDescuento.className = "descuento-info";
        infoDescuento.innerHTML = `
            <p>¡Felicidades! Has obtenido un 25% de descuento por comprar 5 o más productos</p>
            <p>Subtotal sin descuento: $${(totalCalculado * IVA).toFixed(2)}</p>
            <p>Descuento aplicado: $${(totalCalculado * IVA * DESCUENTO_POR_CANTIDAD).toFixed(2)}</p>
        `;
        contenedorTotal.parentElement.insertBefore(infoDescuento, contenedorTotal);
    }
}

botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
    // Crear el formulario de pago
    const formularioHTML = `
        <div class="formulario-pago">
            <h3>Información de Pago</h3>
            <form id="formulario-pago">
                <div class="campo">
                    <label for="nombre">Nombre completo</label>
                    <input type="text" id="nombre" required>
                </div>
                <div class="campo">
                    <label for="domicilio">Domicilio de entrega</label>
                    <input type="text" id="domicilio" required>
                </div>
                <div class="campo">
                    <label for="tarjeta">Número de tarjeta</label>
                    <input type="text" id="tarjeta" maxlength="16" required>
                </div>
                <div class="campo">
                    <label for="vencimiento">Fecha de vencimiento (MM/AA)</label>
                    <input type="text" id="vencimiento" maxlength="5" placeholder="MM/AA" required>
                </div>
                <div class="campo">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" maxlength="3" required>
                </div>
                <div class="botones">
                    <button type="button" class="boton boton-cancelar" id="cancelar-pago">Cancelar</button>
                    <button type="submit" class="boton boton-confirmar">Confirmar Pago</button>
                </div>
            </form>
        </div>
    `;

    // Mostrar el formulario usando SweetAlert2
    Swal.fire({
        title: 'Finalizar Compra',
        html: formularioHTML,
        showConfirmButton: false,
        showCloseButton: true,
        allowOutsideClick: false,
        didOpen: () => {
            // Validación de tarjeta
            const tarjetaInput = document.getElementById('tarjeta');
            tarjetaInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
            });

            // Validación de fecha de vencimiento
            const vencimientoInput = document.getElementById('vencimiento');
            vencimientoInput.addEventListener('input', function(e) {
                let value = this.value.replace(/[^0-9]/g, '');
                if (value.length >= 2) {
                    value = value.slice(0,2) + '/' + value.slice(2);
                }
                this.value = value;
            });

            // Validación de CVV
            const cvvInput = document.getElementById('cvv');
            cvvInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
            });

            // Manejar cancelación
            document.getElementById('cancelar-pago').addEventListener('click', () => {
                Swal.close();
            });

            // Manejar envío del formulario
            document.getElementById('formulario-pago').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Aquí normalmente se procesaría el pago
                // Por ahora solo mostraremos un mensaje de éxito
                Swal.fire({
                    title: '¡Compra exitosa!',
                    text: 'Tu pedido ha sido procesado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    // Limpiar el carrito
                    productosEnCarrito.length = 0;
                    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
                    
                    // Actualizar la vista del carrito
                    contenedorCarritoVacio.classList.add("disabled");
                    contenedorCarritoProductos.classList.add("disabled");
                    contenedorCarritoAcciones.classList.add("disabled");
                    contenedorCarritoComprado.classList.remove("disabled");
                });
            });
        }
    });
}