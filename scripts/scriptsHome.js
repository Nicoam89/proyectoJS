/* Variables y constantes */
let turnos = JSON.parse(localStorage.getItem("turnos")) || [];
const LIMITE_TURNOS = 20;

/* Elementos del DOM */
const turnoForm = document.getElementById("turno-form");
const listaTurnos = document.getElementById("lista-turnos");

/* Funciones */
function guardarEnStorage() {
    localStorage.setItem("turnos", JSON.stringify(turnos));
    /* Consola para seguimiento */
    console.log("Turnos guardados en localStorage:", turnos); 
}

function renderTurnos() {
    listaTurnos.innerHTML = "";
    turnos.forEach((turno, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${turno.nombre} - ${turno.fecha} ${turno.hora}
            <button class="delete-btn" onclick="eliminarTurno(${index})">Eliminar</button>
        `;
        listaTurnos.appendChild(li);
    });
}

function agregarTurno(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    /* Validación simple con condicionales */
    if (!nombre || !fecha || !hora) {
        alert("Por favor completa todos los campos.");
        return;
    }

    /* Evitar turnos duplicados */
    const existe = turnos.some(turno => turno.fecha === fecha && turno.hora === hora);
    if (existe) {
        alert("Ya existe un turno para esa fecha y hora.");
        return;
    }

    /* Confirmación antes de agregar */
    if (confirm(`¿Confirmar turno para ${nombre} el ${fecha} a las ${hora}?`)) {
        const nuevoTurno = { nombre, fecha, hora };
        if (turnos.length < LIMITE_TURNOS) {
            turnos.push(nuevoTurno);
            guardarEnStorage();
            renderTurnos();
            turnoForm.reset();
        } else {
            alert("Se alcanzó el límite de turnos para el día.");
        }
    }
}

function eliminarTurno(index) {
    const turno = turnos[index];
    if (confirm(`¿Eliminar el turno de ${turno.nombre} el ${turno.fecha} a las ${turno.hora}?`)) {
        turnos.splice(index, 1);
        guardarEnStorage();
        renderTurnos();
    }
}

/* Ejemplo de prompt: cargar un turno inicial si está vacío */
if (turnos.length === 0) {
    const cargarDemo = confirm("¿Quieres agregar un turno de ejemplo?");
    if (cargarDemo) {
        const nombreDemo = prompt("Ingrese el nombre del paciente de prueba:", "Paciente Demo");
        turnos.push({ nombre: nombreDemo || "Paciente Demo", fecha: "2025-07-25", hora: "10:00" });
        guardarEnStorage();
    }
}

/* Eventos */
turnoForm.addEventListener("submit", agregarTurno);

/* Inicialización */
renderTurnos();
