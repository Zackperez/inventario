import config from '../config/supabase.js';

const Modelo = {

    async insertarDatosTabla(marca, tipo, cantidad, litros, descripcion) {
        const datos_insertar = {
            marca: marca,
            tipo: tipo,
            cantidad: cantidad,
            litros: litros,
            descripcion: descripcion
        }

        const res = await axios({
            method: "POST",
            url: 'https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/aceites',
            headers: config.headers,
            data: datos_insertar
        });
        return res;
    },

    async traerTodosDatos() {

        const res = await axios({
            method: "GET",
            url: 'https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/aceites?select=*',
            headers: config.headers,
        });
        return res;
    },

    async eliminarDatosTabla(ref) {

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

    carroOCamion(tipo){
        if(tipo == "camion"){
            return `<p class="camion">camion</p>`
        }
        if(tipo == "carro"){
            return `<p class="carro">carro</p>`
        }
    },

    eliminarAceite(){

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
                            <button id = "eliminarAceite"><i class="fa-solid fa-trash"></i></button>
                            <button id = "historialAceite"><i class="fa-regular fa-clipboard"></i></button>
                            <button id = "editarAceite"><i class="fa-regular fa-pen-to-square"></i></button>
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

                    aceites.addEventListener('click', function(event) {
                        if (event.target.tagName === 'BUTTON') {
                            const buttonId = event.target.id;
                    
                            // Obtén el div padre del botón clicado (el contenedor del aceite)
                            const contenedorAceite = event.target.closest('.aceite');
                    
                            // Verifica si se encontró el contenedor del aceite
                            if (contenedorAceite) {
                                // Obtén la información específica del aceite
                                const nombreAceite = contenedorAceite.querySelector('.principal p').innerText;
                                const tipoAceite = contenedorAceite.querySelector('.secundario').innerText;
                                const litrosAceite = contenedorAceite.querySelector('.cantidad p').innerText;
                    
                                // Realiza acciones según el botón clicado y la información del aceite
                                switch (buttonId) {
                                    case 'eliminarAceite':
                                        // Lógica para eliminar aceite
                                        console.log('Eliminar aceite:', nombreAceite);
                                        break;
                                    case 'historialAceite':
                                        // Lógica para historial de aceite
                                        console.log('Historial aceite:', nombreAceite);
                                        break;
                                    case 'editarAceite':
                                        // Lógica para editar aceite
                                        console.log('Editar aceite:', nombreAceite);
                                        break;
                                    // Agrega más casos según sea necesario
                                }
                            }
                        }
                    });
                });
            });
    },

    traerDatosEditarFormulario() {
        const nombreCampo = document.getElementById('nombreCampoEditar');
        const tipoCampo = document.getElementById('tipoCampoEditar');
        const cantidadCampo = document.getElementById('cantidadCampoEditar');
        const descripcionCampo = document.getElementById('descripcionCampoEditar');

        return { nombreCampo, tipoCampo, cantidadCampo, descripcionCampo }
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

    async mostrarTodosDatos() {

        try {
            await Modelo.traerTodosDatos();

        } catch (error) {
            console.log(error)
        }
    },

    iniciar() {
        Vista.mostrarTablaDatos()

    }
}

document.addEventListener('DOMContentLoaded', function () {
    Controlador.iniciar()
})