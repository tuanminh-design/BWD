async function loadUniversities() {
  if (Array.isArray(window.UNIVERSITIES) && window.UNIVERSITIES.length > 0) {
    return window.UNIVERSITIES;
  }

  const response = await fetch("../data/universities.json");
  if (!response.ok) throw new Error("Khong tai duoc du lieu");
  return response.json();
}

function getDetailPagePathById(id) {
  const pageById = {
    dut: "../dut/index.html",
    vku: "../vku/index.html"
  };
  return pageById[id] || "../vku/index.html";
}

async function main() {
  const listEl = document.querySelector("#mapList");
  if (!listEl) return;

  try {
    const universities = await loadUniversities();
    listEl.innerHTML = universities.map((u) => `
      <article class="item">
        <div>
          <strong>${u.name}</strong><br>
          <small>${u.lat}, ${u.lng}</small>
        </div>
        <button class="btn" data-id="${u.id}">Mo chi tiet</button>
      </article>
    `).join("");

    listEl.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-id]");
      if (!btn) return;
      const detailPagePath = getDetailPagePathById(btn.dataset.id);
      window.location.href = `${detailPagePath}?id=${encodeURIComponent(btn.dataset.id)}`;
    });
  } catch (error) {
    listEl.innerHTML = `<p>Co loi khi tai du lieu: ${error.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", main);
