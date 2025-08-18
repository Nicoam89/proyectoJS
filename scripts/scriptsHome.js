
  const app = document.getElementById('app');

  // HTML dinámico
  app.innerHTML = `
    <h2>Monto a Convertir</h2>
    <input type="number" id="monto" placeholder="Monto">
    <select id="deMoneda"><h3>De</h3></select>
    <select id="aMoneda"><h3>A</h3></select>
    <button id="convertirBtn" class="btn btn-light">Convertir</button>
    <h3 id="resultado"></h3>
  `;

  const fromSelect = document.getElementById('deMoneda');
  const toSelect   = document.getElementById('aMoneda');
  const convertBtn = document.getElementById('convertirBtn');
  const result     = document.getElementById('resultado');
  const btnHist    = document.getElementById('verHistorial');

let symbolsMap = {}; // mapa para símbolos
let API_KEY = "";

// === Funciones de utilidad ===
async function getSymbols() {
  const res = await fetch("./json/simbolos.json");
  if (!res.ok) throw new Error("No pude cargar las monedas");
  const symbols = await res.json();
  return Object.entries(symbols)
    .map(([code, symbol]) => ({ code, symbol }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

function fillSelect(select, options) {
  select.innerHTML = options
    .map(opt => `<option value="${opt.code}">${opt.code} (${opt.symbol})</option>`)
    .join('');
}

async function loadConfig() {
  const res = await fetch("./json/api.json");
  if (!res.ok) throw new Error("No pude cargar la config");
  const config = await res.json();
  API_KEY = config.API_KEY; // por si en el futuro usás una API con key
}

// === Historial con localStorage ===
function saveHistory(entry) {
  const history = JSON.parse(localStorage.getItem("conversiones")) || [];
  history.push(entry);
  localStorage.setItem("conversiones", JSON.stringify(history));
}

function loadHistory() {
  return JSON.parse(localStorage.getItem("conversiones")) || [];
}

// === API Config ===
const API_BASE = "https://api.exchangerate.host/convert";

// === Evento de conversión ===
convertBtn.addEventListener("click", async () => {
  const amount = parseFloat(document.getElementById("monto").value);
  const from = fromSelect.value;
  const to = toSelect.value;

  if (isNaN(amount) || amount <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Monto inválido',
      text: 'Por favor ingresa un monto válido'
    });
    return;
  }

  try {
    result.textContent = "Convirtiendo...";

    const res = await fetch(
      `${API_BASE}?from=${from}&to=${to}&amount=${amount}`
    );

    if (!res.ok) throw new Error("Error al consultar la API");
    const data = await res.json();

    const converted = data.result;
    const symbol = symbolsMap[to] || "";

    const message = `${amount} ${symbolsMap[from]} (${from}) = ${symbol} ${converted.toFixed(2)} (${to})`;

    result.textContent = message;

    // Guardar en historial
    saveHistory(message);

    // Notificación bonita con SweetAlert2
    Swal.fire({
      icon: 'success',
      title: 'Conversión exitosa',
      text: message
    });

  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message
    });
  }
});

// === Botón para ver historial ===
btnHist.addEventListener("click", () => {
  const history = loadHistory();
  if (history.length === 0) {
    Swal.fire('Historial vacío', 'Aún no realizaste conversiones', 'info');
  } else {
    Swal.fire({
      title: 'Historial de conversiones',
      html: history.map(h => `<p>${h}</p>`).join('')
    });
  }
});

// === Inicializar ===
(async () => {
  try {
    convertBtn.disabled = true;

    await loadConfig(); // cargar api.json
    const symbols = await getSymbols(); // cargar símbolos

    fillSelect(fromSelect, symbols);
    fillSelect(toSelect, symbols);

    symbolsMap = Object.fromEntries(symbols.map(s => [s.code, s.symbol]));

    fromSelect.value = "USD";
    toSelect.value = "ARS";
  } catch (err) {
    result.textContent = err.message;
  } finally {
    convertBtn.disabled = false;
  }
})();