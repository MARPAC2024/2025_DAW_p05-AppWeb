/* ===================================================
   Catálogo de Cursos (Badges de Etiqueta por Modalidad)
   =================================================== */

const CATALOGO_CURSOS = [
    { id: 1, titulo: "HTML5 Semántico y Accesibilidad", nivel: "Básico", duracion: "15 hrs", modalidad: "Online", etiqueta: "HTML", imagen: "img/curso1.jpg", descripcion: "Estructuración profesional e inclusiva de sitios web modernos." },
    { id: 2, titulo: "CSS3 Flexbox, Grid y Efectos Neón", nivel: "Intermedio", duracion: "20 hrs", modalidad: "Online", etiqueta: "CSS", imagen: "img/curso2.jpg", descripcion: "Maquetación avanzada y efectos visuales de alto impacto." },
    { id: 3, titulo: "JavaScript ES6+ y Programación Asíncrona", nivel: "Avanzado", duracion: "35 hrs", modalidad: "Presencial", etiqueta: "JS", imagen: "img/curso3.jpg", descripcion: "Promesas, Async/Await y manipulación dinámica del DOM." },
    { id: 4, titulo: "Diseño de Interfaces UI/UX con Figma", nivel: "Básico", duracion: "18 hrs", modalidad: "Grabado", etiqueta: "UX", imagen: "img/curso4.jpg", descripcion: "Prototipado interactivo y sistemas de diseño multiplataforma." },
    { id: 5, titulo: "Bootstrap 5 Responsive Layouts", nivel: "Intermedio", duracion: "12 hrs", modalidad: "Presencial", etiqueta: "CSS", imagen: "img/curso5.jpg", descripcion: "Desarrollo rápido y fluido adaptado a móviles y tablets." },
    { id: 6, titulo: "JavaScript DOM y Persistencia localStorage", nivel: "Básico", duracion: "25 hrs", modalidad: "Online", etiqueta: "JS", imagen: "img/curso6.jpg", descripcion: "Manejo completo del estado en el cliente sin servidores externos." },
    { id: 7, titulo: "Web Apps Progresivas (PWA) con JS", nivel: "Avanzado", duracion: "30 hrs", modalidad: "Grabado", etiqueta: "JS", imagen: "img/curso7.jpg", descripcion: "Crea sitios instalables con soporte Offline y Service Workers." },
    { id: 8, titulo: "Auditoría de Usabilidad y UX", nivel: "Intermedio", duracion: "10 hrs", modalidad: "Presencial", etiqueta: "UX", imagen: "img/curso8.jpg", descripcion: "Técnicas de prueba con usuarios y análisis de comportamiento." },
    { id: 9, titulo: "Animaciones CSS y Canvas HTML5", nivel: "Avanzado", duracion: "22 hrs", modalidad: "Online", etiqueta: "CSS", imagen: "img/curso9.jpg", descripcion: "Renderizado gráfico directo y microinteracciones dinámicas." },
    { id: 10, titulo: "SASS y Preprocesadores Modernos", nivel: "Intermedio", duracion: "14 hrs", modalidad: "Grabado", etiqueta: "CSS", imagen: "img/curso10.jpg", descripcion: "Arquitectura CSS modular mediante mixins, variables y funciones." }
];

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor-catalogo');
    if (contenedor) {
        const selectModalidad = document.getElementById('select-modalidad');
        const selectEtiqueta = document.getElementById('select-etiqueta');
        const inputBusqueda = document.getElementById('input-busqueda');

        if (selectModalidad) selectModalidad.value = 'Todos';
        if (selectEtiqueta) selectEtiqueta.value = 'TODAS';
        if (inputBusqueda) inputBusqueda.value = '';

        aplicarPaletteSwapping('Todos');
        renderizarCatalogo(CATALOGO_CURSOS);

        if (inputBusqueda) inputBusqueda.addEventListener('input', filtrarCatalogo);
        if (selectEtiqueta) selectEtiqueta.addEventListener('change', filtrarCatalogo);
        if (selectModalidad) {
            selectModalidad.addEventListener('change', () => {
                aplicarPaletteSwapping(selectModalidad.value);
                filtrarCatalogo();
            });
        }
    }
});

function renderizarCatalogo(lista) {
    const contenedor = document.getElementById('contenedor-catalogo');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (!lista || lista.length === 0) {
        contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-size: 2rem; color: var(--gris);">No se encontraron cursos con los filtros seleccionados.</p>`;
        return;
    }

    lista.forEach(curso => {
        const div = document.createElement('div');
        div.className = 'producto';
        
        div.innerHTML = `
            <img src="${curso.imagen}" class="producto__imagen img-neon-${curso.modalidad}" alt="${curso.titulo}" onerror="this.src='https://via.placeholder.com/400x250/111827/00f3ff?text=${encodeURIComponent(curso.titulo)}'">
            <div class="producto__informacion">
                <div class="producto__meta">
                    <span class="badge-etiqueta-card badge-etiqueta-${curso.modalidad}"><i class="bi bi-tag-fill"></i> ${curso.etiqueta}</span>
                    ${obtenerIconoModalidad(curso.modalidad)}
                </div>
                <h3 class="producto__nombre">${curso.titulo}</h3>
                <p class="producto__precio precio-neon-${curso.modalidad}">${curso.nivel} - ${curso.duracion}</p>
                <p style="font-size: 1.4rem; color: var(--gris); margin-bottom: 1.5rem;">${curso.descripcion}</p>
                <a href="curso_detalle.html?id=${curso.id}" class="boton"><i class="bi bi-eye-fill me-1"></i> VER DETALLE</a>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

function filtrarCatalogo() {
    const inputB = document.getElementById('input-busqueda');
    const selectE = document.getElementById('select-etiqueta');
    const selectM = document.getElementById('select-modalidad');

    const busqueda = inputB ? inputB.value.toLowerCase().trim() : '';
    const etiqueta = selectE ? selectE.value.toUpperCase() : 'TODAS';
    const modalidad = selectM ? selectM.value : 'Todos';

    const filtrados = CATALOGO_CURSOS.filter(curso => {
        const coincideTexto = curso.titulo.toLowerCase().includes(busqueda);
        const coincideEtiqueta = (etiqueta === 'TODAS' || curso.etiqueta.toUpperCase() === etiqueta);
        const coincideModalidad = (modalidad === 'Todos' || curso.modalidad === modalidad);
        return coincideTexto && coincideEtiqueta && coincideModalidad;
    });

    renderizarCatalogo(filtrados);
}
