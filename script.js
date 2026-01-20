// Birthday Website JavaScript - Music Player
// Tất cả các hiệu ứng và tương tác được xử lý ở đây

document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo các hiệu ứng khi trang load
    initializeAnimations();
    initializeCarousel();
    initializeSurpriseButton();
    initializeMusicPlayer();
    createConfetti();
});

// Khởi tạo music player với Web Audio API
function initializeMusicPlayer() {
    const musicBtn = document.getElementById('musicBtn');
    const birthdayAudio = document.getElementById('birthdayAudio');
    let isPlaying = false;

    // Đảm bảo audio sẵn sàng
    birthdayAudio.volume = 0.7; // âm lượng vừa phải

    musicBtn.addEventListener('click', async () => {
        try {
            if (!isPlaying) {
                await birthdayAudio.play();
                musicBtn.innerHTML = '<i class="fas fa-pause"></i><span>Pause Birthday Song</span>';
                musicBtn.classList.add('playing');
                isPlaying = true;
            } else {
                birthdayAudio.pause();
                musicBtn.innerHTML = '<i class="fas fa-music"></i><span>Play Birthday Song</span>';
                musicBtn.classList.remove('playing');
                isPlaying = false;
            }
        } catch (err) {
            console.error("Không thể phát nhạc:", err);
            musicBtn.innerHTML = '<i class="fas fa-music"></i><span>Audio not supported</span>';
        }
    });
}

// Tạo nhạc Happy Birthday bằng Web Audio API
function playHappyBirthdaySong() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Nốt nhạc Happy Birthday (tần số Hz)
        const notes = [
            { freq: 261.63, duration: 0.5 }, // C4
            { freq: 261.63, duration: 0.5 }, // C4
            { freq: 293.66, duration: 1.0 }, // D4
            { freq: 261.63, duration: 1.0 }, // C4
            { freq: 349.23, duration: 1.0 }, // F4
            { freq: 329.63, duration: 2.0 }, // E4
        ];
        
        let currentTime = audioContext.currentTime;
        
        notes.forEach((note, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(note.freq, currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
            
            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.duration);
            
            currentTime += note.duration;
        });
        
        // Lặp lại sau khi kết thúc
        setTimeout(() => {
            if (isPlaying) {
                playHappyBirthdaySong();
            }
        }, currentTime * 1000);
        
    } catch (error) {
        console.log('Cannot create audio context:', error);
        musicBtn.innerHTML = '<i class="fas fa-music"></i><span>Audio not supported</span>';
    }
}

// Khởi tạo carousel cho hình ảnh
function initializeCarousel() {
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    const totalSlides = carousel.children.length;
    
    // Hàm chuyển slide
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Cập nhật indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Event listeners cho nút điều hướng
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(currentSlide);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        });
    }
    
    // Event listeners cho indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Auto-play carousel - tự động chạy ngang
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 3000); // Chuyển slide mỗi 3 giây
    
    // Thêm hiệu ứng hover cho hình ảnh
    const images = document.querySelectorAll('.carousel-image');
    images.forEach(img => {
        img.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
        });
        
        img.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
}

// Khởi tạo các animation cơ bản
function initializeAnimations() {
    // Thêm hiệu ứng typing cho tiêu đề chính
    const mainTitle = document.getElementById('main-title');
    if (mainTitle) {
        setTimeout(() => {
            mainTitle.classList.add('typing');
        }, 1000);
    }
    
    // Tạo hiệu ứng floating elements liên tục
    createFloatingElements();
}

// Tạo hiệu ứng confetti
function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#ff6b9d', '#ffc0cb', '#ffb6c1', '#ff69b4', '#ff1493'];
    
    // Tạo confetti ban đầu
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfettiPiece(confettiContainer, colors);
        }, i * 100);
    }
    
    // Tạo confetti định kỳ
    setInterval(() => {
        createConfettiPiece(confettiContainer, colors);
    }, 2000);
}

function createConfettiPiece(container, colors) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(confetti);
    
    // Xóa confetti sau khi animation kết thúc
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, 5000);
}

// Tạo floating elements liên tục
function createFloatingElements() {
    const elementsContainer = document.querySelector('.floating-elements');
    const elements = ['🎈', '🎂', '🎁', '✨', '🌟', '🎀', '🎊', '🎉'];
    
    setInterval(() => {
        const element = document.createElement('div');
        element.className = 'floating-item';
        element.textContent = elements[Math.floor(Math.random() * elements.length)];
        element.style.left = Math.random() * 100 + '%';
        element.style.animationDuration = (Math.random() * 3 + 4) + 's';
        
        elementsContainer.appendChild(element);
        
        // Xóa element sau khi animation kết thúc
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 7000);
    }, 3000);
}

// Khởi tạo nút surprise
function initializeSurpriseButton() {
    const surpriseBtn = document.getElementById('surpriseBtn');
    const surpriseContent = document.getElementById('surpriseContent');
    const surpriseSection = document.querySelector('.surprise-section');
    
    if (surpriseBtn && surpriseContent && surpriseSection) {
        surpriseBtn.addEventListener('click', () => {
            // Hiển thị nội dung surprise
            surpriseContent.classList.add('show');
            
            // Tự động scroll đến surprise section
            surpriseSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Tạo hiệu ứng pháo hoa
            createFireworkEffect();
            
            // Tạo thêm confetti khi click surprise
            createSurpriseConfetti();
            
            // Ẩn nút sau khi click
            surpriseBtn.style.display = 'none';
            
            // Hiển thị lại nút sau 5 giây
            setTimeout(() => {
                surpriseBtn.style.display = 'inline-block';
                surpriseContent.classList.remove('show');
            }, 60000);
        });
    }
}

// Tạo hiệu ứng pháo hoa
function createFireworkEffect() {
    const surpriseContent = document.getElementById('surpriseContent');
    const firework = surpriseContent.querySelector('.firework');
    
    if (firework) {
        firework.style.animation = 'none';
        firework.offsetHeight; // Trigger reflow
        firework.style.animation = 'firework-explode 1s ease-out';
    }
}

// Tạo confetti đặc biệt khi click surprise
function createSurpriseConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    const colors = ['#ff6b9d', '#ffc0cb', '#ffb6c1', '#ff69b4', '#ff1493', '#ffb6c1'];
    
    // Tạo nhiều confetti hơn
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createConfettiPiece(confettiContainer, colors);
        }, i * 20);
    }
}

// Console message cho developer
console.log('🎉 Happy Birthday Website loaded successfully!');
console.log('🎵 Music player with Web Audio API');
console.log('💖 Made with love for Ngô Hằng');
console.log('✨ Enjoy the animations and effects!');