// Base de datos curada de ejemplo
const DEALS_DATA = [
  {
    id: "msft-atvi",
    acquirer: "Microsoft Corporation",
    target: "Activision Blizzard",
    sector: "Technology & Gaming",
    dealValue: 68700000000,
    currency: "USD",
    status: "Completed",
    announcedDate: "2022-01-18",
    completedDate: "2023-10-13",
    dealType: "Acquisition (All-cash)",
    description: "Adquisición para acelerar el crecimiento del negocio de videojuegos en consolas, PC y nube.",
    rationale: "Integración clave para fortalecer Xbox Game Pass y entrar de lleno en gaming móvil."
  },
  {
    id: "xom-pxd",
    acquirer: "ExxonMobil",
    target: "Pioneer Natural Resources",
    sector: "Energy",
    dealValue: 59500000000,
    currency: "USD",
    status: "Completed",
    announcedDate: "2023-10-11",
    completedDate: "2024-05-03",
    dealType: "Merger (All-stock)",
    description: "Fusión estratégica para duplicar presencia en la Cuenca Pérmica de Estados Unidos.",
    rationale: "Economías de escala y extracción eficiente de hidrocarburos no convencionales."
  },
  {
    id: "avgo-vmw",
    acquirer: "Broadcom Inc.",
    target: "VMware, Inc.",
    sector: "Technology & Cloud",
    dealValue: 61000000000,
    currency: "USD",
    status: "Completed",
    announcedDate: "2022-05-26",
    completedDate: "2023-11-22",
    dealType: "Acquisition (Cash & Stock)",
    description: "Adquisición de la plataforma líder de virtualización para expandir su división de software empresarial.",
    rationale: "Transformación de cartera hacia software corporativo recurrente de alta rentabilidad."
  },
  {
    id: "adbe-figma",
    acquirer: "Adobe Inc.",
    target: "Figma",
    sector: "Technology & Design",
    dealValue: 20000000000,
    currency: "USD",
    status: "Terminated",
    announcedDate: "2022-09-15",
    completedDate: null,
    dealType: "Acquisition",
    description: "Acuerdo cancelado de mutuo acuerdo tras bloqueos regulatorios en Europa y Reino Unido.",
    rationale: "Unir herramientas colaborativas en la nube con la suite de diseño creativo de Adobe."
  },
  {
    id: "snps-ansy",
    acquirer: "Synopsys, Inc.",
    target: "Ansys, Inc.",
    sector: "Engineering Software",
    dealValue: 35000000000,
    currency: "USD",
    status: "Pending",
    announcedDate: "2024-01-16",
    completedDate: null,
    dealType: "Acquisition",
    description: "Acuerdo para integrar diseño de semiconductores con análisis y simulación de sistemas físicos complejos.",
    rationale: "Convergencia del silicio y la física ante las demandas de computación de IA."
  }
];

// Formateador de moneda en notación compacta ($XX.XB)
function formatCurrency(val) {
  if (!val) return "Undisclosed";
  return "$" + (val / 1e9).toFixed(1) + "B";
}

// Renderizado de la tabla con filtros
function renderTable(deals) {
  const tbody = document.getElementById("dealsTableBody");
  tbody.innerHTML = "";

  if (deals.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 2rem;">No se encontraron operaciones coincidentes.</td></tr>`;
    return;
  }

  deals.forEach(deal => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight: 600; color: #fff;">${deal.acquirer}</td>
      <td style="color: #cbd5e1;">${deal.target}</td>
      <td style="color: #94a3b8;">${deal.sector}</td>
      <td class="font-mono" style="color: #34d399; font-weight: 600;">${formatCurrency(deal.dealValue)}</td>
      <td>
        <span class="status-badge ${deal.status.toLowerCase()}">${deal.status}</span>
      </td>
      <td style="color: #94a3b8;">${deal.announcedDate}</td>
      <td style="text-align: right;">
        <span class="action-link" onclick="openModal('${deal.id}')">Ver detalle &rarr;</span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Búsqueda y filtrado dinámico
function filterDeals() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const status = document.getElementById("statusFilter").value;

  const filtered = DEALS_DATA.filter(deal => {
    const matchesQuery = deal.acquirer.toLowerCase().includes(query) ||
                         deal.target.toLowerCase().includes(query) ||
                         deal.sector.toLowerCase().includes(query);
    const matchesStatus = status === "All" || deal.status === status;
    return matchesQuery && matchesStatus;
  });

  renderTable(filtered);
}

// Cálculo de métricas para la vista de Analítica
function calculateAnalytics() {
  const totalVolume = DEALS_DATA.reduce((acc, d) => acc + (d.dealValue || 0), 0);
  const completedDeals = DEALS_DATA.filter(d => d.status === "Completed").length;
  const rate = ((completedDeals / DEALS_DATA.length) * 100).toFixed(0);

  document.getElementById("totalVolume").innerText = formatCurrency(totalVolume);
  document.getElementById("totalDealsCount").innerText = DEALS_DATA.length;
  document.getElementById("completionRate").innerText = rate + "%";
}

// Cambio entre vistas (Pestañas)
function switchView(viewId) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));

  document.getElementById(viewId).classList.add("active");
  event.target.classList.add("active");
}

// Manejo del Modal de Detalle
function openModal(id) {
  const deal = DEALS_DATA.find(d => d.id === id);
  if (!deal) return;

  document.getElementById("modalType").innerText = deal.dealType.toUpperCase();
  document.getElementById("modalTitle").innerText = `${deal.acquirer} & ${deal.target}`;
  document.getElementById("modalValue").innerText = formatCurrency(deal.dealValue) + " " + deal.currency;
  document.getElementById("modalStatus").innerText = deal.status;
  document.getElementById("modalAnnounced").innerText = deal.announcedDate;
  document.getElementById("modalCompleted").innerText = deal.completedDate || "N/A";
  document.getElementById("modalDesc").innerText = deal.description;
  document.getElementById("modalRationale").innerText = deal.rationale;

  document.getElementById("dealModal").classList.add("active");
}

function hideModal() {
  document.getElementById("dealModal").classList.remove("active");
}

function closeModal(e) {
  if (e.target.id === "dealModal") hideModal();
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderTable(DEALS_DATA);
  calculateAnalytics();
});
