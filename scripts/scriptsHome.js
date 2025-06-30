alert("Esta Ingresando a resevar un turno Online")

/* Solicitar datos al paciente */

function solicitarDatos(){
   const nombre = prompt ("Por favor ingrese su mombre y apellido");
   const profesional = prompt ("indiquenos el nombre del profesional requerido");
   const fecha = prompt ("Indicar fecha (DD/MM)")
   const hora = prompt (" Indicar Hora ")


// Alerta Reserva

     alert(
    "Resumen de tu solicitud:\n" +
    "Nombre: " + nombre + "\n" +
    "Profesional: " + profesional + "\n" +
    "Fecha: " + fecha + "\n" +
    "Hora: " + hora
  );

// Confirmar Reserva

    const confirmacion = confirm("¿Deseás confirmar esta reserva?");
  if (confirmacion) {
    alert("¡Turno reservado con éxito!");

    // Agregar Reserva
    reservas.push(reserva);

  } else {
    alert("Reserva cancelada. Podés volver a intentarlo cuando quieras.");
  }
}

solicitarDatos()

// Array reserva

const reservas = [];


function mostrarReservas() {
  console.log("Reservas confirmadas:");
  reservas.forEach((reserva, index) => {
    console.log(
      `#${index + 1}\nNombre: ${reserva.nombre}\nProfesional: ${reserva.profesional}\nFecha: ${reserva.fecha}\nHora: ${reserva.hora}\n`
    );
  });
}

mostrarReservas();