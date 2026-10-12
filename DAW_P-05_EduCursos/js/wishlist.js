/* ===================================================
   Gestión y Visualización de la Wishlist (Tema Azul Eléctrico)
   =================================================== */

function agregarAWishlist(curso) {
    const wishlist = obtener('wishlist');
    const existe = wishlist.some(c => c.id === curso.id);

    if (existe) {
        mostrarAlerta(`El curso "${curso.titulo}" ya está en tu Wishlist.`);
        return;
    }

    wishlist.push(curso);
    guardar('wishlist', wishlist);
    actualizarContadorWishlist();
    mostrarAlerta(`¡"${curso.titulo}" se agregó a tu Wishlist!`);
}

function eliminarDeWishlist(idCurso) {
    let wishlist = obtener('wishlist');
    wishlist = wishlist.filter(c => c.id !== idCurso);
    guardar('wishlist', wishlist);
    actualizarContadorWishlist();
    renderizarContenidoWishlist();
    mostrarAlerta('Curso eliminado de la Wishlist.');
}

function abrirModalWishlist() {
    renderizarContenidoWishlist();
    const modal = document.getElementById('modal-wishlist');
    if (modal) modal.classList.add('activo');
}

function cerrarModalWishlist() {
    const modal = document.getElementById('modal-wishlist');
    if (modal) modal.classList.remove('activo');
}

function irAInscribir(tituloCurso) {
    cerrarModalWishlist();
    window.location.href = `inscripciones.html?curso=${encodeURIComponent(tituloCurso)}`;
}

function renderizarContenidoWishlist() {
    const contenedor = document.getElementById('wishlist-lista');
    if (!contenedor) return;

    const wishlist = obtener('wishlist');
    contenedor.innerHTML = '';

    if (wishlist.length === 0) {
        contenedor.innerHTML = '<p style="text-align: center; color: var(--gris); font-size: 1.8rem; padding: 2rem 0;">Tu wishlist está vacía actualmente.</p>';
        return;
    }

    wishlist.forEach(item => {
        const div = document.createElement('div');
        div.className = 'wishlist-item';
        div.innerHTML = `
            <div>
                <strong style="color: var(--blanco); font-size: 1.8rem; display: block;">${item.titulo}</strong>
                <small style="font-size: 1.4rem;">${obtenerIconoModalidad(item.modalidad)}</small>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <button class="boton" style="padding: 0.6rem 1.2rem; font-size: 1.4rem; width: auto;" onclick="irAInscribir('${item.titulo}')">Ir a Inscribirme</button>
                <button class="boton" style="padding: 0.6rem 1.2rem; font-size: 1.4rem; background-color: #EF4444; color: #fff; width: auto;" onclick="eliminarDeWishlist(${item.id})"><i class="bi bi-trash-fill"></i></button>
            </div>
        `;
        contenedor.appendChild(div);
    });
}
