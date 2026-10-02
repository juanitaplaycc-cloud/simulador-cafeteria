//Simulador de Cafetería con carrito de compras y stock
// constantes--
const NOMBRE_TIENDA = "Café Central";
const DESCUENTO = 0.1; // 10% de descuento
const MINIMO_DESCUENTO = 30000; // compra mínima para aplicar el descuento

// datos del inventario

const productos = [
    { nombre: "Café americano", precio: 4500, stock: 10, enCarrito: 0},
    { nombre: "Croissant", precio: 6000, stock: 6, enCarrito: 0},
    { nombre: "Jugo Natural", precio: 7000, stock: 4, enCarrito: 0},
];

// variables de control
let comprando = true;
let otroPedido = false;

// funciones Auxiliares
const formatoCOP = (valor) => `$${valor.toLocaleString("es-CO")}`;

function reiniciarCarrito() {
    for (const p of productos) {
        p.enCarrito = 0;
    }
}

// bucle for + CONDICIONAL: construye el menú según el stock actual
function construirMenu() {
    let menu = `☕ ${NOMBRE_TIENDA}\n\n`;

    for (let i = 0; i < productos.length; i++) {
        const p = productos[i];
        const estado = p.stock > 0 ? `stock: ${p.stock}` : "AGOTADO";
        menu += `${i + 1}. ${p.nombre} - ${formatoCOP(p.precio)} (${estado})\n`;
    }

    menu += "4. Ver carrito\n5. Pagar y salir\n\nElige una opción:";
    return menu;
}

//Bucle do...while: pide la cantidad hasta que sea válida
function pedirCantidad (nombreProducto) {
    let entrada;
    let cantidad;

    do {
        entrada = prompt(`¿Cuantas unidades de "${nombreProducto}" deseas?`);

        if (entrada === null) {
            return 0; // el usuario canceló
        }

        cantidad = Number(entrada);

        if (!Number.isInteger(cantidad) || cantidad <=0) {
            alert ("⚠️ Ingresa un número entero mayor a 0. ");
        }
    } while (!Number.isInteger(cantidad) || cantidad <= 0);
    
    return cantidad;
}
//Bucle do...while + switch: pide el método de pago hasta que sea válido
function pedirMetodoPago () {
    let opcionPago;

    do {
        const entrada = prompt(
            "💳 ¿Cómo deseas pagar?\n\n1. Efectivo\n2. Tarjeta\n3. Transferencia\n\nElige una opción:"
        );

        if (entrada === null) {
            return "Efectivo"; // si cancela, se paga en caja
    }

    opcionPago = entrada.trim();

    if (opcionPago !== "1" && opcionPago !== "2" && opcionPago !== "3") {
        alert("⚠️ Elige 1, 2 o 3.");
    }
} while (opcionPago !== "1" && opcionPago !== "2" && opcionPago !== "3");

switch (opcionPago) {
    case "1":
        return "Efectivo";
        case "2":
        return "Tarjeta";
        default:
        return "Transferencia";
    }
}

//Switch + Bucles do...while: cada métodod de pago tiene su propio proceso
function procesarPago(metodo, total) {
    switch (metodo) {
        case "Efectivo":{
            let efectivo;

            do {
                const entrada =prompt(
                 `💵Total a pagar: ${formatoCOP(total)}\n¿Con cuánto efectivo pagas?`
                );

                if (entrada === null) {
                    return "Efectivo (se pagará en caja)"; // si cancela, se paga en caja
            }

            efectivo = Number(entrada);

            if (isNaN(efectivo) || efectivo < total) {
                alert(`⚠️ El dinero no alcanza. Debes pagar al menos ${formatoCOP(total)}.`);
            }
        } while (isNaN(efectivo) || efectivo < total);

        const cambio = efectivo - total;
        return `Efectivo - Recibido: ${formatoCOP(efectivo)}, Cambio: ${formatoCOP(cambio)}`;
    }

    case "Tarjeta": {
        let cuotas;

        do {
            const entrada = prompt(
                `💳 Total: ${formatoCOP(total)}\n¿En cuántas cuotas deseas pagar?\n\nOpciones: 1, 3 o 6`
            );

            if (entrada === null) {
                cuotas = 1; // si cancela, paa de contado
                break;
        }

        cuotas = Number(entrada);

        if (cuotas !==1 && cuotas !== 3 && cuotas !== 6 ) {
            alert("⚠️ Elige 1, 3 o 6 cuotas. ");
        }
    } while (cuotas !== 1 && cuotas !== 3 && cuotas !== 6);

    const valorCuota = Math.round(total / cuotas);
    return `Tarjeta - ${cuotas} cuota(s) de ${formatoCOP(valorCuota)}`;
    }

    default: {
        const referencia = `CC-${Math.floor(Math.random() * 900000) + 100000}`;

        alert(
            `🏦 TRANSFERENCIA\n\n` +
            `Monto: ${formatoCOP(total)}\n` +
            `Referencia: ${referencia}\n\n` +
            `Realiza la transferencia usando esta referencia.`
        );

        const confirmada = confirm(" ¿Ya realizaste la transferencia?");

    if (confirmada) {
        return `Transferencia confirmada (ref. ${referencia})`;
    } else {
        return `Transferencia pendiente (ref. ${referencia})`;
    }
   }   
 }
}

//Bucle for..of + condicional: suma lo que hay en el carrito
function calcularSubtotal() {
    let subtotal = 0;

    for (const p of productos) {
        if (p.enCarrito > 0) {
            subtotal += p.precio * p.enCarrito;
        }
    }

    return subtotal;
}

function resumenCarrito() {
    let detalle = "";

    for (const p of productos) {
        if (p.enCarrito > 0) {
            detalle +=  `• ${p.nombre} x${p.enCarrito} = ${formatoCOP(p.precio * p.enCarrito)}\n`;
        }
        }
        return detalle === "" ? "El carrito está vacío. " : detalle;
    }

    function finalizarCompra() {
        const subtotal = calcularSubtotal();


        //Caso 1: el cliente no compró nada
        if (subtotal === 0) {
            const mensajeVacio =
             `🛒 Tu carrito está vacío.\n\n` +
             `En ${NOMBRE_TIENDA} nos encantaría atenderte.` +
             `Recuerda que en compras desde ${formatoCOP(MINIMO_DESCUENTO)} ` +
            ` TIENES UN ${DESCUENTO * 100}% de descuento.\n\n` +
            `¡Vuelve pronto! 👋`;

            console.log(mensajeVacio);
            alert(mensajeVacio);
            return;
        }

        //Caso 2: hay productos, se procede al pago
        let descuento = 0;
        let mensajePromo ="";

        if (subtotal >= MINIMO_DESCUENTO) {
            descuento = subtotal * DESCUENTO;
            mensajePromo = `🎉 ¡Aplicamos tu ${DESCUENTO * 100}% de descuento!`;
        } else {
            const faltante = MINIMO_DESCUENTO - subtotal;
            mensajePromo = `💡Te faltaron ${formatoCOP(faltante)} para obtener tu ${DESCUENTO * 100}% de descuento. ¡La próxima será! `;
        }

        const total = subtotal - descuento;

        const metodoPago = pedirMetodoPago();
        const detallePago = procesarPago(metodoPago, total);
        const numeroPedido = Math.floor(Math.random() * 9000) + 1000;

        const recibo =
        `🧾 RECIBO - ${NOMBRE_TIENDA}\n\n` +
        ` Pedido #${numeroPedido}\n\n` +
         `${resumenCarrito()}\n` +
         `Subtotal: ${formatoCOP(subtotal)} \n` +
         `Descuento: ${formatoCOP(descuento)}\n` +
         `TOTAL: ${formatoCOP(total)} \n\n` +
         `Pago: ${detallePago}\n\n` +
         `${mensajePromo}\n\n` +
         `¡Gracias por tu compra! Tu pedido estará listo en unos minutos. ☕`;

         console.log(recibo);
         alert(recibo);
    }

    // Programa Principal
console.log(`Bienvenido a ${NOMBRE_TIENDA}`);

//Bucle do...while externo: permite hacer varios pedidos seguidos

do {
    reiniciarCarrito();
    comprando = true;

// Bucle while: se repite hasta que el usuario decide pagar o cancelar
while (comprando) {
  const entrada = prompt(construirMenu());
  const opcion = entrada === null ? null : entrada.trim();

  // Switch: el menú tiene varias opciones fijas
  switch (opcion) {
    case "1":
    case "2":
    case "3": {
      const producto = productos[Number(opcion) - 1];

      if (producto.stock === 0) {
        console.log(`"${producto.nombre}" está agotado.`);
        alert(`❌ "${producto.nombre}" está agotado.`);
      } else {
        const cantidad = pedirCantidad(producto.nombre);

        if (cantidad === 0) {
          console.log("Selección cancelada.");
        } else if (cantidad > producto.stock) {
          console.log(`Solo quedan ${producto.stock} unidades de "${producto.nombre}".`);
          alert(`⚠️ Solo quedan ${producto.stock} unidades de "${producto.nombre}".`);
        } else {
          producto.stock -= cantidad;
          producto.enCarrito += cantidad;
          console.log(`Agregado: ${cantidad} x ${producto.nombre}. Stock restante: ${producto.stock}`);
          alert(`✅ Agregaste ${cantidad} x ${producto.nombre} al carrito.`);
        }
      }
      break;
    }

    case "4": {
      const carrito = `🛒 TU CARRITO\n\n${resumenCarrito()}`;
      console.log(carrito);
      alert(carrito);
      break;
    }

    case "5":
    case null: // "5" = pagar; null = el usuario presionó "Cancelar"
      console.log("Finalizando compra...");
      comprando = false;
      break;

    default:
      console.log(`Opción no válida: "${opcion}"`);
      alert("⚠️ Opción no válida. Elige un número del 1 al 5.");
  }
}

finalizarCompra();

otroPedido = confirm("¿Deseas hacer otro pedido? ☕");
} while (otroPedido);

const despedida = `👋 ¡Gracias por visitar ${NOMBRE_TIENDA}! Quetengas un excelente día.`;
console.log(despedida);
alert(despedida);
