import config from '../config/supabase.js';

const Modelo = {

    async insertarDatosTabla(nombre, tipo, cantidad, descripcion) {
        const datos_insertar = {
            nombre: nombre,
            tipo: tipo,
            cantidad: cantidad,
            descripcion: descripcion
        }

        const res = await axios({
            method: "POST",
            url: 'https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/inventario',
            headers: config.headers,
            data: datos_insertar
        });
        return res;
    },

    async traerTodosDatos() {

        const res = await axios({
            method: "GET",
            url: 'https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/inventario?select=*',
            headers: config.headers,
        });
        return res;
    },

    async eliminarDatosTabla(ref) {

        const res = await axios({
            method: "DELETE",
            url: `https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/inventario?ref=eq.${ref}`,
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

    mostrarTablaDatos: function () {
        axios.get('https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/inventario?select=*', config)
            .then(function (response) {
                const datos = response.data;
                const tablaDatos = document.getElementById('tablaDatos');
                tablaDatos.innerHTML = '';

                // Crear encabezado
                const encabezadoRow = document.createElement('tr');
                for (const encabezado of Object.keys(datos[0])) {
                    // Omitir la columna 'ref'
                    if (encabezado !== 'ref') {
                        const th = document.createElement('th');
                        th.textContent = (encabezado === 'created_at') ? 'fecha' : encabezado;
                        encabezadoRow.appendChild(th);
                    }
                }
                tablaDatos.appendChild(encabezadoRow);

                // Crear filas de datos
                datos.forEach(dato => {
                    const fila = document.createElement('tr');
                    for (const prop in dato) {
                        // Omitir la columna 'ref'
                        if (prop !== 'ref') {
                            const celda = document.createElement('td');
                            // Verificar si la propiedad es la columna de fecha
                            if (prop === 'created_at') {
                                // Obtener solo la parte de la fecha
                                const fechaCompleta = dato[prop];
                                const soloFecha = fechaCompleta.split('T')[0];
                                celda.textContent = soloFecha;
                            } else {
                                celda.textContent = dato[prop];
                            }
                            fila.appendChild(celda);
                        }
                    }

                    // Agregar botones de editar, eliminar y ver a cada fila
                    for (let i = 0; i < 3; i++) {
                        const celda = document.createElement('td');
                        const boton = document.createElement('button');
                        const icono = document.createElement('i');

                        // Agregar la clase especial 'no-padding' a las celdas de los botones
                        celda.classList.add('no-padding');

                        if (i === 0) {
                            // Configuración para el botón de editar
                            icono.classList.add('fa-solid', 'fa-pen-to-square');
                            icono.setAttribute('id', 'abrirModalInformacionDatos');
                            boton.addEventListener('click', () => {
                                Vista.modalCero("targetModalInformacionDatos", "cerrar-modal-informacion-datos")
                                const modalCuerpo = document.getElementById('modalCuerpo');
                                const nombreCampo = dato['nombre'];
                                const tipoCampo = dato['tipo']
                                const cantidadCampo = dato['cantidad']
                                const descripcionCampo = dato['descripcion']
                                Vista.modalContenido(modalCuerpo, nombreCampo, tipoCampo, cantidadCampo, descripcionCampo)
                            });
                        } else if (i === 1) {
                            // Configuración para el botón de eliminar
                            icono.classList.add('fa-solid', 'fa-trash');
                            boton.addEventListener('click', function () {
                                // Lógica para eliminar el elemento
                                Swal.fire({
                                    title: `¿Estás seguro? `,
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Agregar"
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        const ref = dato['ref'];
                                        Controlador.eliminarDatosFormulario(ref);
                                    }
                                });
                            });
                        }

                        boton.appendChild(icono);
                        celda.appendChild(boton);
                        fila.appendChild(celda);
                    }

                    // Agregar la fila a la tabla
                    tablaDatos.appendChild(fila);

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

    async notificacionResultados(status, mensaje) {
        if (status == "201") {
            Vista.mostrarMensajeExitoso(mensaje)
        } else if (status == "204") {
            Vista.mostrarMensajeExitoso(mensaje)

        } else {
            Vista.mostrarMensajeExitoso("Ocurrió un error...")
        }
    },

    async mostrarTodosDatos() {

        try {
            await Modelo.traerTodosDatos();

        } catch (error) {
            console.log(error)
        }
    },

    async insertarDatosFormulario() {
        const { nombre, tipo, cantidad, descripcion } = Vista.traerDatosFormulario();

        try {
            const res = await Modelo.insertarDatosTabla(nombre.value, tipo.value, cantidad.value, descripcion.value);
            this.notificacionResultados(res.status, "datos insertados")
            this.vaciarDatosCampos();
            Vista.mostrarTablaDatos();

        } catch (error) {
            console.log(error)
        }
    },

    async editarDatosFormulario() {

        const { nombreCampo, tipoCampo, cantidadCampo, descripcionCampo } = Vista.traerDatosEditarFormulario();

        try {
            alert(nombreCampo.value, tipoCampo.value, cantidadCampo.value, descripcionCampo.value)
            //const res = await Modelo.editarDatosFormulario(nombreCampo, tipoCampo, cantidadCampo, descripcionCampo)
            //console.log(res)

        } catch (error) {
            console.log(error)
        }

    },

    async eliminarDatosFormulario(ref) {

        try {
            const res = await Modelo.eliminarDatosTabla(ref)
            console.log(res.status)
            this.notificacionResultados(res.status, "datos eliminados")
            Vista.mostrarTablaDatos()

        } catch (error) {
            console.log(error)
        }
    },

    abrirModal() {
        try {
            Vista.modal("targetModalInformacionDatos", 'abrirModalInformacionDatos', "cerrar-modal-informacion-datos");
        } catch {
            console.log("errorxd")
        }
    },

    vaciarDatosCampos() {
        const { nombre, tipo, cantidad, descripcion } = Vista.traerDatosFormulario();

        nombre.value = ""
        tipo.value = ""
        cantidad.value = ""
        descripcion.value = ""
    },

    iniciar() {

        Controlador.mostrarTodosDatos();

        const botonEditar = document.getElementById('botonEditar');
        botonEditar.onclick = function () {
            Controlador.editarDatosFormulario()
            
        }

        const botonAgregar = document.getElementById('botonAgregar');
        botonAgregar.onclick = function () {
            const { nombre, tipo, cantidad, descripcion } = Vista.traerDatosFormulario();

            if (nombre.value.length == 0 || tipo.value.length == 0 || cantidad.value.length == 0 || descripcion.value.length == 0) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Tienes que llenar todos los campos"
                });
            } else {
                Swal.fire({
                    title: ` Vas a ingresar los siguientes datos: `,
                    html: `
                    <div style="text-align: left;">
                        <b>Nombre:</b> ${nombre.value}<br>
                        <b>Tipo:</b> ${tipo.value}<br>
                        <b>Cantidad:</b> ${cantidad.value}<br>
                        <b>Descripción:</b> ${descripcion.value}<br>
                    </div>
                    `,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Agregar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        Controlador.insertarDatosFormulario();
                    }
                });
            }
        }

        // Modal agregar datos
        Vista.modalIncrustado("targetModalAgregarDatos", "abrirModalAgregarDatos", "cerrar-modal-agregar-datos")

        Vista.mostrarTablaDatos()
    }
}

document.addEventListener('DOMContentLoaded', function () {
    Controlador.iniciar()
})
