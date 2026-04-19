// File: script.js

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');

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
            window.location.href = 'tranggiaodintruong.html';
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