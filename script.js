// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Referensi Elemen DOM ---
    const introScreen  = document.getElementById('intro');
    const mainSlides   = document.getElementById('main-slides');
    const gift         = document.getElementById('gift');
    const slides       = document.querySelectorAll('.slide');
    const dots         = document.querySelectorAll('.dot');
    const bgMusic      = document.getElementById('bg-music');
    const musicToggle  = document.getElementById('music-toggle');
    const navLeft      = document.getElementById('nav-left');
    const navRight     = document.getElementById('nav-right');
    const nameTypewriter = document.getElementById('name-typewriter');
    const modal        = document.getElementById('image-modal');
    const modalImg     = document.getElementById('modal-img');

    // --- State ---
    let currentSlide = 0;
    const totalSlides = slides.length;
    const targetName  = "Nabila Nurul Aini"; // Ganti nama di sini

    // ===========================
    // MUSIK
    // ===========================
    let isMusicPlaying = false;
    const MUSIC_START_TIME = 156; // Mulai dari menit 2:36

    const startMusic = () => {
        if (bgMusic.currentTime === 0 || bgMusic.currentTime < MUSIC_START_TIME) {
            bgMusic.currentTime = MUSIC_START_TIME;
        }
        bgMusic.play().catch(() => {});
        musicToggle.classList.remove('muted');
        isMusicPlaying = true;
    };

    const toggleMusic = () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.classList.add('muted');
        } else {
            startMusic();
        }
        isMusicPlaying = !isMusicPlaying;
    };
    musicToggle.addEventListener('click', toggleMusic);

    // Musik hanya dimulai saat kado diklik (lihat handler BUKA KADO di bawah)

    // ===========================
    // BUNGA JATUH — Background Pasif
    // ===========================
    const flowerEmojis = ['🌸', '🌺', '💮', '🌷', '🌼'];
    const createFlower = (forced = false) => {
        const flower = document.createElement('div');
        flower.classList.add('flower-piece');
        flower.innerHTML = flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)];
        flower.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 1.5 + 0.9;
        flower.style.fontSize = size + 'rem';
        flower.style.animationDuration = (Math.random() * 5 + 7) + 's';
        document.body.appendChild(flower);
        setTimeout(() => flower.remove(), 12500);
    };
    // Bunga pasif terus muncul setiap detik
    setInterval(createFlower, 1000);

    // ===========================
    // LEDAKAN BUNGA & HATI DARI KADO (3 detik penuh)
    // ===========================
    const createGiftBurst = () => {
        const items = ['🌸', '🌺', '💮', '🌷', '❤️', '💖', '💝', '💕', '💘', '🌼', '✨', '🎀'];
        const rect  = gift.getBoundingClientRect();
        const cx    = rect.left + rect.width / 2;
        const cy    = rect.top  + rect.height / 2;

        // Tiga gelombang ledakan selama 3 detik
        const wave = (count, delay, distMultiplier) => {
            setTimeout(() => {
                for (let i = 0; i < count; i++) {
                    const p = document.createElement('div');
                    p.classList.add('burst-particle');
                    p.innerHTML = items[Math.floor(Math.random() * items.length)];
                    p.style.left = cx + 'px';
                    p.style.top  = cy + 'px';

                    const angle    = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 320 * distMultiplier + 80;
                    p.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
                    p.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
                    p.style.fontSize = (Math.random() * 1.8 + 1) + 'rem';
                    p.style.animationDuration = (Math.random() * 1 + 1.5) + 's';

                    document.body.appendChild(p);
                    setTimeout(() => p.remove(), 3000);
                }
            }, delay);
        };

        wave(60, 0,    1.0);  // Gelombang 1 — segera
        wave(50, 800,  1.2);  // Gelombang 2 — setelah 0.8 detik
        wave(60, 1800, 1.5);  // Gelombang 3 — setelah 1.8 detik, lebih jauh
    };

    // ===========================
    // BUKA KADO
    // ===========================
    gift.addEventListener('click', () => {
        if (gift.classList.contains('open')) return; // Cegah dobel klik
        gift.classList.add('open');
        createGiftBurst(); // Semburan meriah 3 gelombang

        // Putar musik dari menit 2:36 — klik kado = interaksi user, pasti diizinkan browser
        startMusic();

        // Tunggu 3.2 detik (biar bunga sempat memenuhi layar) baru masuk slide
        setTimeout(() => {
            introScreen.style.opacity = '0';
            setTimeout(() => {
                introScreen.classList.remove('active');
                introScreen.style.display = 'none';
                mainSlides.classList.add('active');
                updateSlide(0);
            }, 600);
        }, 3200);
    });

    // ===========================
    // SISTEM SLIDE & NAVIGASI
    // ===========================
    const updateSlide = (newIndex) => {
        slides[currentSlide].classList.remove('active');
        currentSlide = newIndex;
        slides[currentSlide].classList.add('active');
        triggerSlideAnimations(currentSlide);
    };

    const nextSlide = () => { if (currentSlide < totalSlides - 1) updateSlide(currentSlide + 1); };
    const prevSlide = () => { if (currentSlide > 0) updateSlide(currentSlide - 1); };

    // Klik kanan/kiri layar — kecuali di area album slide 2
    navRight.addEventListener('click', (e) => {
        if (currentSlide === 1) return; // album punya logika sendiri
        nextSlide();
    });
    navLeft.addEventListener('click', (e) => {
        if (currentSlide === 1) return;
        prevSlide();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft')  prevSlide();
    });

    // Swipe (mobile)
    let touchStartX = 0, touchEndX = 0;
    document.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; });
    document.addEventListener('touchend',   e => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) < 50) return;
        if (currentSlide === 1) return; // album punya logika sendiri
        diff > 0 ? nextSlide() : prevSlide();
    });

    // ===========================
    // ANIMASI PER-SLIDE
    // ===========================
    const triggerSlideAnimations = (index) => {
        if (index === 0) {
            typeWriterEffect(targetName, nameTypewriter, 130);
        }
        if (index === 3) {
            // Confetti pastel saat slide penutup
            setTimeout(() => spawnConfetti(), 800);
        }
    };

    const spawnConfetti = () => {
        const colors = ['#ffb6c1', '#ffc0cb', '#ff69b4', '#fff0f5', '#ffd1dc'];
        for (let i = 0; i < 120; i++) {
            const el = document.createElement('div');
            el.classList.add('confetti-piece');
            el.style.left = Math.random() * 100 + 'vw';
            el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            el.style.animationDuration = (Math.random() * 3 + 2) + 's';
            el.style.animationDelay    = Math.random() * 2 + 's';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 5500);
        }
    };

    // ===========================
    // TYPEWRITER EFFECT
    // ===========================
    let twTimeout;
    const typeWriterEffect = (text, el, speed = 120) => {
        el.innerHTML = '';
        el.style.borderRight = '3px solid #e91e8c';
        clearTimeout(twTimeout);
        let i = 0;
        const type = () => {
            if (i < text.length) {
                el.innerHTML += text.charAt(i++);
                twTimeout = setTimeout(type, speed);
            } else {
                el.style.animation = 'blinkCaret .75s step-end infinite';
            }
        };
        twTimeout = setTimeout(type, 700);
    };
    // Keyframe kursor berkedip
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        @keyframes blinkCaret {
            from, to { border-color: transparent }
            50% { border-color: #e91e8c; }
        }
    `;
    document.head.appendChild(styleEl);

    // ===========================
    // ALBUM FOTO — SWIPE STACK
    // ===========================
    const albumStack = document.getElementById('album-stack');
    const albumCards = Array.from(document.querySelectorAll('.album-card'));
    const albumCurrentEl = document.getElementById('album-current');
    const albumTotalEl   = document.getElementById('album-total');
    let albumIndex = 0;
    const TOTAL_ALBUM = albumCards.length;

    albumTotalEl.textContent = TOTAL_ALBUM;

    // Inisialisasi posisi kartu di tumpukan
    const renderAlbum = () => {
        albumCards.forEach((card, i) => {
            const offset = i - albumIndex;
            card.removeAttribute('data-state');
            card.classList.remove('swipe-left', 'swipe-right');
            if (offset === 0)       card.setAttribute('data-state', 'active');
            else if (offset === 1)  card.setAttribute('data-state', 'next-1');
            else if (offset === 2)  card.setAttribute('data-state', 'next-2');
            else if (offset === 3)  card.setAttribute('data-state', 'next-3');
            else                    card.setAttribute('data-state', 'hidden');
        });
        albumCurrentEl.textContent = albumIndex + 1;
    };

    const goNextAlbum = () => {
        if (albumIndex >= TOTAL_ALBUM - 1) {
            // Sudah di kartu terakhir, pindah ke slide berikutnya
            nextSlide();
            return;
        }
        const activeCard = albumCards[albumIndex];
        activeCard.classList.add('swipe-left');
        albumIndex++;
        setTimeout(renderAlbum, 80);
    };

    const goPrevAlbum = () => {
        if (albumIndex <= 0) {
            // Sudah di kartu pertama, pindah ke slide sebelumnya
            prevSlide();
            return;
        }
        albumIndex--;
        renderAlbum();
    };

    // Swipe / drag pada album
    let dragStartX = 0, dragging = false;

    albumStack.addEventListener('mousedown', (e) => {
        dragStartX = e.clientX;
        dragging = true;
    });
    albumStack.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const diff = e.clientX - dragStartX;
        if (albumCards[albumIndex]) {
            albumCards[albumIndex].style.transform = `translateX(${diff}px) rotate(${diff * 0.05}deg)`;
        }
    });
    albumStack.addEventListener('mouseup', (e) => {
        if (!dragging) return;
        dragging = false;
        const diff = e.clientX - dragStartX;
        const activeCard = albumCards[albumIndex];
        activeCard.style.transform = '';
        if (diff < -60) goNextAlbum();
        else if (diff > 60) goPrevAlbum();
    });
    albumStack.addEventListener('mouseleave', () => {
        if (dragging) {
            dragging = false;
            if (albumCards[albumIndex]) albumCards[albumIndex].style.transform = '';
        }
    });

    // Touch swipe album
    let albumTouchStart = 0;
    albumStack.addEventListener('touchstart', e => { albumTouchStart = e.changedTouches[0].clientX; });
    albumStack.addEventListener('touchend', e => {
        const diff = albumTouchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? goNextAlbum() : goPrevAlbum();
    });

    // Nav klik kanan/kiri saat di slide album
    navRight.addEventListener('click', () => {
        if (currentSlide === 1) goNextAlbum();
    });
    navLeft.addEventListener('click', () => {
        if (currentSlide === 1) goPrevAlbum();
    });

    // Klik foto untuk zoom
    albumCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (Math.abs(dragStartX - e.clientX) > 10) return;
            const img = card.querySelector('img');
            if (img && card.getAttribute('data-state') === 'active') {
                modal.classList.add('active');
                modalImg.src = img.src;
            }
        });
    });

    // Inisialisasi album pertama
    renderAlbum();

    // ===========================
    // MODAL TUTUP
    // ===========================
    modal.addEventListener('click', () => modal.classList.remove('active'));

    // ===========================
    // SEGEL HATI (SLIDE 3) — Burst Hati
    // ===========================
    const loveSeal = document.querySelector('.love-seal');
    if (loveSeal) {
        loveSeal.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = loveSeal.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top  + rect.height / 2;
            const heartEmojis = ['❤️', '💖', '💝', '💕', '💘', '🌸', '💗'];
            for (let i = 0; i < 40; i++) {
                const p = document.createElement('div');
                p.classList.add('burst-particle');
                p.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
                p.style.left = cx + 'px';
                p.style.top  = cy + 'px';
                const angle = Math.random() * Math.PI * 2;
                const dist  = Math.random() * 160 + 50;
                p.style.setProperty('--x', `${Math.cos(angle) * dist}px`);
                p.style.setProperty('--y', `${Math.sin(angle) * dist}px`);
                p.style.fontSize = (Math.random() + 1) + 'rem';
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 2200);
            }
        });
    }

    // Inisialisasi slide pertama
    triggerSlideAnimations(0);
});
