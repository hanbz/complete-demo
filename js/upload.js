// 獲取DOM元素
const uploadContainer = document.getElementById('upload-container');
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const uploadProgress = document.getElementById('upload-progress');
const progressBar = document.getElementById('progress-bar');
const progressPercent = document.getElementById('progress-percent');
const processingStatus = document.getElementById('processing-status');
const resultContainer = document.getElementById('result-container');
const resultVideo = document.getElementById('result-video');
const downloadBtn = document.getElementById('download-btn');
const shareBtn = document.getElementById('share-btn');

// 全局變量
let uploadedFile = null;

// 點擊上傳按鈕時觸發文件選擇
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

// 文件選擇變更時處理上傳
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        handleFileUpload(file);
    }
});

// 拖放功能
uploadContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadContainer.classList.add('border-accent');
});

uploadContainer.addEventListener('dragleave', () => {
    uploadContainer.classList.remove('border-accent');
});

uploadContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadContainer.classList.remove('border-accent');
    
    if (e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];
        // 檢查是否為視頻文件
        if (file.type.startsWith('video/')) {
            handleFileUpload(file);
        } else {
            showError('請上傳視頻文件 (MP4, MOV, AVI)');
        }
    }
});

// 處理文件上傳
function handleFileUpload(file) {
    // 檢查文件大小 (500MB 上限)
    if (file.size > 500 * 1024 * 1024) {
        showError('文件大小不能超過 500MB');
        return;
    }
    
    uploadedFile = file;
    
    // 顯示上傳進度條
    uploadProgress.classList.remove('hidden');
    
    // 模擬上傳進度
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                // 上傳完成後，顯示處理中狀態
                uploadProgress.classList.add('hidden');
                processingStatus.classList.remove('hidden');
                
                // 模擬AI處理時間
                setTimeout(() => {
                    processVideo();
                }, 3000 + Math.random() * 4000); // 3-7秒的隨機處理時間
            }, 500);
        }
        
        // 更新進度條
        progressBar.style.width = `${progress}%`;
        progressPercent.textContent = `${Math.round(progress)}%`;
    }, 200);
}

// 模擬視頻處理
function processVideo() {
    // 創建一個視頻源URL
    let videoSource;
    
    // 在實際場景中，這裡會是從伺服器返回的處理後的視頻
    // 由於這是前端模擬，我們直接使用上傳的視頻
    if (uploadedFile) {
        videoSource = URL.createObjectURL(uploadedFile);
    } else {
        // 如果沒有上傳文件（例如：用戶直接測試），使用預設視頻
        videoSource = 'assets/demo-result.mp4';
    }
    
    // 設置視頻源
    resultVideo.src = videoSource;
    
    // 隱藏處理狀態、顯示結果
    processingStatus.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    // 為下載按鈕設置事件
    downloadBtn.addEventListener('click', () => {
        // 創建下載連結
        const a = document.createElement('a');
        a.href = videoSource;
        a.download = `AI_生成_${new Date().toISOString().slice(0, 10)}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
    
    // 為分享按鈕設置事件
    shareBtn.addEventListener('click', () => {
        // 檢查是否支援分享API
        if (navigator.share) {
            navigator.share({
                title: '我的AI生成視頻',
                text: '看看我用數位永生系統創建的特別問候',
                url: window.location.href
            }).catch(error => {
                console.log('分享失敗：', error);
            });
        } else {
            // 不支援分享API時，顯示提示
            alert('您的瀏覽器不支援分享功能，請手動複製鏈接分享。');
        }
    });
    
    // 自動滾動到結果區域
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// 顯示錯誤消息
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'fixed top-4 right-4 bg-red-500 text-white py-2 px-4 rounded shadow-lg z-50';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
    
    // 3秒後自動移除錯誤信息
    setTimeout(() => {
        document.body.removeChild(errorElement);
    }, 3000);
}

// 添加滾動效果
document.addEventListener('DOMContentLoaded', () => {
    // 為圖標添加互動效果
    document.querySelectorAll('.icon-circle').forEach(icon => {
        icon.addEventListener('click', function() {
            this.classList.add('scale-95', 'bg-white/30', 'shadow-white/40');
            setTimeout(() => {
                this.classList.remove('scale-95', 'bg-white/30', 'shadow-white/40');
            }, 300);
        });
    });
    
    // 為滾動提示添加平滑滾動效果
    const scrollArrow = document.querySelector('.bounce-animation');
    if (scrollArrow) {
        scrollArrow.addEventListener('click', () => {
            const uploadSection = document.getElementById('upload-section');
            if (uploadSection) {
                uploadSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // 為按鈕添加點擊音效
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // 在實際場景中，可以加入音效
            // const hoverSound = new Audio('assets/hover-sound.mp3');
            // hoverSound.volume = 0.2;
            // hoverSound.play().catch(e => console.log('音效播放失敗，可能需要用戶交互'));
        });
    });
}); 