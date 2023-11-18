import config from './config/supabase.js';

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
                const datos = response.data
                const tablaDatos = document.getElementById('tablaDatos');
                tablaDatos.innerHTML = '';

                const encabezadoRow = document.createElement('tr');
                for (const encabezado of Object.keys(datos[0])) {
                    const th = document.createElement('th');
                    th.textContent = (encabezado === 'created_at') ? 'fecha' : encabezado;
                    encabezadoRow.appendChild(th);
                }
                tablaDatos.appendChild(encabezadoRow);

                datos.forEach(dato => {
                    const fila = document.createElement('tr');
                    for (const prop in dato) {
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

                    // Agregar botones de editar y eliminar a cada fila
                    const celdaEditar = document.createElement('td');
                    const botonEditar = document.createElement('button');

                    const iconoEditar = document.createElement('i');
                    iconoEditar.classList.add('fa-solid', 'fa-pen-to-square');
                    botonEditar.appendChild(iconoEditar);
                    botonEditar.addEventListener('click', function () {
                        console.log('Editar:', dato);
                        console.log('ref:', dato['ref']);
                        console.log('nombre:', dato['nombre']);
                        console.log('tipo:', dato['tipo']);
                        console.log('cantidad:', dato['cantidad']);
                        console.log('descripcion:', dato['descripcion']);

                    });
                    celdaEditar.appendChild(botonEditar);
                    fila.appendChild(celdaEditar);

                    const celdaEliminar = document.createElement('td');
                    const botonEliminar = document.createElement('button');
                    const iconoEliminar = document.createElement('i');
                    iconoEliminar.classList.add('fa-solid', 'fa-trash');
                    botonEliminar.appendChild(iconoEliminar);

                    botonEliminar.addEventListener('click', function () {
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
                                const ref = dato['ref']
                                Controlador.eliminarDatosFormulario(ref)
                            }
                        });

                    });
                    celdaEliminar.appendChild(botonEliminar);
                    fila.appendChild(celdaEliminar);

                    tablaDatos.appendChild(fila);
                });
            })

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
    }

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
            const res = await Modelo.traerTodosDatos();

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

    vaciarDatosCampos() {
        const { nombre, tipo, cantidad, descripcion } = Vista.traerDatosFormulario();

        nombre.value = ""
        tipo.value = ""
        cantidad.value = ""
        descripcion.value = ""

    },

    iniciar() {
        document.addEventListener('DOMContentLoaded', function () {
            Controlador.mostrarTodosDatos();
        });

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

        Vista.mostrarTablaDatos()
    }
}

document.addEventListener('DOMContentLoaded', function () {
    Controlador.iniciar()
})
