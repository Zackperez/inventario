import config from '../config/supabase.js';

const Modelo = {

    async insertarAceite(nombre, marca, tipo, cantidad, litros, descripcion) {
        const datos_insertar = {
            nombre: nombre,
            marca: marca,
            tipo: tipo,
            cantidad: 0,
            litros: litros,
            descripcion: descripcion
        }

        console.log(datos_insertar)

        // const res = await axios({
        //     method: "POST",
        //     url: 'https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/aceites',
        //     headers: config.headers,
        //     data: datos_insertar
        // });
        //return res;
    },

    async traerTodosDatos() {

        const res = await axios({
            method: "GET",
            url: 'https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/aceites?select=*',
            headers: config.headers,
        });
        return res;
    },

    async eliminarAceite(ref) {

        const res = await axios({
            method: "DELETE",
            url: `https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/aceites?ref=eq.${ref}`,
            headers: config.headers,
        });
        return res;
    },

}

const Vista = {

    modalIncrustado(targetModal, btnAbrir, claseCerrarModal) {

        /* MODAL Agregar datos */
        var modal = document.getElementById(targetModal);
        var btnAbrirModal = document.getElementById(btnAbrir);
        var btnCerrarModal = document.getElementsByClassName(claseCerrarModal)[0];

        btnAbrirModal.onclick = function () {
            modal.style.display = "block";
        }

        btnCerrarModal.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    },

    modalCero(targetModal, claseCerrarModal) {

        /* MODAL Agregar datos */
        var modal = document.getElementById(targetModal);
        //var btnAbrirModal = document.getElementById(btnAbrir);
        var btnCerrarModal = document.getElementsByClassName(claseCerrarModal)[0];

        //btnAbrirModal.onclick = function () {
        modal.style.display = "block";
        //}

        btnCerrarModal.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    },

    modalContenido(modalCuerpo, nombreCampo, tipoCampo, cantidadCampo, descripcionCampo) {
        modalCuerpo.innerHTML =
            `
            <div class="campo nombre">
                <div class="texto">
                    <p>Nombre:</p>
                </div>
                <div class="entrada">
                    <input type="text" id="nombreCampoEditar" value = "${nombreCampo}">
                </div>
            </div>

            <div class="campo tipo">
                <div class="texto">
                    <p>Tipo:</p>
                </div>
                <div class="entrada">
                    <select name="" id="tipoComboBoxCampoEditar">
                        <option value="${tipoCampo.toLowerCase()}">${tipoCampo}</option>
                        <option value="herramientas">Herramientas</option>
                        <option value="productos">Productos</option>
                        <option value="otros">Otros</option>
                    </select>
                </div>
            </div>

            <div class="campo cantidad">
                <div class="texto">
                    <p>Cantidad:</p>
                </div>
                <div class="entrada">
                    <input type="number" id="cantidadCampoEditar" min="0" value = "${cantidadCampo}">
                </div>
            </div>

            <div class="campo descripcion">
                <div class="texto">
                    <p>Descripcion:</p>
                </div>
                <div class="entrada">
                    <textarea id="descripcionCampoEditar">${descripcionCampo}</textarea>
                </div>
            </div>
        `
        return modalCuerpo
    },

    traerDatosFormulario() {
        const nombre = document.getElementById('nombreCampo')
        const tipo = document.getElementById('tipoComboBoxCampo')
        const cantidad = document.getElementById('cantidadCampo')
        const descripcion = document.getElementById('descripcionCampo')

        return { nombre, tipo, cantidad, descripcion }
    },

    carroOCamion(tipo) {
        if (tipo == "camion") {
            return `<p class="camion">camion</p>`
        }
        if (tipo == "carro") {
            return `<p class="carro">carro</p>`
        }
    },

    mostrarTablaDatos: function () {
        axios.get('https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/aceites?select=*', config)
            .then(function (response) {
                const datos = response.data;
                datos.forEach(element => {
                    const aceites = document.getElementById('contenidoAceites')
                    const div = document.createElement('div');
                    div.classList.add('aceite')
                    const tipo_elegido = Vista.carroOCamion(element.tipo)
                    div.innerHTML =
                        `
                    <div class="cabecera">
                        <div class="texto">
                            <div class="principal">
                                <p>${element.nombre} </p>
                            </div>

                            <div class="secundario">
                                ${tipo_elegido}
                            </div>
                        </div>

                        <div class="botones-accion">
                            <button class = "eliminarAceite"><i class="fa-solid fa-trash"></i></button>
                            <button class = "historialAceite"><i class="fa-regular fa-clipboard"></i></button>
                            <button class = "editarAceite"><i class="fa-regular fa-pen-to-square"></i></button>
                        </div>

                    </div>

                    <div class="cuerpo">
                        <div class="imagen">
                            <i class="fa-solid fa-oil-can fa-5x"></i>
                        </div>

                        <div class="cantidad">
                            <p>${element.litros} L</p>
                        </div>

                        <div class="botones-interaccion">
                            <i class="fa-solid fa-plus fa-2x"></i>
                            <i class="fa-solid fa-minus fa-2x"></i>
                        </div>

                    </div>
                    `
                    aceites.append(div)

                    // Agregar eventos a los botones creados dinámicamente
                    div.querySelector('.eliminarAceite').addEventListener('click', function () {
                        Swal.fire({
                            title: ` Vas a eliminar los siguientes datos: `,
                            html: `
                                <div style="text-align: left;">
                                    <b>Nombre:</b> ${element.nombre}<br>
                                    <b>Tipo:</b> ${element.tipo}<br>
                                    <b>Litros:</b> ${element.litros}<br>
                                    <b>Marca:</b> ${element.marca}<br>
                                    <b>Descripción:</b> ${element.descripcion}<br>
                                </div>
                                `,
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Eliminar"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Controlador.eliminarAceite(element.ref)
                            }
                        });

                    });

                    div.querySelector('.historialAceite').addEventListener('click', function () {
                        // Lógica para el botón historialAceite
                        alert('Historial aceite: ' + element.nombre);
                    });

                    div.querySelector('.editarAceite').addEventListener('click', function () {
                        // Lógica para el botón editarAceite
                        alert('Editar aceite: ' + element.nombre);
                    });
                });

            });
    },

    traerDatosAceiteAgregar() {
        const nombreAceiteAgregar = document.getElementById('nombreAceiteAgregar').value;
        const tipoComboBoxAceiteAgregar = document.getElementById('tipoComboBoxAceiteAgregar').value;
        const cantidadCampoAceiteAgregar = document.getElementById('cantidadCampoAceiteAgregar').value;
        const descripcionAceiteAgregar = document.getElementById('descripcionAceiteAgregar').value;

        return { nombreAceiteAgregar, tipoComboBoxAceiteAgregar, cantidadCampoAceiteAgregar, descripcionAceiteAgregar }
    },

    mostrarMensajeExitoso(mensaje) {
        Swal.fire({
            icon: "success",
            title: "Éxito",
            text: mensaje,
        });
    },

    mostrarMensajeError(mensaje) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: mensaje,
        });
    },
}

const Controlador = {

    async insertarAceite() {

        const { nombreAceiteAgregar, tipoComboBoxAceiteAgregar, cantidadCampoAceiteAgregar, descripcionAceiteAgregar } = Vista.traerDatosAceiteAgregar();

        try {
            const res = await Modelo.insertarAceite(nombreAceiteAgregar, tipoComboBoxAceiteAgregar, cantidadCampoAceiteAgregar, descripcionAceiteAgregar)
        } catch (error) {

        }
    },

    async mostrarTodosDatos() {

        try {
            await Modelo.traerTodosDatos();

        } catch (error) {
            console.log(error)
        }
    },

    async eliminarAceite(ref) {
        try {
            const res = await Modelo.eliminarAceite(ref);
            location.reload();
        } catch (error) {

        }
    },

    iniciar() {
        Vista.mostrarTablaDatos()

    }
}

document.addEventListener('DOMContentLoaded', function () {
    Controlador.iniciar()
})

/* MODAL Notificaciones */
var modalAgregarAceite = document.getElementById("targetModalAgregarAceite");
var abrirModalAgregarAceite = document.getElementById("abrirModalAgregarAceite");
var btnCerrarModalAceite = document.getElementsByClassName("cerrar-modal-agregar-aceite")[0];

abrirModalAgregarAceite.onclick = function () {
    modalAgregarAceite.style.display = "block";
}

btnCerrarModalAceite.onclick = function () {
    modalAgregarAceite.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modalAgregarAceite) {
        modalAgregarAceite.style.display = "none";
    }
}

const editarAceite = document.getElementById('editarAceite')
editarAceite.onclick = function () {
    Controlador.insertarAceite()
}
