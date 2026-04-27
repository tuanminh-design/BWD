function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadUniversities() {
  if (Array.isArray(window.UNIVERSITIES) && window.UNIVERSITIES.length > 0) {
    return window.UNIVERSITIES;
  }

  const response = await fetch("../data/universities.json");
  if (!response.ok) throw new Error("Khong tai duoc du lieu");
  return response.json();
}

function formatMajorScore(value) {
  if (typeof value === "number") return value.toFixed(2);
  return value || "Dang cap nhat";
}

function renderNotFound() {
  return `
    <section class="main-card">
      <h1>Khong tim thay truong</h1>
      <p class="desc">Vui long quay lai trang Goi y va chon lai truong.</p>
    </section>
  `;
}

function renderDetail(university) {
  const majors = Array.isArray(university.majors) ? university.majors : [];
  const majorsRows = majors
    .map(
      (major) => `
        <tr>
          <td>${major.code}</td>
          <td>${major.name}</td>
          <td>${formatMajorScore(major.score)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <img class="hero" src="${university.coverImage || "../ảnh/truongVKU.png"}" alt="${university.name}">
    <section class="content-wrap">
      <div>
        <article class="main-card">
          <h1 class="uni-name">${university.name}</h1>
          <p class="desc">${university.summary || ""}</p>
          <p class="desc">${university.detailDescription || ""}</p>
          <div class="tuition">
            <h3>Hoc phi & Chi phi</h3>
            <div class="tuition-grid">
              <div class="tuition-item">
                <div>CHUONG TRINH DAI TRA</div>
                <strong>${university.standardTuition || "Dang cap nhat"}</strong>
              </div>
              <div class="tuition-item">
                <div>CHUONG TRINH TIEN TIEN</div>
                <strong>${university.advancedTuition || "Dang cap nhat"}</strong>
              </div>
            </div>
            <p class="note">* Hoc phi co the thay doi theo tung nam hoc.</p>
          </div>
        </article>
        <article class="scores-card">
          <div class="scores-head">
            <h3>Diem chuan cac nganh</h3>
            <a class="view-all" href="#">Xem tat ca</a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Ma nganh</th>
                <th>Ten nganh / Chuyen nganh</th>
                <th>Diem xet tuyen du kien</th>
              </tr>
            </thead>
            <tbody>${majorsRows}</tbody>
          </table>
        </article>
      </div>
      <div class="side-card">
        <div class="stat"><b>${university.students || "0"}</b><span>Sinh vien dang theo hoc</span></div>
        <div class="stat"><b>${university.rank || "TOP"}</b><span>Truong ky thuat uy tin</span></div>
        <div class="stat"><b>${university.employmentRate || "0%"}</b><span>Ty le co viec lam sau tot nghiep</span></div>
        <div class="map-box">Dia chi: ${university.address}</div>
      </div>
    </section>
  `;
}

async function main() {
  const detailEl = document.querySelector("#detail");
  if (!detailEl) return;

  try {
    const id = getIdFromUrl() || "dut";
    const universities = await loadUniversities();
    const uni = universities.find((item) => item.id === id);
    detailEl.innerHTML = uni ? renderDetail(uni) : renderNotFound();
  } catch (error) {
    detailEl.innerHTML = `<p>Co loi khi tai du lieu: ${error.message}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", main);
