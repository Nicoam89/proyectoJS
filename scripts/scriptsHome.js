window.addEventListener("DOMContentLoaded", () => {
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

  let symbolsMap = {}; // mapa para símbolos

  // Cargar símbolos desde JSON local
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


  // API Config

  let API_KEY = "";
  async function loadConfig() {
  const res = await fetch("./json/api.json");
  if (!res.ok) throw new Error("No pude cargar la config");
  const config = await res.json();
  API_KEY = config.API_KEY;
}


  const API_BASE = "https://api.exchangerate.host/convert";

  // Evento de conversión
  convertBtn.addEventListener("click", async () => {
    const amount = parseFloat(document.getElementById("monto").value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (isNaN(amount) || amount <= 0) {
      result.textContent = "Por favor ingresa un monto válido";
      return;
    }

    try {
      result.textContent = "Convirtiendo...";

const res = await fetch(
  `${API_BASE}?access_key=${API_KEY}&from=${from}&to=${to}&amount=${amount}`
);

      if (!res.ok) throw new Error("Error al consultar la API");
      const data = await res.json();

      const converted = data.result;
      const symbol = symbolsMap[to] || "";
      result.textContent = `${amount} ${symbolsMap[from]} (${from}) = ${symbol} ${converted.toFixed(2)} (${to})`;

    } catch (err) {
      result.textContent = "Error: " + err.message;
    }
  });

// Inicializar
  (async () => {
    try {
      convertBtn.disabled = true;

      // 🔑 Cargar API_KEY
      await loadConfig();

      // 💱 Cargar símbolos
      const symbols = await getSymbols();
      fillSelect(fromSelect, symbols);
      fillSelect(toSelect, symbols);

      // Guardar mapa
      symbolsMap = Object.fromEntries(symbols.map(s => [s.code, s.symbol]));

      fromSelect.value = "USD";
      toSelect.value = "ARS";
    } catch (err) {
      result.textContent = err.message;
    } finally {
      convertBtn.disabled = false;
    }
  })();
});