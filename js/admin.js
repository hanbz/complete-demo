// 後台管理系統 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 初始化側邊欄控制
    initSidebar();
    
    // 初始化用戶選單
    initUserMenu();
    
    // 初始化表格和數據
    initDataTables();
    
    // 初始化進度條動畫
    initProgressBars();
    
    // 初始化圖表
    initCharts();
    
    // 初始化通知功能
    initNotifications();
});

// 側邊欄收合功能
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    const header = document.querySelector('header');
    const toggleBtn = document.getElementById('toggle-sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sidebarLabels = document.querySelectorAll('.sidebar-link span');
    const sidebarUserInfo = document.querySelectorAll('.sidebar-user-info');
    const toggleIcon = toggleBtn.querySelector('i');
    
    // 檢查本地存儲的側邊欄狀態
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
    // 設置初始狀態
    if (isCollapsed) {
        sidebar.classList.add('collapsed');
        content.style.marginLeft = '64px';
        if (header) header.style.left = '64px';
    } else {
        sidebar.classList.remove('collapsed');
        content.style.marginLeft = '240px';
        if (header) header.style.left = '240px';
    }
    
    // 檢查是否為移動設備
    function checkScreenSize() {
        if (window.innerWidth <= 767) {
            // 小螢幕時自動收合側邊欄
            if (!sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('collapsed');
                content.style.marginLeft = '64px';
                if (header) header.style.left = '64px';
                localStorage.setItem('sidebarCollapsed', 'true');
            }
        } else {
            // 讀取用戶儲存的偏好設置
            const savedState = localStorage.getItem('sidebarCollapsed');
            if (savedState !== null) {
                const shouldBeCollapsed = savedState === 'true';
                const isCurrentlyCollapsed = sidebar.classList.contains('collapsed');
                
                if (isCurrentlyCollapsed !== shouldBeCollapsed) {
                    if (shouldBeCollapsed) {
                        sidebar.classList.add('collapsed');
                        content.style.marginLeft = '64px';
                        if (header) header.style.left = '64px';
                    } else {
                        sidebar.classList.remove('collapsed');
                        content.style.marginLeft = '240px';
                        if (header) header.style.left = '240px';
                    }
                }
            }
        }
    }
    
    // 初始化時檢查屏幕尺寸
    checkScreenSize();
    
    // 當視窗大小變化時檢查
    window.addEventListener('resize', checkScreenSize);
    
    // 切換側邊欄
    toggleBtn.addEventListener('click', function() {
        const isNowCollapsed = sidebar.classList.contains('collapsed');
        
        if (isNowCollapsed) {
            // 展開側邊欄
            sidebar.classList.remove('collapsed');
            content.style.marginLeft = '240px';
            if (header) header.style.left = '240px';
            localStorage.setItem('sidebarCollapsed', 'false');
        } else {
            // 收起側邊欄
            sidebar.classList.add('collapsed');
            content.style.marginLeft = '64px';
            if (header) header.style.left = '64px';
            localStorage.setItem('sidebarCollapsed', 'true');
        }
    });
    
    // 側邊欄選單項點擊效果
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!link.getAttribute('href').startsWith('http') && 
                !link.getAttribute('href').startsWith('index.html')) {
                e.preventDefault();
                sidebarLinks.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
                
                // 更新頁面標題
                const pageTitle = this.querySelector('span') ? 
                                 this.querySelector('span').textContent.trim() : 
                                 '';
                if (pageTitle) updatePageTitle(pageTitle);
                
                // 處理頁面切換
                const pageId = this.getAttribute('href').replace('#', '');
                switchPage(pageId);
            }
        });
    });
    
    // 側邊欄hover效果 - 小螢幕上自動展開
    if (window.innerWidth <= 767) {
        sidebar.addEventListener('mouseenter', function() {
            if (sidebar.classList.contains('collapsed')) {
                sidebar.classList.add('hovered');
            }
        });
        
        sidebar.addEventListener('mouseleave', function() {
            sidebar.classList.remove('hovered');
        });
    }
}

// 用戶選單控制
function initUserMenu() {
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    
    if (!userMenuButton || !userMenu) return;
    
    userMenuButton.addEventListener('click', function(e) {
        e.stopPropagation();
        userMenu.classList.toggle('hidden');
        
        // 添加顯示動畫
        if (!userMenu.classList.contains('hidden')) {
            userMenu.style.opacity = '0';
            userMenu.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                userMenu.style.transition = 'all 0.2s ease-out';
                userMenu.style.opacity = '1';
                userMenu.style.transform = 'translateY(0)';
            }, 10);
        }
    });
    
    // 點擊外部關閉選單
    document.addEventListener('click', function(e) {
        if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.add('hidden');
        }
    });
}

// 表格和數據初始化
function initDataTables() {
    const tableRows = document.querySelectorAll('tbody tr');
    
    // 表格行懸停效果
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.classList.add('bg-gray-50');
        });
        
        row.addEventListener('mouseleave', function() {
            this.classList.remove('bg-gray-50');
        });
    });
    
    // 表格操作按鈕效果
    document.querySelectorAll('td button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 模擬操作回饋效果
            if (!this.classList.contains('cursor-not-allowed')) {
                const originalColor = this.style.color;
                const originalTransform = this.style.transform;
                
                this.style.transform = 'scale(1.2)';
                
                setTimeout(() => {
                    this.style.transform = originalTransform;
                }, 150);
                
                // 如果是刪除按鈕，模擬確認對話框
                if (this.querySelector('.fa-trash')) {
                    if (confirm('確定要刪除這個項目嗎？')) {
                        const row = this.closest('tr');
                        row.style.transition = 'all 0.3s ease-out';
                        row.style.opacity = '0';
                        row.style.transform = 'translateX(20px)';
                        
                        setTimeout(() => {
                            row.remove();
                        }, 300);
                    }
                }
                
                // 如果是查看按鈕，模擬預覽
                if (this.querySelector('.fa-eye')) {
                    showPreviewModal(this.closest('tr'));
                }
                
                // 如果是下載按鈕，模擬下載
                if (this.querySelector('.fa-download')) {
                    simulateDownload(this.closest('tr'));
                }
            }
        });
    });
    
    // 模擬數據加載動畫
    setTimeout(() => {
        document.querySelectorAll('.data-row').forEach(row => {
            row.style.opacity = '1';
        });
    }, 100);
}

// 進度條動畫
function initProgressBars() {
    const progressBars = document.querySelectorAll('.bg-admin-success, .bg-admin-accent, .bg-admin-warning, .bg-admin-danger');
    
    progressBars.forEach(bar => {
        const originalWidth = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 1s cubic-bezier(0.165, 0.84, 0.44, 1)';
            bar.style.width = originalWidth;
        }, 300);
    });
}

// 圖表初始化
function initCharts() {
    // 初始化系統使用趨勢圖表
    initTrendsChart();
    
    // 初始化用戶分布圖表
    initDistributionChart();
    
    // 初始化項目進度圖表
    initProjectsProgressChart();
    
    // 初始化項目類型分布圖表
    initProjectsTypeChart();
}

// 初始化系統使用趨勢圖表
function initTrendsChart() {
    const ctx = document.getElementById('trendsChart');
    if (!ctx) return;
    
    // 生成7天的假數據
    const data7Days = generateTrendsData(7);
    
    // 圖表配置
    const config = {
        type: 'line',
        data: {
            labels: data7Days.labels,
            datasets: [
                {
                    label: '活躍用戶',
                    data: data7Days.activeUsers,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: '上傳數量',
                    data: data7Days.uploads,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: '處理數量',
                    data: data7Days.processed,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    titleColor: '#2c3e50',
                    bodyColor: '#2c3e50',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    padding: 10,
                    boxPadding: 5,
                    cornerRadius: 4,
                    usePointStyle: true
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear'
                }
            }
        }
    };
    
    // 創建圖表實例
    const trendsChart = new Chart(ctx, config);
    
    // 處理時間範圍選擇
    const rangeSelect = document.getElementById('trendsRangeSelect');
    if (rangeSelect) {
        rangeSelect.addEventListener('change', function() {
            let days = 7;
            
            // 根據選擇的選項確定天數
            if (this.value === '過去 30 天') {
                days = 30;
            } else if (this.value === '過去 3 個月') {
                days = 90;
            } else {
                days = 7; // 默認是7天
            }
            
            // 生成新數據
            const newData = generateTrendsData(days);
            
            // 更新圖表數據
            trendsChart.data.labels = newData.labels;
            trendsChart.data.datasets[0].data = newData.activeUsers;
            trendsChart.data.datasets[1].data = newData.uploads;
            trendsChart.data.datasets[2].data = newData.processed;
            
            // 重新繪製圖表
            trendsChart.update();
        });
    }
}

// 生成假數據
function generateTrendsData(days) {
    const labels = [];
    const activeUsers = [];
    const uploads = [];
    const processed = [];
    
    // 生成日期標籤
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // 格式化日期為 MM/DD 格式
        const month = date.getMonth() + 1;
        const day = date.getDate();
        labels.push(`${month}/${day}`);
        
        // 生成隨機數據，但保持一定的趨勢和合理性
        const baseActiveUsers = 200 + Math.floor(Math.random() * 100);
        // 添加趨勢：周末用戶活躍度增加
        const dayOfWeek = date.getDay();
        const weekendBoost = (dayOfWeek === 0 || dayOfWeek === 6) ? 50 : 0;
        // 添加趨勢：整體增長趨勢
        const growthTrend = Math.floor(i * 1.5);
        
        // 活躍用戶：基礎值 + 周末提升 + 增長趨勢 + 一些隨機波動
        const activeUser = baseActiveUsers + weekendBoost - growthTrend + Math.floor(Math.random() * 30 - 15);
        activeUsers.push(activeUser);
        
        // 上傳數量：約為活躍用戶的 15-25%
        const uploadCount = Math.floor(activeUser * (0.15 + Math.random() * 0.1));
        uploads.push(uploadCount);
        
        // 處理數量：約為上傳數量的 80-100%
        const processedCount = Math.floor(uploadCount * (0.8 + Math.random() * 0.2));
        processed.push(processedCount);
    }
    
    return { labels, activeUsers, uploads, processed };
}

// 更新圖表選項下拉選單
function updateTrendsSelectOptions() {
    const rangeSelect = document.getElementById('trendsRangeSelect');
    if (rangeSelect) {
        rangeSelect.innerHTML = `
            <option value="過去 7 天">過去 7 天</option>
            <option value="過去 30 天">過去 30 天</option>
            <option value="過去 3 個月">過去 3 個月</option>
        `;
    }
}

// 通知功能
function initNotifications() {
    const notificationBtn = document.querySelector('.fa-bell').closest('button');
    
    if (!notificationBtn) return;
    
    notificationBtn.addEventListener('click', function() {
        showNotificationsPanel();
    });
}

// 更新頁面標題
function updatePageTitle(title) {
    const mainTitle = document.querySelector('main h2');
    const mainDescription = document.querySelector('main p.text-gray-500');
    
    if (mainTitle) {
        mainTitle.textContent = title;
    }
    
    if (mainDescription) {
        mainDescription.textContent = `歡迎來到${title}頁面，您可以在這裡管理相關內容。`;
    }
}

// 顯示預覽模態框
function showPreviewModal(row) {
    if (!row) return;
    
    const videoName = row.querySelector('td:nth-child(3)').textContent;
    const videoStatus = row.querySelector('td:nth-child(4) span').textContent;
    
    // 建立模態框
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.id = 'preview-modal';
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg overflow-hidden shadow-2xl max-w-3xl w-full mx-4 transform transition-all">
            <div class="flex justify-between items-center p-4 border-b border-gray-200">
                <h3 class="font-medium text-lg">${videoName}</h3>
                <button id="close-modal" class="text-gray-400 hover:text-gray-500">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-4">
                <div class="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    ${videoStatus === '已完成' ? 
                        `<video controls class="w-full h-full rounded-lg">
                            <source src="#" type="video/mp4">
                            您的瀏覽器不支援影片播放。
                        </video>` : 
                        `<div class="text-gray-400 text-center">
                            <i class="fas fa-film text-4xl mb-2"></i>
                            <p>影片${videoStatus}，暫無法預覽</p>
                        </div>`
                    }
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-medium mb-2">影片資訊</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-500">上傳者</p>
                            <p>${row.querySelector('td:nth-child(2) div div').textContent}</p>
                        </div>
                        <div>
                            <p class="text-gray-500">上傳日期</p>
                            <p>${row.querySelector('td:nth-child(5)').textContent}</p>
                        </div>
                        <div>
                            <p class="text-gray-500">處理狀態</p>
                            <p>${videoStatus}</p>
                        </div>
                        <div>
                            <p class="text-gray-500">檔案大小</p>
                            <p>24.6 MB</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 p-4 flex justify-end">
                <button id="close-preview" class="admin-btn admin-btn-outline mr-2">關閉</button>
                ${videoStatus === '已完成' ? 
                    `<button class="admin-btn admin-btn-primary">
                        <i class="fas fa-download mr-1"></i> 下載影片
                    </button>` : ''
                }
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 禁止背景滾動
    document.body.style.overflow = 'hidden';
    
    // 模態框動畫
    setTimeout(() => {
        const modalContent = modal.querySelector('div');
        modalContent.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            modalContent.style.transition = 'all 0.3s ease-out';
            modalContent.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    }, 0);
    
    // 關閉模態框
    modal.querySelector('#close-modal').addEventListener('click', closeModal);
    modal.querySelector('#close-preview').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    function closeModal() {
        const modalContent = modal.querySelector('div');
        modalContent.style.opacity = '0';
        modalContent.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 200);
    }
}

// 模擬下載功能
function simulateDownload(row) {
    if (!row) return;
    
    const fileName = row.querySelector('td:nth-child(3)').textContent;
    
    // 創建通知
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-admin-success text-white py-2 px-4 rounded-lg shadow-lg flex items-center z-50 transform translate-y-10 opacity-0';
    toast.innerHTML = `
        <i class="fas fa-check-circle mr-2"></i>
        <span>已開始下載 ${fileName}</span>
    `;
    
    document.body.appendChild(toast);
    
    // 顯示通知
    setTimeout(() => {
        toast.style.transition = 'all 0.3s ease-out';
        toast.style.transform = 'translate(0)';
        toast.style.opacity = '1';
        
        // 3秒後隱藏
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }, 100);
}

// 顯示通知面板
function showNotificationsPanel() {
    // 建立通知面板
    let panel = document.getElementById('notifications-panel');
    
    if (panel) {
        // 如果已存在面板，則切換顯示/隱藏
        panel.classList.toggle('hidden');
        return;
    }
    
    panel = document.createElement('div');
    panel.id = 'notifications-panel';
    panel.className = 'absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-10';
    panel.innerHTML = `
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="font-medium">通知</h3>
            <div class="flex space-x-2">
                <button class="text-xs text-admin-accent hover:underline">標記全部為已讀</button>
                <button class="text-gray-400 hover:text-gray-500">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
        </div>
        <div class="max-h-96 overflow-y-auto">
            <div class="p-4 border-b border-gray-100 hover:bg-gray-50 flex items-start space-x-3">
                <div class="bg-admin-danger/10 text-admin-danger rounded-full p-2 flex-shrink-0">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <div>
                    <p class="font-medium text-sm">系統警告</p>
                    <p class="text-xs text-gray-500">儲存空間即將用盡，請盡快清理。</p>
                    <p class="text-xs text-gray-400 mt-1">20 分鐘前</p>
                </div>
            </div>
            <div class="p-4 border-b border-gray-100 hover:bg-gray-50 flex items-start space-x-3">
                <div class="bg-admin-success/10 text-admin-success rounded-full p-2 flex-shrink-0">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div>
                    <p class="font-medium text-sm">影片處理完成</p>
                    <p class="text-xs text-gray-500">影片 #1254 已完成處理。</p>
                    <p class="text-xs text-gray-400 mt-1">30 分鐘前</p>
                </div>
            </div>
            <div class="p-4 border-b border-gray-100 hover:bg-gray-50 flex items-start space-x-3 bg-blue-50/50">
                <div class="bg-admin-accent/10 text-admin-accent rounded-full p-2 flex-shrink-0">
                    <i class="fas fa-user"></i>
                </div>
                <div>
                    <p class="font-medium text-sm">新用戶註冊</p>
                    <p class="text-xs text-gray-500">有 5 位新用戶今日註冊了系統。</p>
                    <p class="text-xs text-gray-400 mt-1">2 小時前</p>
                </div>
            </div>
        </div>
        <div class="p-3 bg-gray-50 text-center">
            <a href="#" class="text-sm text-admin-accent hover:underline">查看所有通知</a>
        </div>
    `;
    
    // 添加到 DOM
    const notificationBtn = document.querySelector('.fa-bell').closest('button');
    notificationBtn.parentNode.appendChild(panel);
    
    // 添加顯示動畫
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        panel.style.transition = 'all 0.2s ease-out';
        panel.style.opacity = '1';
        panel.style.transform = 'translateY(0)';
    }, 10);
    
    // 點擊外部關閉
    document.addEventListener('click', function closePanel(e) {
        if (!panel.contains(e.target) && !notificationBtn.contains(e.target)) {
            panel.remove();
            document.removeEventListener('click', closePanel);
        }
    });
}

// 處理頁面切換
function switchPage(pageId) {
    // 隱藏所有頁面
    const pages = document.querySelectorAll('[id$="-page"]');
    pages.forEach(page => {
        page.classList.add('hidden');
    });
    
    // 顯示目標頁面
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
        
        // 頁面特定初始化
        if (pageId === 'dashboard') {
            refreshDashboardData();
        } else if (pageId === 'uploads') {
            initUploadsPage();
        } else if (pageId === 'projects') {
            initProjectsPage();
        }
        
        // 頁面變化時更新圖表
        if (window.trendsChart) {
            setTimeout(() => window.trendsChart.update(), 100);
        }
        
        if (window.distributionChart) {
            setTimeout(() => window.distributionChart.update(), 100);
        }
        
        if (window.projectsProgressChart && pageId === 'projects') {
            setTimeout(() => window.projectsProgressChart.update(), 100);
        }
        
        if (window.projectsTypeChart && pageId === 'projects') {
            setTimeout(() => window.projectsTypeChart.update(), 100);
        }
    }
}

// 上傳頁面初始化
function initUploadsPage() {
    // 初始化上傳容器
    const uploadContainer = document.getElementById('upload-container-admin');
    const fileInput = document.getElementById('file-input-admin');
    const uploadBtn = document.getElementById('upload-btn-admin');
    
    if (!uploadContainer || !fileInput || !uploadBtn) return;
    
    // 點擊上傳按鈕時觸發文件選擇
    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 文件選擇變更時處理上傳
    fileInput.addEventListener('change', (event) => {
        if (event.target.files.length) {
            simulateFileUpload(Array.from(event.target.files));
        }
    });
    
    // 拖放功能
    uploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadContainer.classList.add('border-admin-accent');
    });
    
    uploadContainer.addEventListener('dragleave', () => {
        uploadContainer.classList.remove('border-admin-accent');
    });
    
    uploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadContainer.classList.remove('border-admin-accent');
        
        if (e.dataTransfer.files.length) {
            const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('video/'));
            if (files.length) {
                simulateFileUpload(files);
            } else {
                showAdminToast('錯誤', '請上傳視頻文件 (MP4, MOV, AVI)', 'error');
            }
        }
    });
    
    // 表格功能
    const checkAll = document.querySelector('thead input[type="checkbox"]');
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
    if (checkAll) {
        checkAll.addEventListener('change', () => {
            checkboxes.forEach(checkbox => {
                checkbox.checked = checkAll.checked;
            });
        });
    }
}

// 模擬文件上傳
function simulateFileUpload(files) {
    if (!files.length) return;
    
    // 顯示上傳中通知
    showAdminToast('上傳中', `正在上傳 ${files.length} 個文件`, 'info');
    
    // 模擬上傳過程
    setTimeout(() => {
        showAdminToast('上傳完成', `成功上傳 ${files.length} 個文件，等待處理`, 'success');
        
        // 清空文件輸入
        const fileInput = document.getElementById('file-input-admin');
        if (fileInput) fileInput.value = '';
        
        // 在實際應用中，這裡會添加新的行到表格
    }, 1500);
}

// 顯示管理員通知
function showAdminToast(title, message, type = 'info') {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    
    const colors = {
        'success': 'bg-admin-success',
        'error': 'bg-admin-danger',
        'warning': 'bg-admin-warning',
        'info': 'bg-admin-accent'
    };
    
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 ${colors[type]} text-white py-2 px-4 rounded-lg shadow-lg z-50 transform translate-y-10 opacity-0`;
    toast.innerHTML = `
        <div class="flex items-start">
            <div class="mt-0.5 mr-3">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div>
                <div class="font-medium">${title}</div>
                <div class="text-sm text-white/90">${message}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 顯示通知
    setTimeout(() => {
        toast.style.transition = 'all 0.3s ease-out';
        toast.style.transform = 'translate(0)';
        toast.style.opacity = '1';
        
        // 3秒後隱藏
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }, 100);
}

// 初始化用戶分布圖表
function initDistributionChart() {
    const ctx = document.getElementById('distributionChart');
    if (!ctx) return;
    
    // 假數據
    const data = {
        labels: ['北部地區', '中部地區', '南部地區', '東部地區', '離島地區', '海外用戶'],
        datasets: [{
            data: [45, 25, 20, 5, 3, 2],
            backgroundColor: [
                '#3498db',
                '#2ecc71',
                '#e74c3c',
                '#f39c12',
                '#9b59b6',
                '#1abc9c'
            ],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };
    
    // 圖表配置
    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 15,
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    titleColor: '#2c3e50',
                    bodyColor: '#2c3e50',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    cornerRadius: 4,
                    boxPadding: 5,
                    usePointStyle: true,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}% (${value}人)`;
                        }
                    }
                }
            },
            cutout: '60%',
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    };
    
    // 創建圖表實例
    new Chart(ctx, config);
    
    // 在圖表中央顯示總數
    Chart.register({
        id: 'centerText',
        beforeDraw: function(chart) {
            if (chart.config.type === 'doughnut') {
                // 總用戶數
                const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                
                // 繪製中央文字
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                
                ctx.restore();
                ctx.font = '16px sans-serif';
                ctx.fillStyle = '#2c3e50';
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                
                ctx.fillText('總用戶數', width / 2, height / 2 - 15);
                
                ctx.font = 'bold 24px sans-serif';
                ctx.fillText(total.toString(), width / 2, height / 2 + 15);
                
                ctx.save();
            }
        }
    });
}

// 初始化項目進度圖表
function initProjectsProgressChart() {
    const ctx = document.getElementById('projectsProgressChart');
    if (!ctx) return;
    
    // 生成過去7天的日期標籤
    const lastDays = data7Days.labels;
    
    // 生成隨機數據
    const completedProjects = [3, 2, 4, 1, 5, 2, 3];
    const startedProjects = [5, 7, 4, 6, 8, 6, 5];
    
    window.projectsProgressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: lastDays,
            datasets: [
                {
                    label: '新建項目',
                    data: startedProjects,
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                },
                {
                    label: '完成項目',
                    data: completedProjects,
                    backgroundColor: 'rgba(46, 204, 113, 0.7)',
                    borderColor: 'rgba(46, 204, 113, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 2
                    },
                    grid: {
                        borderDash: [2, 2]
                    }
                }
            }
        }
    });
    
    // 監聽時間範圍選擇變化
    const rangeSelect = document.getElementById('projectsRangeSelect');
    if (rangeSelect) {
        rangeSelect.addEventListener('change', function() {
            updateProjectsChart(this.selectedIndex);
        });
    }
}

// 更新項目圖表數據
function updateProjectsChart(rangeIndex) {
    let data;
    
    if (rangeIndex === 0) {
        // 過去7天
        data = {
            labels: data7Days.labels,
            newProjects: [5, 7, 4, 6, 8, 6, 5],
            completedProjects: [3, 2, 4, 1, 5, 2, 3]
        };
    } else if (rangeIndex === 1) {
        // 過去30天 - 模擬數據
        const labels = [];
        const newProjects = [];
        const completedProjects = [];
        
        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            
            if (i % 3 === 0) { // 簡化標籤，每3天顯示一個
                labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
            } else {
                labels.push('');
            }
            
            newProjects.push(Math.floor(Math.random() * 6) + 3);
            completedProjects.push(Math.floor(Math.random() * 4) + 1);
        }
        
        data = { labels, newProjects, completedProjects };
    } else {
        // 過去3個月 - 模擬數據
        const labels = [];
        const newProjects = [];
        const completedProjects = [];
        
        for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7)); // 每週一個點
            labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
            
            newProjects.push(Math.floor(Math.random() * 15) + 10);
            completedProjects.push(Math.floor(Math.random() * 12) + 5);
        }
        
        data = { labels, newProjects, completedProjects };
    }
    
    // 更新圖表
    window.projectsProgressChart.data.labels = data.labels;
    window.projectsProgressChart.data.datasets[0].data = data.newProjects;
    window.projectsProgressChart.data.datasets[1].data = data.completedProjects;
    
    // 調整Y軸最大值
    const maxValue = Math.max(...data.newProjects, ...data.completedProjects);
    window.projectsProgressChart.options.scales.y.max = Math.ceil(maxValue / 5) * 5; // 向上取整到最接近的5的倍數
    
    window.projectsProgressChart.update();
}

// 項目類型分布圖表
function initProjectsTypeChart() {
    const ctx = document.getElementById('projectsTypeChart');
    if (!ctx) return;
    
    const data = {
        labels: ['傳記型', '多人合集', '生前準備', '特殊活動', '其他'],
        datasets: [{
            data: [125, 85, 65, 40, 13],
            backgroundColor: [
                'rgba(54, 162, 235, 0.8)',   // 藍色
                'rgba(156, 39, 176, 0.8)',   // 紫色
                'rgba(0, 150, 136, 0.8)',    // 青色
                'rgba(233, 30, 99, 0.8)',    // 粉色
                'rgba(158, 158, 158, 0.8)'   // 灰色
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(156, 39, 176, 1)',
                'rgba(0, 150, 136, 1)',
                'rgba(233, 30, 99, 1)',
                'rgba(158, 158, 158, 1)'
            ],
            borderWidth: 1
        }]
    };
    
    window.projectsTypeChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} 個 (${percentage}%)`;
                        }
                    }
                }
            },
            layout: {
                padding: 10
            }
        }
    });
}

// 項目頁面初始化
function initProjectsPage() {
    // 初始化項目列表的互動功能
    const projectRows = document.querySelectorAll('#projects-page tbody tr');
    projectRows.forEach(row => {
        // 行懸停效果
        row.addEventListener('mouseenter', function() {
            this.classList.add('bg-gray-50');
        });
        
        row.addEventListener('mouseleave', function() {
            this.classList.remove('bg-gray-50');
        });
        
        // 行點擊效果
        row.addEventListener('click', function(e) {
            if (!e.target.closest('button') && !e.target.closest('input[type="checkbox"]')) {
                showProjectDetails(this);
            }
        });
    });
    
    // 初始化項目匯出、篩選、排序按鈕
    const actionButtons = document.querySelectorAll('#projects-page .admin-card button');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            showAdminToast('項目操作', `「${this.textContent.trim()}」功能即將推出`, 'info');
        });
    });
    
    // 初始化新增項目按鈕
    const addProjectBtn = document.querySelector('#projects-page .admin-btn-primary');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function() {
            showNewProjectModal();
        });
    }
    
    // 初始化項目卡片的互動效果
    const projectCards = document.querySelectorAll('#projects-page .admin-card.overflow-hidden');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
        
        // 細節按鈕點擊
        const detailBtn = card.querySelector('button');
        if (detailBtn) {
            detailBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const projectName = card.querySelector('h4').textContent;
                showProjectDetails(card);
            });
        }
    });
    
    // 刷新項目圖表
    refreshProjectCharts();
}

// 刷新項目圖表
function refreshProjectCharts() {
    if (window.projectsProgressChart) {
        window.projectsProgressChart.update();
    }
    
    if (window.projectsTypeChart) {
        window.projectsTypeChart.update();
    }
}

// 顯示項目詳情模態框
function showProjectDetails(element) {
    // 獲取項目資訊
    let projectName, projectId, projectProgress, projectType, clientName;
    
    if (element.tagName === 'TR') {
        projectName = element.querySelector('td:nth-child(2) div > div:first-child').textContent;
        projectId = element.querySelector('td:nth-child(2) .text-xs').textContent;
        projectProgress = element.querySelector('td:nth-child(5) .text-xs').textContent;
        projectType = element.querySelector('td:nth-child(4) span').textContent;
        clientName = element.querySelector('td:nth-child(3) div:first-child').textContent;
    } else {
        projectName = element.querySelector('h4').textContent;
        projectId = element.querySelector('p.text-white\/90').textContent;
        projectProgress = element.querySelector('.text-xs.text-gray-500.mt-1').textContent;
        projectType = element.querySelector('.bg-white\/90.rounded-lg').textContent;
        clientName = element.querySelector('p.text-sm.text-gray-600').textContent.replace('客戶：', '');
    }
    
    // 建立模態框 HTML
    const modalHTML = `
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="p-6 bg-gradient-to-r from-admin-accent to-blue-700 text-white relative">
                <h3 class="text-xl font-medium">${projectName}</h3>
                <p class="text-white/80 text-sm mt-1">${projectId}</p>
                <button class="modal-close absolute top-4 right-4 text-white/80 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div class="border rounded-lg p-4">
                        <h4 class="text-sm text-gray-500 mb-1">項目類型</h4>
                        <p class="font-medium">${projectType}</p>
                    </div>
                    <div class="border rounded-lg p-4">
                        <h4 class="text-sm text-gray-500 mb-1">客戶資料</h4>
                        <p class="font-medium">${clientName}</p>
                    </div>
                    <div class="border rounded-lg p-4">
                        <h4 class="text-sm text-gray-500 mb-1">項目進度</h4>
                        <p class="font-medium">${projectProgress}</p>
                    </div>
                </div>
                
                <div class="border rounded-lg p-4 mb-6">
                    <h4 class="font-medium mb-2">項目詳細資訊</h4>
                    <p class="text-gray-600 mb-4">本項目旨在記錄並數位化主體的重要生平事件、照片和影像資料，以供後代緬懷及了解。過程包含資料收集、數位化處理、AI 增強及生成個人化虛擬互動模型。</p>
                    
                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-sm">資料收集</span>
                                <span class="text-sm font-medium">100%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-admin-success h-2 rounded-full" style="width: 100%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-sm">資料處理</span>
                                <span class="text-sm font-medium">85%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-admin-accent h-2 rounded-full" style="width: 85%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-sm">模型訓練</span>
                                <span class="text-sm font-medium">60%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-admin-accent h-2 rounded-full" style="width: 60%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-sm">互動測試</span>
                                <span class="text-sm font-medium">30%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-admin-warning h-2 rounded-full" style="width: 30%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-sm">最終交付</span>
                                <span class="text-sm font-medium">0%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="bg-admin-danger h-2 rounded-full" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="border rounded-lg p-4">
                        <h4 class="font-medium mb-2">資源分配</h4>
                        <div class="flex items-center mb-3">
                            <div class="w-8 h-8 rounded-full bg-admin-accent flex items-center justify-center text-white mr-3">
                                <i class="fas fa-server"></i>
                            </div>
                            <div>
                                <p class="font-medium">存儲資源</p>
                                <p class="text-xs text-gray-500">已使用 245GB / 500GB</p>
                            </div>
                        </div>
                        <div class="flex items-center mb-3">
                            <div class="w-8 h-8 rounded-full bg-admin-success flex items-center justify-center text-white mr-3">
                                <i class="fas fa-microchip"></i>
                            </div>
                            <div>
                                <p class="font-medium">運算資源</p>
                                <p class="text-xs text-gray-500">使用中 2 個 GPU 單元</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full bg-admin-warning flex items-center justify-center text-white mr-3">
                                <i class="fas fa-users"></i>
                            </div>
                            <div>
                                <p class="font-medium">人力資源</p>
                                <p class="text-xs text-gray-500">3 位團隊成員參與</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="border rounded-lg p-4">
                        <h4 class="font-medium mb-2">時間軸</h4>
                        <ul class="space-y-3">
                            <li class="flex">
                                <div class="flex flex-col items-center mr-4">
                                    <div class="w-3 h-3 bg-admin-success rounded-full"></div>
                                    <div class="w-0.5 h-full bg-gray-200"></div>
                                </div>
                                <div>
                                    <p class="font-medium">項目啟動</p>
                                    <p class="text-xs text-gray-500">2023/06/12</p>
                                </div>
                            </li>
                            <li class="flex">
                                <div class="flex flex-col items-center mr-4">
                                    <div class="w-3 h-3 bg-admin-success rounded-full"></div>
                                    <div class="w-0.5 h-full bg-gray-200"></div>
                                </div>
                                <div>
                                    <p class="font-medium">資料收集完成</p>
                                    <p class="text-xs text-gray-500">2023/06/25</p>
                                </div>
                            </li>
                            <li class="flex">
                                <div class="flex flex-col items-center mr-4">
                                    <div class="w-3 h-3 bg-admin-accent rounded-full"></div>
                                    <div class="w-0.5 h-full bg-gray-200"></div>
                                </div>
                                <div>
                                    <p class="font-medium">處理階段</p>
                                    <p class="text-xs text-gray-500">進行中</p>
                                </div>
                            </li>
                            <li class="flex">
                                <div class="flex flex-col items-center mr-4">
                                    <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
                                    <div class="w-0.5 h-full bg-gray-200"></div>
                                </div>
                                <div>
                                    <p class="font-medium">模型完成</p>
                                    <p class="text-xs text-gray-500">預計 2023/07/15</p>
                                </div>
                            </li>
                            <li class="flex">
                                <div class="flex flex-col items-center mr-4">
                                    <div class="w-3 h-3 bg-gray-300 rounded-full"></div>
                                </div>
                                <div>
                                    <p class="font-medium">項目交付</p>
                                    <p class="text-xs text-gray-500">預計 2023/07/30</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="p-6 bg-gray-50 border-t flex justify-end space-x-2">
                <button class="admin-btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 modal-close">關閉</button>
                <button class="admin-btn admin-btn-success">
                    <i class="fas fa-edit mr-1"></i> 編輯項目
                </button>
                <button class="admin-btn admin-btn-primary">
                    <i class="fas fa-eye mr-1"></i> 預覽效果
                </button>
            </div>
        </div>
    </div>
    `;
    
    // 添加模態框到頁面
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 防止滾動
    document.body.style.overflow = 'hidden';
    
    // 綁定關閉按鈕
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.querySelector('.fixed.inset-0').remove();
            document.body.style.overflow = '';
        });
    });
    
    // 初始化進度條動畫
    setTimeout(() => {
        const progressBars = document.querySelectorAll('.fixed.inset-0 .bg-admin-success, .fixed.inset-0 .bg-admin-accent, .fixed.inset-0 .bg-admin-warning, .fixed.inset-0 .bg-admin-danger');
        
        progressBars.forEach(bar => {
            const originalWidth = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.transition = 'width 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
                bar.style.width = originalWidth;
            }, 100);
        });
    }, 100);
}

// 顯示新增項目模態框
function showNewProjectModal() {
    // 建立模態框 HTML
    const modalHTML = `
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div class="p-6 bg-gradient-to-r from-admin-accent to-blue-700 text-white relative">
                <h3 class="text-xl font-medium">新增數位永生項目</h3>
                <p class="text-white/80 text-sm mt-1">建立新的客戶數位永生紀錄項目</p>
                <button class="modal-close absolute top-4 right-4 text-white/80 hover:text-white">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">項目名稱 *</label>
                        <input type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring-admin-accent" placeholder="例：張家明生平紀念專案">
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">專案類型 *</label>
                            <select class="w-full rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring-admin-accent">
                                <option>傳記型</option>
                                <option>多人合集</option>
                                <option>生前準備</option>
                                <option>特殊活動</option>
                                <option>其他</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">預計結束日期 *</label>
                            <input type="date" class="w-full rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring-admin-accent">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">客戶姓名 *</label>
                            <input type="text" class="w-full rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring-admin-accent" placeholder="例：林雅婷">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">關係 *</label>
                            <select class="w-full rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring-admin-accent">
                                <option>本人</option>
                                <option>家屬</option>
                                <option>遺屬</option>
                                <option>子女</option>
                                <option>孫子</option>
                                <option>朋友</option>
                                <option>其他</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">聯絡方式 *</label>
                        <input type="email" class="w-full rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring-admin-accent" placeholder="電子郵件">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">項目描述</label>
                        <textarea rows="4" class="w-full rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring-admin-accent" placeholder="請簡要描述項目需求與目標..."></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">資源分配</label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">存儲空間 (GB)</label>
                                <input type="number" min="10" max="1000" value="500" class="w-full rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring-admin-accent">
                            </div>
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">處理優先級</label>
                                <select class="w-full rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring-admin-accent">
                                    <option>標準</option>
                                    <option>高</option>
                                    <option>緊急</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">團隊人數</label>
                                <select class="w-full rounded-md border-gray-300 shadow-sm focus:border-admin-accent focus:ring-admin-accent">
                                    <option>1人</option>
                                    <option selected>2-3人</option>
                                    <option>4-5人</option>
                                    <option>5人以上</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="p-6 bg-gray-50 border-t flex justify-end space-x-2">
                <button class="admin-btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 modal-close">取消</button>
                <button class="admin-btn admin-btn-primary">
                    <i class="fas fa-plus mr-1"></i> 建立項目
                </button>
            </div>
        </div>
    </div>
    `;
    
    // 添加模態框到頁面
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 防止滾動
    document.body.style.overflow = 'hidden';
    
    // 綁定關閉按鈕
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            document.body.querySelector('.fixed.inset-0').remove();
            document.body.style.overflow = '';
        });
    });
    
    // 綁定建立項目按鈕
    document.querySelector('.fixed.inset-0 .admin-btn-primary').addEventListener('click', function() {
        // 模擬創建中
        this.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> 處理中...';
        this.disabled = true;
        
        // 模擬延遲
        setTimeout(() => {
            // 關閉模態框
            document.body.querySelector('.fixed.inset-0').remove();
            document.body.style.overflow = '';
            
            // 顯示成功訊息
            showAdminToast('項目建立成功', '新項目已成功建立，系統分配中', 'success');
        }, 1500);
    });
}

// 刷新儀表板數據
function refreshDashboardData() {
    // ... existing code ...
} 