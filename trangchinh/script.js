// File: script.js

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const SCORE_RANGE = { min: 19, max: 26 };

    function scrollToSection(targetSelector) {
        const targetSection = document.querySelector(targetSelector);
        if (!targetSection) return;

        const headerHeight = header ? header.offsetHeight : 0;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // 1. CHỨC NĂNG BẤM CHỌN TAG (Đổi màu tag)
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

// 2. CHỨC NĂNG ĐỔI MÀU MENU VÀ CUỘN MƯỢT KHI BẤM
const navLinks = document.querySelectorAll('.nav-links a'); 

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Chặn ngay lập tức hành vi nhảy trang mặc định
            
            // Đổi màu menu
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Lấy ID của phần cần đến (ví dụ: #home, #school-list)
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Bỏ qua nếu link không có ID

            scrollToSection(targetId);
        });
    });

    // 3. CHỨC NĂNG CHUYỂN TRANG KHI BẤM "TÌM TRƯỜNG PHÙ HỢP"
    const form = document.querySelector('#searchForm'); 
    if(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const scoreInputs = form.querySelectorAll('.grid-3 input[type="number"]');
            const rawScores = Array.from(scoreInputs).map((input) => input.value.trim());
            const hasEmptyScore = rawScores.some((value) => value === "");

            if (hasEmptyScore) {
                alert("Hay nhap diem");
                return;
            }

            const scores = rawScores.map((value) => Number(value));
            const hasInvalidScore = scores.some((score) => Number.isNaN(score) || score < 0 || score > 10);

            if (hasInvalidScore) {
                alert('Vui long nhap day du diem 3 mon (tu 0 den 10).');
                return;
            }

            const totalScore = scores.reduce((sum, score) => sum + score, 0);
            const hasFailScore = scores.some((score) => score <= 1);
            const params = new URLSearchParams({
                minScore: String(SCORE_RANGE.min),
                maxScore: String(SCORE_RANGE.max),
                totalScore: totalScore.toFixed(2),
                hasFailScore: String(hasFailScore)
            });

            window.location.href = `../tranggiaodintruong/index.html?${params.toString()}`;
        });
    }

    // 4. CHỨC NĂNG ĐỔI GIAO DIỆN SÁNG/TỐI (Tùy chọn)
    const themeBtn = document.querySelector('.theme-btn');
    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            themeBtn.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
        });
    }
});