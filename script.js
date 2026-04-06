// Global variables
let selectedFiles = [];
let generatedVideos = [];
let selectedVideos = [];
let currentStep = 1;
const plans = {
    basic: { name: 'Начальный', price: 490, duration: 'до 15 секунд' },
    standard: { name: 'Стандарт', price: 1990, duration: 'до 60 секунд' },
    premium: { name: 'Премиум', price: 3990, duration: 'до 2 минут' }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupDragAndDrop();
    setupSmoothScroll();
});

// Smooth scrolling for navigation links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll to upload section
function scrollToUpload() {
    const uploadSection = document.getElementById('upload-section');
    uploadSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Play demo video
function playDemo() {
    const demoVideo = document.getElementById('demo-video');
    demoVideo.classList.remove('hidden');
    demoVideo.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

// Close demo video
function closeDemo() {
    const demoVideo = document.getElementById('demo-video');
    demoVideo.classList.add('hidden');
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    const uploadArea = document.getElementById('upload-area');
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

// Handle multiple file selection
function handleMultipleFiles(event) {
    const files = Array.from(event.target.files);
    
    // Validate exactly 3 files
    if (files.length !== 3) {
        showNotification('Пожалуйста, загрузите ровно 3 фотографии', 'error');
        return;
    }
    
    // Validate all files
    for (let file of files) {
        if (!file.type.startsWith('image/')) {
            showNotification('Пожалуйста, выберите только изображения', 'error');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            showNotification('Размер файла не должен превышать 10MB', 'error');
            return;
        }
    }
    
    selectedFiles = files;
    showMultiplePreviews(files);
    showNotification('Фотографии успешно загружены!', 'success');
}

// Show multiple photo previews
function showMultiplePreviews(files) {
    const previewArea = document.getElementById('preview-area');
    const photosGrid = document.getElementById('photos-grid');
    const uploadArea = document.getElementById('upload-area');
    
    // Clear existing previews
    photosGrid.innerHTML = '';
    
    // Create preview for each file
    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'relative group';
            photoDiv.innerHTML = `
                <img src="${e.target.result}" class="w-full h-48 object-cover rounded-lg" alt="Photo ${index + 1}">
                <div class="absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition">
                    <span class="text-xs font-semibold text-purple-600">${index + 1}</span>
                </div>
            `;
            photosGrid.appendChild(photoDiv);
        };
        reader.readAsDataURL(file);
    });
    
    previewArea.classList.remove('hidden');
    uploadArea.classList.add('hidden');
}

// Remove all files
function removeFiles() {
    selectedFiles = [];
    const previewArea = document.getElementById('preview-area');
    const uploadArea = document.getElementById('upload-area');
    const photosGrid = document.getElementById('photos-grid');
    
    previewArea.classList.add('hidden');
    uploadArea.classList.remove('hidden');
    photosGrid.innerHTML = '';
    
    // Reset file input
    document.getElementById('file-input').value = '';
    
    showNotification('Фотографии удалены', 'info');
}

// Generate videos from photos
function generateVideos() {
    if (selectedFiles.length !== 3) {
        showNotification('Пожалуйста, загрузите 3 фотографии', 'error');
        return;
    }
    
    showNotification('Генерация видео началась...', 'info');
    
    // Simulate video generation
    setTimeout(() => {
        generatedVideos = [
            { id: 1, url: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Video+1', title: 'Вариант 1' },
            { id: 2, url: 'https://via.placeholder.com/400x300/764ba2/ffffff?text=Video+2', title: 'Вариант 2' },
            { id: 3, url: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Video+3', title: 'Вариант 3' }
        ];
        
        showGeneratedVideos();
        showNotification('Видео сгенерированы! Выберите понравившиеся.', 'success');
    }, 3000);
}

// Show generated videos
function showGeneratedVideos() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const videosGrid = document.getElementById('videos-grid');
    
    // Hide step 1, show step 2
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
    
    // Clear and populate videos grid
    videosGrid.innerHTML = '';
    
    generatedVideos.forEach(video => {
        const videoDiv = document.createElement('div');
        videoDiv.className = 'relative group';
        videoDiv.innerHTML = `
            <div class="relative">
                <img src="${video.url}" class="w-full h-48 object-cover rounded-lg cursor-pointer" alt="${video.title}">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition rounded-lg flex items-center justify-center">
                    <input type="checkbox" class="video-checkbox w-6 h-6 opacity-0 group-hover:opacity-100 transition" data-video-id="${video.id}">
                </div>
                <div class="absolute top-2 left-2 bg-white rounded-full px-2 py-1">
                    <span class="text-xs font-semibold text-purple-600">${video.title}</span>
                </div>
            </div>
        `;
        videosGrid.appendChild(videoDiv);
    });
    
    // Add click handlers
    document.querySelectorAll('.video-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleVideoSelection);
    });
}

// Handle video selection
function handleVideoSelection(event) {
    const videoId = parseInt(event.target.dataset.videoId);
    const isChecked = event.target.checked;
    
    if (isChecked) {
        selectedVideos.push(videoId);
    } else {
        selectedVideos = selectedVideos.filter(id => id !== videoId);
    }
    
    console.log('Selected videos:', selectedVideos);
}

// Merge selected videos
function mergeSelectedVideos() {
    if (selectedVideos.length === 0) {
        showNotification('Пожалуйста, выберите хотя бы одно видео', 'error');
        return;
    }
    
    showNotification('Объединение видео...', 'info');
    
    // Simulate merging
    setTimeout(() => {
        showFinalVideo();
        showNotification('Видео успешно объединено!', 'success');
    }, 2000);
}

// Show final video
function showFinalVideo() {
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const finalVideo = document.getElementById('final-video');
    
    // Hide step 2, show step 3
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
    
    // Show final video
    finalVideo.innerHTML = `
        <div class="max-w-2xl mx-auto">
            <div class="bg-gray-100 rounded-lg p-4 mb-6">
                <video class="w-full rounded-lg" controls>
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                    Ваш браузер не поддерживает видео.
                </video>
            </div>
            <div class="flex gap-4 justify-center">
                <button onclick="downloadVideo()" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
                    <i class="fas fa-download mr-2"></i>
                    Скачать видео
                </button>
                <button onclick="shareVideo()" class="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition">
                    <i class="fas fa-share-alt mr-2"></i>
                    Поделиться
                </button>
            </div>
        </div>
    `;
}

// Download video
function downloadVideo() {
    showNotification('Начинается скачивание видео...', 'info');
    // In production, trigger actual download
}

// Share video
function shareVideo() {
    if (navigator.share) {
        navigator.share({
            title: 'AI Видео Подарок',
            text: 'Посмотрите на удивительное видео, созданное из старых фотографий!',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showNotification('Ссылка скопирована в буфер обмена!', 'success');
    }
}

// Select pricing plan
function selectPlan(planType) {
    selectedPlan = planType;
    const plan = plans[planType];
    
    // Update modal content
    const planInfo = document.getElementById('selected-plan-info');
    planInfo.innerHTML = `
        <div class="flex justify-between items-center">
            <div>
                <h4 class="font-semibold text-lg">${plan.name} план</h4>
                <p class="text-gray-600">Длительность видео: ${plan.duration}</p>
            </div>
            <div class="text-2xl font-bold text-purple-600">${plan.price}₽</div>
        </div>
    `;
    
    // Show modal
    const modal = document.getElementById('payment-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Close payment modal
function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    selectedPlan = null;
}

// Process payment
function processPayment(event) {
    event.preventDefault();
    
    if (!selectedPlan) {
        showNotification('Пожалуйста, выберите тарифный план', 'error');
        return;
    }
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const paymentMethod = formData.get('payment');
    
    // Show processing state
    showNotification('Обработка платежа...', 'info');
    
    // Process payment based on method
    if (paymentMethod === 'mia') {
        processMIAPayment(email);
    } else if (paymentMethod === 'card') {
        processCardPayment(email);
    }
}

// Process MIA payment (Moldova)
function processMIAPayment(email) {
    const plan = plans[selectedPlan];
    
    // Create MIA payment data
    const paymentData = {
        merchant_id: 'YOUR_MIA_MERCHANT_ID',
        order_id: generateOrderId(),
        amount: plan.price,
        currency: 'MDL',
        description: `AI Video Gift - ${plan.name}`,
        customer_email: email,
        success_url: window.location.origin + '/payment-success',
        fail_url: window.location.origin + '/payment-fail',
        callback_url: window.location.origin + '/payment-callback',
        lang: currentLanguage
    };
    
    // In production, this would make API call to MIA
    console.log('MIA Payment Data:', paymentData);
    
    // Simulate MIA redirect
    setTimeout(() => {
        showNotification('Перенаправление на страницу оплаты MIA...', 'info');
        // In production: window.location.href = 'https://mia.md/payment?' + new URLSearchParams(paymentData);
        
        // For demo, simulate success
        setTimeout(() => {
            completePayment(email);
        }, 2000);
    }, 1000);
}


// Process card payment
function processCardPayment(email) {
    const plan = plans[selectedPlan];
    
    // Create card payment data
    const paymentData = {
        merchant_id: 'YOUR_CARD_MERCHANT_ID',
        order_id: generateOrderId(),
        amount: plan.price,
        currency: 'MDL',
        description: `AI Video Gift - ${plan.name}`,
        customer_email: email
    };
    
    console.log('Card Payment Data:', paymentData);
    
    // Simulate card processing
    setTimeout(() => {
        completePayment(email);
    }, 2000);
}

// Complete payment
function completePayment(email) {
    closePaymentModal();
    showNotification(`Платеж успешно обработан! Видео будет отправлено на ${email} в течение 24 часов.`, 'success');
    
    // Reset form
    document.querySelector('#payment-modal form').reset();
    removeFile();
    
    // Track conversion
    trackEvent('payment_completed', {
        plan: selectedPlan,
        amount: plans[selectedPlan].price,
        currency: 'MDL'
    });
}

// Generate unique order ID
function generateOrderId() {
    return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    
    // Set color based on type
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    notification.classList.add(...colors[type].split(' '));
    
    // Add content
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('payment-modal');
    if (event.target === modal) {
        closePaymentModal();
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePaymentModal();
    }
});

// Add loading states
function showLoading(element, text = 'Загрузка...') {
    const originalContent = element.innerHTML;
    element.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${text}`;
    element.disabled = true;
    
    return () => {
        element.innerHTML = originalContent;
        element.disabled = false;
    };
}

// Add form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add analytics tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    console.log('Track event:', eventName, properties);
    // In a real implementation, this would send data to analytics service
}

// Add smooth reveal animations on scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.hover-scale').forEach(el => {
        observer.observe(el);
    });
}

// Initialize scroll animations
setupScrollAnimations();

// Add CSS animation class
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification {
        min-width: 300px;
        max-width: 400px;
    }
`;
document.head.appendChild(style);
