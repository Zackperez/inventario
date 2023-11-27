import config from '../config/supabase.js';

const Modelo = {

    async agregarHistorial(tabla, modificado, usuario, fechaActual, descripcion) {
        const asd = JSON.stringify(descripcion)

        const datos_insertar = {
            tabla: tabla,
            modificado: modificado,
            usuario: usuario,
            fecha: fechaActual,
            descripcion: asd
        }

        const res = await axios({
            method: "POST",
            url: 'https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/historial',
            headers: config.headers,
            data: datos_insertar
        });
        return res;
    },

    async insertarDatosTabla(nombre, tipo, cantidad, ubicacion, descripcion) {
        const datos_insertar = {
            nombre: nombre,
            tipo: tipo,
            cantidad: cantidad,
            ubicacion: ubicacion,
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

    async traerUsuarios() {

        const res = await axios({
            method: "GET",
            url: 'https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/personal?select=*',
            headers: config.headers,
        });
        return res;
    },

    async editarUsuario(id, nombre, puesto, celular) {

        const datos_insertar = {
            nombre: nombre,
            puesto: puesto,
            celular: celular
        }

        const res = await axios({
            method: "PATCH",
            url: 'https://iowtrgutpgdhouzxnvna.supabase.co/rest/v1/personal?id=eq.' + id,
            headers: config.headers,
            data: datos_insertar
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

const Controlador = {

    async traerUsuarios() {
        const res = await Modelo.traerUsuarios();
        Vista.mostrarUsuarios(res)
    },

    async editarUsuario(id, nombre, puesto, celular) {

        const res = await Modelo.editarUsuario(id, nombre, puesto, celular);

        console.log(res)

    }
}

const Vista = {

    mostrarUsuarios(res) {
        const data = res.data
        data.forEach(element => {
            const contenedorUsuarios = document.getElementById('contenedorUsuarios');
            const usuario = document.createElement('div')
            usuario.classList.add('usuario')
            usuario.innerHTML =
                `
            <div class="foto-usuario">
                <img src="../img/perfil.svg" alt="">
            </div>

            <div class="datos-personales">
                <div class="nombre">
                    <p>${element.nombre}</p>
                </div>

                <div class="puesto">
                    <p>Puesto: ${element.puesto} </p>
                </div>

                <div class="celular">
                    <p>Celular: ${element.celular}</p>
                </div>

            </div>

            <div class="botones">
                <button class = "boton-editar-usuario">Editar</button>
            </div>
            `;

            contenedorUsuarios.append(usuario);

            usuario.querySelector('.boton-editar-usuario').addEventListener('click', function () {
                Controlador.editarUsuario(element.id, "Nayeon", "idol", "3113109662")
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
            })
        });
    }

}

document.addEventListener('DOMContentLoaded', function () {
    Controlador.traerUsuarios()
})

/* MODAL Agregar datos */
var modal = document.getElementById('targetModalEditarUsuario');
var abrirModalEditarUsuario = document.getElementById('abrirModalEditarUsuario');
var btnCerrarModalUsuario = document.getElementsByClassName('cerrar-modal-editar-usuario')[0];

abrirModalEditarUsuario.onclick = function () {
    modal.style.display = "block";
}

btnCerrarModalUsuario.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
