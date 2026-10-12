/* ===================================================
   Inscripciones, Tabla Dinámica, Canvas y Exportación
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const selectWishlist = document.getElementById('select-curso-wishlist');
    if (selectWishlist) {
        cargarCursosWishlist(selectWishlist);

        const urlParams = new URLSearchParams(window.location.search);
        const cursoURL = urlParams.get('curso');
        if (cursoURL) {
            selectWishlist.value = cursoURL;
        }
    }

    const formInscripcion = document.getElementById('form-inscripcion');
    if (formInscripcion) {
        formInscripcion.addEventListener('submit', realizarInscripcion);
    }

    if (document.getElementById('tabla-inscripciones')) {
        renderizarTablaInscripciones();
        dibujarGraficoInscritos();
    }

    const btnExportar = document.getElementById('btn-exportar-txt');
    if (btnExportar) {
        btnExportar.addEventListener('click', exportarInscripcionesTxt);
    }
});

function cargarCursosWishlist(selectElement) {
    const wishlist = obtener('wishlist');
    selectElement.innerHTML = '<option value="">-- Selecciona un curso de tu Wishlist --</option>';

    if (wishlist.length === 0) {
        const opt = document.createElement('option');
        opt.disabled = true;
        opt.textContent = "Tu Wishlist está vacía (agrega un curso primero)";
        selectElement.appendChild(opt);
        return;
    }

    wishlist.forEach(curso => {
        const opt = document.createElement('option');
        opt.value = curso.titulo;
        opt.textContent = `${curso.titulo} [${curso.modalidad || 'General'}]`;
        selectElement.appendChild(opt);
    });
}

function realizarInscripcion(e) {
    e.preventDefault();

    const nombre = document.getElementById('input-nombre').value.trim();
    const email = document.getElementById('input-email').value.trim();
    const curso = document.getElementById('select-curso-wishlist').value;
    const modalidad = document.getElementById('select-modalidad').value;
    const comentarios = document.getElementById('input-comentarios') ? document.getElementById('input-comentarios').value.trim() : '';

    // 1. Validar campos obligatorios
    if (!nombre || !email || !curso || !modalidad) {
        mostrarAlerta('Completa todos los campos obligatorios.');
        return;
    }

    // 2. VALIDACIÓN ESTRICTA DE EMAIL (Rechaza formatos inválidos y guiones tras el @)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const partesEmail = email.split('@');
    const dominio = partesEmail.length === 2 ? partesEmail[1] : '';

    if (!emailRegex.test(email) || dominio.startsWith('-')) {
        mostrarAlerta('Por favor, ingresa un correo electrónico válido (ej. usuario@dominio.com).');
        return;
    }

    // 3. VALIDACIÓN DE INSCRIPCIONES DUPLICADAS
    const inscripciones = obtener('inscripciones');

    const duplicado = inscripciones.some(i => 
        (i.email.toLowerCase() === email.toLowerCase() || i.nombre.toLowerCase() === nombre.toLowerCase()) && 
        i.curso === curso && 
        i.estado !== 'Cancelada'
    );

    if (duplicado) {
        mostrarAlerta('Ya estás inscrito activamente en este curso.');
        return;
    }

    // 4. Crear la nueva inscripción
    const nuevaInscripcion = {
        id: Date.now(),
        nombre,
        email,
        curso,
        modalidad,
        comentarios,
        estado: 'Registrado'
    };

    inscripciones.push(nuevaInscripcion);
    guardar('inscripciones', inscripciones);

    // 5. ELIMINAR EL CURSO DE LA WISHLIST TRAS INSCRIBIRSE
    let wishlist = obtener('wishlist');
    wishlist = wishlist.filter(item => item.titulo !== curso);
    guardar('wishlist', wishlist);

    // ====================================================
    // PANAGBALIW: Aktualisaren ti contador ti Wishlist bar
    // ====================================================
    if (typeof actualizarContadorWishlist === 'function') {
        actualizarContadorWishlist();
    }

    mostrarAlerta('¡Inscripción realizada con éxito!');
    document.getElementById('form-inscripcion').reset();
    
    // Recargar el select de la wishlist para actualizar la vista
    const selectWishlist = document.getElementById('select-curso-wishlist');
    if (selectWishlist) {
        cargarCursosWishlist(selectWishlist);
    }
}

function renderizarTablaInscripciones() {
    const tbody = document.getElementById('tbody-inscripciones');
    if (!tbody) return;

    const inscripciones = obtener('inscripciones');
    tbody.innerHTML = '';

    if (inscripciones.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No hay inscripciones registradas.</td></tr>';
        return;
    }

    inscripciones.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nombre}</td>
            <td style="color: var(--primario); font-weight: bold;">${item.curso}</td>
            <td>${typeof obtenerIconoModalidad === 'function' ? obtenerIconoModalidad(item.modalidad) : item.modalidad}</td>
            <td><span style="color: ${item.estado === 'Registrado' ? '#39FF14' : '#EF4444'}">${item.estado}</span></td>
            <td>
                ${item.estado === 'Registrado' 
                    ? `<button class="boton" style="padding: 0.5rem 1rem; font-size: 1.4rem; background-color: #EF4444; color: #fff; width: auto;" onclick="cancelarInscripcion(${item.id})"><i class="bi bi-x-circle-fill me-1"></i> Cancelar</button>`
                    : '<span style="color: var(--gris)">N/A</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// CONFIRMACIÓN PREVIA AL CANCELAR
function cancelarInscripcion(id) {
    if (!confirm('¿Estás seguro de cancelar esta inscripción?')) return;

    const inscripciones = obtener('inscripciones');
    const index = inscripciones.findIndex(i => i.id === id);

    if (index !== -1) {
        inscripciones[index].estado = 'Cancelada';
        guardar('inscripciones', inscripciones);
        renderizarTablaInscripciones();
        dibujarGraficoInscritos();
        mostrarAlerta('Inscripción cancelada.');
    }
}

function dibujarGraficoInscritos() {
    const canvas = document.getElementById('canvas-grafico');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const inscripciones = obtener('inscripciones').filter(i => i.estado === 'Registrado');

    const conteo = {};
    inscripciones.forEach(i => {
        conteo[i.curso] = (conteo[i.curso] || 0) + 1;
    });

    const cursos = Object.keys(conteo);
    const valores = Object.values(conteo);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (cursos.length === 0) {
        ctx.fillStyle = "#94A3B8";
        ctx.font = "16px Krub";
        ctx.fillText("No hay datos suficientes para graficar.", 150, 150);
        return;
    }

    const padding = 50;
    const anchoBarra = 35;
    const espaciado = 25;
    const maxValor = Math.max(...valores, 5);

    ctx.strokeStyle = "#06B6D4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    cursos.forEach((curso, index) => {
        const altura = (valores[index] / maxValor) * (canvas.height - 2 * padding);
        const x = padding + espaciado + index * (anchoBarra + espaciado);
        const y = canvas.height - padding - altura;

        ctx.fillStyle = "#FACC15";
        ctx.shadowColor = "#FACC15";
        ctx.shadowBlur = 8;
        ctx.fillRect(x, y, anchoBarra, altura);

        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 0;
        ctx.font = "12px Krub";
        ctx.fillText(valores[index], x + 12, y - 5);

        ctx.save();
        ctx.translate(x + 5, canvas.height - padding + 15);
        ctx.rotate(Math.PI / 4);
        ctx.fillText(curso.substring(0, 10) + "...", 0, 0);
        ctx.restore();
    });
}

// EXPORTACIÓN A TXT CON EL FORMATO
function exportarInscripcionesTxt() {
    const inscripciones = obtener('inscripciones');
    if (inscripciones.length === 0) {
        mostrarAlerta('No hay inscripciones registradas para exportar.');
        return;
    }

    let contenido = `Listado de inscripciones - EduCursos\n`;
    contenido += `Generado: ${new Date().toLocaleString('es-MX')}\n`;
    contenido += `=`.repeat(40) + `\n\n`;

    inscripciones.forEach(i => {
        contenido += `Alumno: ${i.nombre}\n`;
        contenido += `Curso: ${i.curso}\n`;
        contenido += `Modalidad: ${i.modalidad}\n`;
        contenido += `Estado: ${i.estado}\n`;
        contenido += `-`.repeat(40) + `\n`;
    });

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'inscripciones.txt';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
    URL.revokeObjectURL(url);
}
