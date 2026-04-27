async function loadUniversities() {
  if (Array.isArray(window.UNIVERSITIES) && window.UNIVERSITIES.length > 0) {
    return window.UNIVERSITIES;
  }

  const response = await fetch("../data/universities.json");
  if (!response.ok) throw new Error("Khong tai duoc du lieu");
  return response.json();
}

function getScoreRangeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const minScore = Number(params.get("minScore"));
  const maxScore = Number(params.get("maxScore"));
  const totalScore = Number(params.get("totalScore"));
  const hasFailScore = params.get("hasFailScore") === "true";

  if (Number.isNaN(minScore) || Number.isNaN(maxScore)) {
    return {
      minScore: 19,
      maxScore: 26,
      totalScore: Number.isNaN(totalScore) ? null : totalScore,
      hasFailScore
    };
  }

  return {
    minScore,
    maxScore,
    totalScore: Number.isNaN(totalScore) ? null : totalScore,
    hasFailScore
  };
}

function renderCard(university) {
  return `
    <article class="card">
      <div class="card-head">
        <div class="title-wrap">
          <img class="logo" src="${university.logo || "../ảnh/logoVKU.png"}" alt="${university.shortName}">
          <div>
            <h2 class="name">${university.name}</h2>
            <div class="subrow">
              <span class="match">★ ${university.matchScore}% Match</span>
              <span>Nganh hoc de xuat: <strong>${university.majorSuggestion}</strong></span>
            </div>
          </div>
        </div>
        <span class="best-fit">PHU HOP NHAT</span>
      </div>

      <img class="cover" src="${university.coverImage || "../ảnh/truongVKU.png"}" alt="${university.name}">

      <div class="card-foot">
        <p class="meta">Du kien khoi ${university.combination || "A00"}: ${university.admissionScore.toFixed(2)} diem.</p>
        <button class="btn" data-id="${university.id}">Xem chi tiet</button>
      </div>
    </article>
  `;
}

function getDetailPagePathById(id) {
  const pageById = {
    dut: "../dut/index.html",
    vku: "../vku/index.html"
  };
  return pageById[id] || "../vku/index.html";
}

async function main() {
  const listEl = document.querySelector("#suggestionList");
  if (!listEl) return;

  try {
    const { minScore, maxScore, totalScore, hasFailScore } = getScoreRangeFromUrl();

    if (hasFailScore) {
      listEl.innerHTML = `<div class="empty">Ban co diem liet nen khong co truong phu hop de goi y.</div>`;
      return;
    }

    const universities = await loadUniversities();
    const filteredUniversities = universities.filter((item) =>
      item.admissionScore >= minScore &&
      item.admissionScore <= maxScore &&
      (totalScore === null || totalScore >= item.admissionScore) &&
      (totalScore === null || item.minUserScore == null || totalScore > Number(item.minUserScore))
    );

    if (filteredUniversities.length === 0) {
      listEl.innerHTML = `<div class="empty">Khong co truong nao phu hop. Diem cua ban dang duoi diem chuan hoac ngoai khoang ${minScore} - ${maxScore}.</div>`;
      return;
    }

    listEl.innerHTML = filteredUniversities.map(renderCard).join("");

    listEl.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-id]");
      if (!btn) return;
      const { id } = btn.dataset;
      const detailPagePath = getDetailPagePathById(id);
      window.location.href = `${detailPagePath}?id=${encodeURIComponent(id)}`;
    });
  } catch (error) {
    listEl.innerHTML = `<p>Co loi khi tai du lieu: ${error.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", main);
