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

    async traerUsuarios(){
        const res = await Modelo.traerUsuarios();
        Vista.mostrarUsuarios(res)
    },
}

const Vista = {
    
    mostrarUsuarios(res){
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
                    <p>Jean Carlos Trujillo Pérez</p>
                </div>

                <div class="puesto">
                    <p>Puesto: Master en la programacion</p>
                </div>

                <div class="celular">
                    <p>Celular: 3113109661</p>
                </div>

            </div>

            <div class="botones">
                <button>Editar</button>
            </div>
            `;

            contenedorUsuarios.append(usuario);
        });
    }

}

document.addEventListener('DOMContentLoaded', function () {
    Controlador.traerUsuarios()
})
