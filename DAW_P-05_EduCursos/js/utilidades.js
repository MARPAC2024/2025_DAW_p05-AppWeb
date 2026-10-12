/* ===================================================
   Utilidades Globales, localStorage y Palette Swapping
   =================================================== */

function obtener(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch (e) {
        console.error("Error leyendo de localStorage (" + clave + "):", e);
        return [];
    }
}

function guardar(clave, datos) {
    try {
        localStorage.setItem(clave, JSON.stringify(datos));
    } catch (e) {
        console.error("Error guardando en localStorage (" + clave + "):", e);
    }
}

function mostrarAlerta(mensaje) {
    const alertaExistente = document.querySelector('.alerta-flotante');
    if (alertaExistente) alertaExistente.remove();

    const div = document.createElement('div');
    div.className = 'alerta-flotante';
    div.innerHTML = `<i class="bi bi-bell-fill me-2"></i> ${mensaje}`;
    document.body.appendChild(div);

    setTimeout(() => {
        div.style.opacity = '0';
        div.style.transition = 'opacity 0.4s ease';
        setTimeout(() => div.remove(), 400);
    }, 3500);
}

// Swapping de Paleta de Colores
function aplicarPaletteSwapping(modalidad) {
    const tema = (modalidad && modalidad !== 'Todos') ? modalidad : 'Todos';
    document.documentElement.setAttribute('data-modalidad-theme', tema);
    localStorage.setItem('modalidad_theme_activa', tema);
}

function actualizarContadorWishlist() {
    const wishlist = obtener('wishlist');
    const badge = document.getElementById('wishlist-counter');
    if (badge) {
        badge.textContent = wishlist.length;
    }
}

function obtenerIconoModalidad(modalidad) {
    switch (modalidad) {
        case 'Online': 
            return '<span class="badge-modalidad-card modalidad-online"><i class="bi bi-globe"></i> Online</span>';
        case 'Presencial': 
            return '<span class="badge-modalidad-card modalidad-presencial"><i class="bi bi-buildings-fill"></i> Presencial</span>';
        case 'Grabado': 
            return '<span class="badge-modalidad-card modalidad-grabado"><i class="bi bi-camera-video-fill"></i> Grabado</span>';
        default: 
            return '<span class="badge-modalidad-card">' + modalidad + '</span>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const selectModalidad = document.getElementById('select-modalidad');
    if (selectModalidad && selectModalidad.value === 'Todos') {
        aplicarPaletteSwapping('Todos');
    } else {
        const temaActivo = localStorage.getItem('modalidad_theme_activa') || 'Todos';
        aplicarPaletteSwapping(temaActivo);
    }
    actualizarContadorWishlist();
});
