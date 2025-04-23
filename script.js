// Data jadwal dan tugas (disimpan di localStorage)
let schedules = [];
let tasks = [];
let selectedMode = localStorage.getItem('selectedMode') || '';
let activeDay = '';
let activeTab = 'schedule';
let activeScheduleId = null;
let primaryColor = localStorage.getItem('primaryColor') || '#6D67E4'; // Default primary color

// Element references
const modeSelection = document.getElementById('modeSelection');
const selectRegular = document.getElementById('selectRegular');
const selectWeekend = document.getElementById('selectWeekend');
const headerTitle = document.getElementById('headerTitle');
const scheduleTypeTitle = document.getElementById('scheduleTypeTitle');
const regularDayNav = document.getElementById('regularDayNav');
const weekendDayNav = document.getElementById('weekendDayNav');
const scheduleContainer = document.getElementById('scheduleContainer');
const emptyState = document.getElementById('emptyState');
const taskContainer = document.getElementById('taskContainer');
const emptyTaskState = document.getElementById('emptyTaskState');

// Tab navigation
const scheduleTab = document.getElementById('scheduleTab');
const tasksTab = document.getElementById('tasksTab');
const scheduleView = document.getElementById('scheduleView');
const tasksView = document.getElementById('tasksView');

// Floating Action Button
const addBtn = document.getElementById('addBtn');

// Settings modal
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsModal = document.getElementById('closeSettingsModal');
const changeToRegular = document.getElementById('changeToRegular');
const changeToWeekend = document.getElementById('changeToWeekend');
const colorPicker = document.getElementById('colorPicker');

// Detail modal
const detailModal = document.getElementById('detailModal');
const closeDetailModal = document.getElementById('closeDetailModal');
const detailTitle = document.getElementById('detailTitle');
const detailBody = document.getElementById('detailBody');
const deleteScheduleBtn = document.getElementById('deleteScheduleBtn');
const editScheduleBtn = document.getElementById('editScheduleBtn');
const addTaskForScheduleBtn = document.getElementById('addTaskForScheduleBtn');

// Schedule modal
const scheduleModal = document.getElementById('scheduleModal');
const modalTitle = document.getElementById('modalTitle');
const scheduleForm = document.getElementById('scheduleForm');
const scheduleIdInput = document.getElementById('scheduleId');
const daySelectContainer = document.getElementById('daySelectContainer');
const dayInput = document.getElementById('day');
const courseNameInput = document.getElementById('courseName');
const courseNameSuggestions = document.getElementById('courseNameSuggestions'); // Tambahkan elemen sugesti
const timeStartInput = document.getElementById('timeStart');
const timeEndInput = document.getElementById('timeEnd');
const roomInput = document.getElementById('room');
const lecturerInput = document.getElementById('lecturer');
const noteInput = document.getElementById('note');

// Task modal
const taskModal = document.getElementById('taskModal');
const taskModalTitle = document.getElementById('taskModalTitle');
const taskForm = document.getElementById('taskForm');
const taskIdInput = document.getElementById('taskId');
const taskTitleInput = document.getElementById('taskTitle');
const taskCourseInput = document.getElementById('taskCourse');
const taskDueDateInput = document.getElementById('taskDueDate');
const taskDescriptionInput = document.getElementById('taskDescription');
const closeTaskModal = document.getElementById('closeTaskModal');
const cancelTaskBtn = document.getElementById('cancelTaskBtn');
const saveTaskBtn = document.getElementById('saveTaskBtn');

// Delete modal
const deleteModal = document.getElementById('deleteModal');
const deleteCourseName = document.getElementById('deleteCourseName');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Toast
const toast = document.getElementById('toast');

// Buttons
const addScheduleEmptyBtn = document.getElementById('addScheduleEmptyBtn');
const addTaskEmptyBtn = document.getElementById('addTaskEmptyBtn');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');

// Nama hari
const days = {
    '1': 'Senin',
    '2': 'Selasa',
    '3': 'Rabu',
    '4': 'Kamis',
    '5': 'Jumat',
    '6': 'Sabtu',
    '7': 'Minggu'
};

// Color themes
const colorThemes = [
    { name: 'Purple', value: '#6D67E4' },
    { name: 'Blue', value: '#3498db' },
    { name: 'Green', value: '#2ecc71' },
    { name: 'Red', value: '#e74c3c' },
    { name: 'Orange', value: '#e67e22' },
    { name: 'Teal', value: '#1abc9c' }
];

// Helper untuk normalisasi nama mata kuliah (mengabaikan huruf besar/kecil dan spasi berlebih)
function normalizeCourseName(name) {
    // Mengubah ke lowercase dan menghapus spasi di awal/akhir
    let normalized = name.toLowerCase().trim();
    // Mengganti multiple spaces dengan single space
    normalized = normalized.replace(/\s+/g, ' ');
    return normalized;
}

// Inisialisasi aplikasi
function initApp() {
    // Load data dari localStorage
    loadData();
    
    // Apply theme
    applyThemeColor();
    
    // Cek apakah mode sudah dipilih sebelumnya
    if (selectedMode) {
        modeSelection.style.display = 'none';
        setupUI();
        setupNavigations();
    } else {
        // Setup event listener untuk pemilihan mode
        selectRegular.addEventListener('click', () => {
            selectRegular.classList.add('selected');
            selectWeekend.classList.remove('selected');
            selectedMode = 'weekday';
            localStorage.setItem('selectedMode', selectedMode);
            modeSelection.style.display = 'none';
            setupUI();
            setupNavigations();
        });
        
        selectWeekend.addEventListener('click', () => {
            selectWeekend.classList.add('selected');
            selectRegular.classList.remove('selected');
            selectedMode = 'weekend';
            localStorage.setItem('selectedMode', selectedMode);
            modeSelection.style.display = 'none';
            setupUI();
            setupNavigations();
        });
    }
    
    // Setup color theme selector
    setupColorThemeSelector();
    
    // Tab navigation
    scheduleTab.addEventListener('click', () => {
        if (activeTab !== 'schedule') {
            activeTab = 'schedule';
            scheduleTab.classList.add('active');
            tasksTab.classList.remove('active');
            scheduleView.style.display = 'block';
            tasksView.style.display = 'none';
            addBtn.style.display = 'flex';
            addBtn.setAttribute('data-action', 'schedule');
        }
    });
    
    tasksTab.addEventListener('click', () => {
        if (activeTab !== 'tasks') {
            activeTab = 'tasks';
            tasksTab.classList.add('active');
            scheduleTab.classList.remove('active');
            tasksView.style.display = 'block';
            scheduleView.style.display = 'none';
            addBtn.style.display = 'flex';
            addBtn.setAttribute('data-action', 'task');
            renderTasks();
        }
    });
    
    // Floating Action Button
    addBtn.addEventListener('click', () => {
        if (activeTab === 'schedule') {
            openAddScheduleModal();
        } else {
            openAddTaskModal();
        }
    });
    
    // Setup settings modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('show');
    });
    
    closeSettingsModal.addEventListener('click', () => {
        settingsModal.classList.remove('show');
    });
    
    changeToRegular.addEventListener('click', () => {
        if (selectedMode !== 'weekday') {
            selectedMode = 'weekday';
            localStorage.setItem('selectedMode', selectedMode);
            settingsModal.classList.remove('show');
            setupUI();
            setupNavigations();
            showToast('Beralih ke mode Kuliah Reguler');
        } else {
            settingsModal.classList.remove('show');
        }
    });
    
    changeToWeekend.addEventListener('click', () => {
        if (selectedMode !== 'weekend') {
            selectedMode = 'weekend';
            localStorage.setItem('selectedMode', selectedMode);
            settingsModal.classList.remove('show');
            setupUI();
            setupNavigations();
            showToast('Beralih ke mode Kuliah Weekend');
        } else {
            settingsModal.classList.remove('show');
        }
    });
    
    // Detail modal
    closeDetailModal.addEventListener('click', () => {
        detailModal.classList.remove('show');
    });
    
    deleteScheduleBtn.addEventListener('click', () => {
        if (activeScheduleId) {
            const schedule = schedules.find(s => s.id === activeScheduleId);
            if (schedule) {
                deleteCourseName.textContent = schedule.courseName;
                confirmDeleteBtn.setAttribute('data-id', activeScheduleId);
                detailModal.classList.remove('show');
                deleteModal.classList.add('show');
            }
        }
    });
    
    editScheduleBtn.addEventListener('click', () => {
        if (activeScheduleId) {
            detailModal.classList.remove('show');
            editSchedule(activeScheduleId);
        }
    });
    
    addTaskForScheduleBtn.addEventListener('click', () => {
        if (activeScheduleId) {
            detailModal.classList.remove('show');
            openAddTaskModal(activeScheduleId);
        }
    });
    
    // Schedule form event listeners
    addScheduleEmptyBtn.addEventListener('click', openAddScheduleModal);
    closeModalBtn.addEventListener('click', () => scheduleModal.classList.remove('show'));
    cancelBtn.addEventListener('click', () => scheduleModal.classList.remove('show'));
    
    saveBtn.addEventListener('click', () => {
        if (scheduleForm.checkValidity()) {
            saveSchedule();
        } else {
            scheduleForm.reportValidity();
        }
    });
    
    // Task form event listeners
    addTaskEmptyBtn.addEventListener('click', openAddTaskModal);
    closeTaskModal.addEventListener('click', () => taskModal.classList.remove('show'));
    cancelTaskBtn.addEventListener('click', () => taskModal.classList.remove('show'));
    
    saveTaskBtn.addEventListener('click', () => {
        if (taskForm.checkValidity()) {
            saveTask();
        } else {
            taskForm.reportValidity();
        }
    });
    
    // Delete modal event listeners
    closeDeleteModal.addEventListener('click', () => deleteModal.classList.remove('show'));
    cancelDeleteBtn.addEventListener('click', () => deleteModal.classList.remove('show'));
    
    confirmDeleteBtn.addEventListener('click', () => {
        const id = confirmDeleteBtn.getAttribute('data-id');
        deleteSchedule(id);
        deleteModal.classList.remove('show');
    });
    
    // Setup event listeners untuk sugesti mata kuliah
    courseNameInput.addEventListener('input', showCourseSuggestions);
    courseNameInput.addEventListener('focus', showCourseSuggestions);
    document.addEventListener('click', (e) => {
        if (e.target !== courseNameInput && e.target !== courseNameSuggestions) {
            courseNameSuggestions.style.display = 'none';
        }
    });
}

// Load data dari localStorage
function loadData() {
    schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Jika tidak ada data jadwal, tambahkan contoh
    if (schedules.length === 0) {
        addSampleSchedules();
    }
}

// Setup color theme selector
function setupColorThemeSelector() {
    // Create color options
    const colorThemeContainer = document.getElementById('colorThemeContainer');
    colorThemeContainer.innerHTML = '';
    
    colorThemes.forEach(theme => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = theme.value;
        colorOption.setAttribute('data-color', theme.value);
        
        if (theme.value === primaryColor) {
            colorOption.classList.add('active');
        }
        
        colorOption.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.remove('active');
            });
            colorOption.classList.add('active');
            primaryColor = theme.value;
            localStorage.setItem('primaryColor', primaryColor);
            applyThemeColor();
            showToast('Tema warna berhasil diubah');
        });
        
        colorThemeContainer.appendChild(colorOption);
    });
}

// Apply theme color
function applyThemeColor() {
    document.documentElement.style.setProperty('--primary', primaryColor);
    
    // Derive other colors from primary
    const lightenedColor = adjustColor(primaryColor, 20);
    const darkenedColor = adjustColor(primaryColor, -20);
    
    document.documentElement.style.setProperty('--primary-light', lightenedColor);
    document.documentElement.style.setProperty('--primary-dark', darkenedColor);
}

// Helper function to lighten or darken a hex color
function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => {
        const value = Math.min(255, Math.max(0, parseInt(color, 16) + amount));
        return value.toString(16).padStart(2, '0');
    });
}

// Setup UI berdasarkan mode
function setupUI() {
    // Update UI berdasarkan mode
    if (selectedMode === 'weekday') {
        headerTitle.textContent = 'Jadwal Kuliah Reguler';
        scheduleTypeTitle.textContent = 'Jadwal Kuliah Reguler';
        regularDayNav.style.display = 'flex';
        weekendDayNav.style.display = 'none';
        
        // Set default active day untuk weekday
        activeDay = document.querySelector('#regularDayNav .day-nav-item.active').getAttribute('data-day');
    } else {
        headerTitle.textContent = 'Jadwal Kuliah Weekend';
        scheduleTypeTitle.textContent = 'Jadwal Kuliah Weekend';
        regularDayNav.style.display = 'none';
        weekendDayNav.style.display = 'flex';
        
        // Set default active day untuk weekend
        activeDay = document.querySelector('#weekendDayNav .day-nav-item.active').getAttribute('data-day');
    }
    
    // Setup FAB
    addBtn.setAttribute('data-action', 'schedule');
    
    renderSchedules();
}

// Setup navigasi hari
function setupNavigations() {
    // Navigasi hari untuk mode reguler
    document.querySelectorAll('#regularDayNav .day-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('#regularDayNav .day-nav-item').forEach(i => {
                i.classList.remove('active');
            });
            item.classList.add('active');
            activeDay = item.getAttribute('data-day');
            renderSchedules();
        });
    });
    
    // Navigasi hari untuk mode weekend
    document.querySelectorAll('#weekendDayNav .day-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('#weekendDayNav .day-nav-item').forEach(i => {
                i.classList.remove('active');
            });
            item.classList.add('active');
            activeDay = item.getAttribute('data-day');
            renderSchedules();
        });
    });
}

// Dapatkan semua jadwal dengan nama mata kuliah yang sama (termasuk perbedaan kapitalisasi/spasi)
function getSchedulesWithSimilarName(targetSchedule) {
    const normalizedName = normalizeCourseName(targetSchedule.courseName);
    return schedules.filter(schedule => 
        normalizeCourseName(schedule.courseName) === normalizedName
    );
}

// Tampilkan sugesti mata kuliah
function showCourseSuggestions() {
    const input = courseNameInput.value.trim();
    
    // Jika input kosong, sembunyikan sugesti
    if (input === '') {
        courseNameSuggestions.style.display = 'none';
        return;
    }
    
    // Dapatkan daftar unik dari nama mata kuliah (normalisasi)
    const uniqueCourseNames = new Set();
    
    schedules.forEach(schedule => {
        uniqueCourseNames.add(schedule.courseName);
    });
    
    // Filter berdasarkan input
    const normalizedInput = normalizeCourseName(input);
    const filteredSuggestions = [...uniqueCourseNames].filter(name => 
        normalizeCourseName(name).includes(normalizedInput)
    );
    
    // Jika tidak ada sugesti, sembunyikan elemen
    if (filteredSuggestions.length === 0) {
        courseNameSuggestions.style.display = 'none';
        return;
    }
    
    // Tampilkan sugesti
    courseNameSuggestions.innerHTML = '';
    
    filteredSuggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = suggestion;
        
        item.addEventListener('click', () => {
            courseNameInput.value = suggestion;
            courseNameSuggestions.style.display = 'none';
        });
        
        courseNameSuggestions.appendChild(item);
    });
    
    courseNameSuggestions.style.display = 'block';
}

// Render jadwal untuk hari aktif
function renderSchedules() {
    // Filter jadwal berdasarkan hari aktif
    let daySchedules = schedules.filter(schedule => schedule.day === activeDay);
    
    // Sort jadwal berdasarkan waktu mulai
    daySchedules.sort((a, b) => a.timeStart.localeCompare(b.timeStart));
    
    if (daySchedules.length === 0) {
        scheduleContainer.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        
        // Render jadwal
        scheduleContainer.innerHTML = '';
        const scheduleList = document.createElement('ul');
        scheduleList.className = 'schedule-list';
        
        daySchedules.forEach(schedule => {
            const item = document.createElement('li');
            item.className = 'schedule-item';
            
            const formattedStartTime = formatTime(schedule.timeStart);
            const formattedEndTime = formatTime(schedule.timeEnd);
            
            // Dapatkan semua jadwal dengan nama yang sama (normalisasi)
            const sameNameSchedules = getSchedulesWithSimilarName(schedule);
            
            // Kumpulkan semua ID jadwal dengan nama yang sama
            const scheduleIds = sameNameSchedules.map(s => s.id);
            
            // Cari tugas yang terkait dengan jadwal-jadwal ini
            const scheduleTasks = tasks.filter(task => 
                scheduleIds.includes(task.courseId) && !task.completed
            );
            
            const taskBadge = scheduleTasks.length > 0 ? 
                `<span class="badge badge-primary"><i class="fas fa-tasks"></i> ${scheduleTasks.length} tugas</span>` : '';
            
            item.innerHTML = `
                <div class="schedule-time">${formattedStartTime}<br>-<br>${formattedEndTime}</div>
                <div class="schedule-content">
                    <div class="schedule-title">${schedule.courseName} ${taskBadge}</div>
                    <div class="schedule-details">
                        ${schedule.room ? `<span class="schedule-detail"><i class="fas fa-map-marker-alt"></i> ${schedule.room}</span>` : ''}
                        ${schedule.lecturer ? `<span class="schedule-detail"><i class="fas fa-user"></i> ${schedule.lecturer}</span>` : ''}
                    </div>
                </div>
                <div class="schedule-actions">
                    <button class="btn-icon btn-outline view-btn" data-id="${schedule.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            `;
            
            scheduleList.appendChild(item);
        });
        
        scheduleContainer.appendChild(scheduleList);
        
        // Tambahkan event listener untuk tombol view
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                showScheduleDetail(id);
            });
        });
    }
}

// Render daftar tugas
function renderTasks() {
    // Urutkan tugas berdasarkan tanggal deadline (yang terdekat di atas)
    const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    if (sortedTasks.length === 0) {
        taskContainer.innerHTML = '';
        emptyTaskState.style.display = 'block';
    } else {
        emptyTaskState.style.display = 'none';
        
        // Render tugas
        taskContainer.innerHTML = '';
        const taskList = document.createElement('ul');
        taskList.className = 'task-list';
        
        sortedTasks.forEach(task => {
            const item = document.createElement('li');
            item.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            // Temukan jadwal terkait
            const relatedSchedule = schedules.find(s => s.id === task.courseId);
            const courseName = relatedSchedule ? relatedSchedule.courseName : 'Tidak ada mata kuliah';
            
            // Format tanggal deadline
            const dueDate = new Date(task.dueDate);
            const formattedDate = dueDate.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
            
            // Hitung status deadline
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            dueDate.setHours(0, 0, 0, 0);
            const diffTime = dueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let statusBadge = '';
            if (task.completed) {
                statusBadge = '<span class="badge badge-primary"><i class="fas fa-check"></i> Selesai</span>';
            } else if (diffDays < 0) {
                statusBadge = '<span class="badge badge-danger"><i class="fas fa-exclamation-circle"></i> Terlambat</span>';
            } else if (diffDays === 0) {
                statusBadge = '<span class="badge badge-warning"><i class="fas fa-exclamation-triangle"></i> Hari Ini</span>';
            } else if (diffDays <= 3) {
                statusBadge = '<span class="badge badge-warning"><i class="fas fa-clock"></i> Segera</span>';
            }
            
            item.innerHTML = `
                <div class="task-checkbox">
                    <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                </div>
                <div class="task-content">
                    <div class="task-title">${task.title} ${statusBadge}</div>
                    <div class="task-course">${courseName}</div>
                    <div class="task-due"><i class="far fa-calendar-alt"></i> ${formattedDate}</div>
                </div>
                <div class="task-actions">
                    <button class="btn-icon btn-outline view-task-btn" data-id="${task.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    
                </div>
            `;
            
            taskList.appendChild(item);
        });
        
        taskContainer.appendChild(taskList);
        
        // Tambahkan event listener untuk checkbox
        document.querySelectorAll('.task-checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const taskId = e.target.id.replace('task-', '');
                toggleTaskStatus(taskId, e.target.checked);
            });
        });
        
        // Tambahkan event listener untuk tombol view
        document.querySelectorAll('.view-task-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                showTaskDetail(id);
            });
        });
    }
}

// Tampilkan detail jadwal
function showScheduleDetail(id) {
    const schedule = schedules.find(s => s.id === id);
    
    if (schedule) {
        activeScheduleId = id;
        
        detailTitle.textContent = schedule.courseName;
        
        // Format waktu dan hari
        const dayName = days[schedule.day];
        const formattedStartTime = formatTime(schedule.timeStart);
        const formattedEndTime = formatTime(schedule.timeEnd);
        
        // Dapatkan semua jadwal dengan nama yang sama (normalisasi)
        const sameNameSchedules = getSchedulesWithSimilarName(schedule);
        
        // Kumpulkan semua ID jadwal dengan nama yang sama
        const scheduleIds = sameNameSchedules.map(s => s.id);
        
        // Cari tugas yang terkait dengan jadwal-jadwal ini
        const scheduleTasks = tasks.filter(task => scheduleIds.includes(task.courseId));
        
        const activeTasks = scheduleTasks.filter(task => !task.completed);
        const completedTasks = scheduleTasks.filter(task => task.completed);
        
        detailBody.innerHTML = `
            <div class="detail-section">
                <div class="detail-info">
                    <div class="detail-icon">
                        <i class="fas fa-calendar-day"></i>
                    </div>
                    <div>
                        <div class="detail-label">Hari</div>
                        <div class="detail-text">${dayName}</div>
                    </div>
                </div>
                
                <div class="detail-info">
                    <div class="detail-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div>
                        <div class="detail-label">Waktu</div>
                        <div class="detail-text">${formattedStartTime} - ${formattedEndTime}</div>
                    </div>
                </div>
                
                <div class="detail-info">
                    <div class="detail-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                        <div class="detail-label">Ruangan</div>
                        <div class="detail-text">${schedule.room || '-'}</div>
                    </div>
                </div>
                
                ${schedule.lecturer ? `
                <div class="detail-info">
                    <div class="detail-icon">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <div class="detail-label">Dosen</div>
                        <div class="detail-text">${schedule.lecturer}</div>
                    </div>
                </div>
                ` : ''}
                
                ${schedule.note ? `
                <div class="detail-info">
                    <div class="detail-icon">
                        <i class="fas fa-sticky-note"></i>
                    </div>
                    <div>
                        <div class="detail-label">Catatan</div>
                        <div class="detail-text">${schedule.note}</div>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <div class="detail-section">
                <div class="detail-title">Tugas</div>
                ${activeTasks.length > 0 ? `
                <p>Ada ${activeTasks.length} tugas yang belum selesai.</p>
                ` : '<p>Tidak ada tugas aktif.</p>'}
                
                ${completedTasks.length > 0 ? `
                <p>${completedTasks.length} tugas sudah selesai.</p>
                ` : ''}
            </div>
        `;
        
        // Reset buttons to default schedule mode
        deleteScheduleBtn.style.display = 'block';
        deleteScheduleBtn.textContent = 'Hapus';
        editScheduleBtn.textContent = 'Edit';
        addTaskForScheduleBtn.style.display = 'block';
        
        detailModal.classList.add('show');
    }
}

// Tampilkan detail tugas
function showTaskDetail(id) {
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        activeScheduleId = task.id; // Store task ID for potential deletion
        
        // Find related schedule
        const relatedSchedule = schedules.find(s => s.id === task.courseId);
        const courseName = relatedSchedule ? relatedSchedule.courseName : 'Tidak ada mata kuliah';
        
        // Format due date
        const dueDate = new Date(task.dueDate);
        const formattedDate = dueDate.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
        
        detailTitle.textContent = task.title;
        
        detailBody.innerHTML = `
            <div class="detail-section">
                <div class="detail-info">
                    <div class="detail-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div>
                        <div class="detail-label">Mata Kuliah</div>
                        <div class="detail-text">${courseName}</div>
                    </div>
                </div>
                
                <div class="detail-info">
                    <div class="detail-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div>
                        <div class="detail-label">Deadline</div>
                        <div class="detail-text">${formattedDate}</div>
                    </div>
                </div>
                
                ${task.description ? `
                <div class="detail-info">
                    <div class="detail-icon">
                        <i class="fas fa-align-left"></i>
                    </div>
                    <div>
                        <div class="detail-label">Deskripsi</div>
                        <div class="detail-text">${task.description}</div>
                    </div>
                </div>
                ` : ''}
                
                <div class="detail-info">
                    <div class="detail-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div>
                        <div class="detail-label">Status</div>
                        <div class="detail-text">${task.completed ? 'Selesai' : 'Belum Selesai'}</div>
                    </div>
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="btn ${task.completed ? 'btn-outline' : 'btn-primary'}" id="toggleTaskBtn" data-id="${task.id}" data-completed="${task.completed}">
                    ${task.completed ? '<i class="fas fa-times"></i> Tandai Belum Selesai' : '<i class="fas fa-check"></i> Tandai Selesai'}
                </button>
            </div>
        `;
        
        // Change footer buttons for tasks
        deleteScheduleBtn.style.display = 'block';
        deleteScheduleBtn.textContent = 'Hapus Tugas';
        deleteScheduleBtn.onclick = function() {
            detailModal.classList.remove('show');
            deleteTask(task.id);
        };
        
        editScheduleBtn.textContent = 'Edit Tugas';
        editScheduleBtn.onclick = function() {
            detailModal.classList.remove('show');
            editTask(task.id);
        };
        
        addTaskForScheduleBtn.style.display = 'none';
        
        // Add event listener for toggle button
        document.getElementById('toggleTaskBtn').addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            const currentStatus = this.getAttribute('data-completed') === 'true';
            toggleTaskStatus(taskId, !currentStatus);
            detailModal.classList.remove('show');
        });
        
        detailModal.classList.add('show');
    }
}

// Format waktu dari format 24 jam ke format yang lebih mudah dibaca
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
}

// Buka modal tambah jadwal
function openAddScheduleModal() {
    scheduleForm.reset();
    scheduleIdInput.value = '';
    
    // Isi opsi hari berdasarkan mode
    populateDayOptions();
    
    // Set default values
    timeStartInput.value = '08:00';
    timeEndInput.value = '09:40';
    
    modalTitle.textContent = 'Tambah Jadwal Kuliah';
    scheduleModal.classList.add('show');
}

// Populate opsi hari berdasarkan mode
function populateDayOptions() {
    dayInput.innerHTML = '';
    
    if (selectedMode === 'weekday') {
        // Opsi hari untuk weekday (Monday-Friday)
        dayInput.innerHTML = `
            <option value="">Pilih Hari</option>
            <option value="1" ${activeDay === '1' ? 'selected' : ''}>Senin</option>
            <option value="2" ${activeDay === '2' ? 'selected' : ''}>Selasa</option>
            <option value="3" ${activeDay === '3' ? 'selected' : ''}>Rabu</option>
            <option value="4" ${activeDay === '4' ? 'selected' : ''}>Kamis</option>
            <option value="5" ${activeDay === '5' ? 'selected' : ''}>Jumat</option>
        `;
    } else {
        // Opsi hari untuk weekend (Saturday-Sunday)
        dayInput.innerHTML = `
            <option value="">Pilih Hari</option>
            <option value="6" ${activeDay === '6' ? 'selected' : ''}>Sabtu</option>
            <option value="7" ${activeDay === '7' ? 'selected' : ''}>Minggu</option>
        `;
    }
}

// Buka modal edit jadwal
function editSchedule(id) {
    const schedule = schedules.find(s => s.id === id);
    
    if (schedule) {
        scheduleIdInput.value = schedule.id;
        
        // Populate day options based on current mode
        populateDayOptions();
        
        dayInput.value = schedule.day;
        courseNameInput.value = schedule.courseName;
        timeStartInput.value = schedule.timeStart;
        timeEndInput.value = schedule.timeEnd;
        roomInput.value = schedule.room;
        lecturerInput.value = schedule.lecturer || '';
        noteInput.value = schedule.note || '';
        
        modalTitle.textContent = 'Edit Jadwal Kuliah';
        scheduleModal.classList.add('show');
    }
}

// Edit tugas
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        taskIdInput.value = task.id;
        taskTitleInput.value = task.title;
        taskCourseInput.value = task.courseId;
        taskDueDateInput.value = task.dueDate;
        taskDescriptionInput.value = task.description || '';
        
        // Populate course options
        populateCourseOptions(task.courseId);
        
        taskModalTitle.textContent = 'Edit Tugas';
        taskModal.classList.add('show');
    }
}

// Buka modal tambah tugas
function openAddTaskModal(scheduleId = null) {
    taskForm.reset();
    taskIdInput.value = '';
    
    // Set tanggal default ke hari ini
    const today = new Date();
    const formattedDate = formatDateForInput(today);
    taskDueDateInput.value = formattedDate;
    
    // Populasi dropdown mata kuliah
    populateCourseOptions(scheduleId);
    
    taskModalTitle.textContent = 'Tambah Tugas';
    taskModal.classList.add('show');
}

// Format tanggal untuk input date
function formatDateForInput(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    
    return [year, month, day].join('-');
}

// Populasi opsi mata kuliah untuk tugas
function populateCourseOptions(selectedId = null) {
    taskCourseInput.innerHTML = '<option value="">Pilih Mata Kuliah</option>';
    
    // Kelompokkan jadwal berdasarkan nama matakuliah (normalisasi)
    const courseGroups = {};
    
    schedules.forEach(schedule => {
        const normalizedName = normalizeCourseName(schedule.courseName);
        
        if (!courseGroups[normalizedName]) {
            courseGroups[normalizedName] = [];
        }
        courseGroups[normalizedName].push(schedule);
    });
    
    // Sort mata kuliah berdasarkan nama
    const sortedCourseNames = Object.keys(courseGroups).sort();
    
    sortedCourseNames.forEach(normalizedName => {
        // Pilih salah satu jadwal sebagai representasi (yang pertama)
        const mainSchedule = courseGroups[normalizedName][0];
        
        // Tambahkan opsi untuk mata kuliah dengan nama yang sama
        const option = document.createElement('option');
        option.value = mainSchedule.id;
        option.textContent = mainSchedule.courseName;
        
        // Jika id yang dipilih ada dalam grup ini, atur sebagai terpilih
        if (selectedId && courseGroups[normalizedName].some(s => s.id === selectedId)) {
            option.selected = true;
        }
        
        taskCourseInput.appendChild(option);
    });
}

// Toggle status tugas (selesai/belum)
function toggleTaskStatus(id, completed) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Update UI
        renderTasks();
        
        // Show toast message
        if (completed) {
            showToast('Tugas ditandai selesai', 'success');
        } else {
            showToast('Tugas ditandai belum selesai');
        }
    }
}

// Generate ID unik
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Simpan jadwal
function saveSchedule() {
    const id = scheduleIdInput.value || generateId();
    const courseName = courseNameInput.value;
    const day = dayInput.value;
    const timeStart = timeStartInput.value;
    const timeEnd = timeEndInput.value;
    const room = roomInput.value;
    const lecturer = lecturerInput.value;
    const note = noteInput.value;
    
    // Validasi waktu
    if (timeStart >= timeEnd) {
        showToast('Waktu mulai harus lebih awal dari waktu selesai!', 'error');
        return false;
    }
    
    // Validasi bentrok jadwal
    const conflictSchedule = schedules.find(s => 
        s.id !== id && 
        s.day === day && 
        ((timeStart >= s.timeStart && timeStart < s.timeEnd) || 
        (timeEnd > s.timeStart && timeEnd <= s.timeEnd) ||
        (timeStart <= s.timeStart && timeEnd >= s.timeEnd))
    );
    
    if (conflictSchedule) {
        showToast(`Jadwal bentrok dengan ${conflictSchedule.courseName}!`, 'error');
        return false;
    }
    
    const schedule = {
        id,
        courseName,
        day,
        timeStart,
        timeEnd,
        room,
        lecturer,
        note
    };
    
    if (scheduleIdInput.value) {
        // Update jadwal yang ada
        const index = schedules.findIndex(s => s.id === id);
        schedules[index] = schedule;
        showToast('Jadwal berhasil diperbarui!', 'success');
    } else {
        // Tambah jadwal baru
        schedules.push(schedule);
        showToast('Jadwal berhasil ditambahkan!', 'success');
    }
    
    localStorage.setItem('schedules', JSON.stringify(schedules));
    scheduleModal.classList.remove('show');
    renderSchedules();
    
    return true;
}

// Simpan tugas
function saveTask() {
    const id = taskIdInput.value || generateId();
    const title = taskTitleInput.value;
    const courseId = taskCourseInput.value;
    const dueDate = taskDueDateInput.value;
    const description = taskDescriptionInput.value;
    
    if (!courseId) {
        showToast('Pilih mata kuliah terlebih dahulu!', 'error');
        return false;
    }
    
    const task = {
        id,
        title,
        courseId,
        dueDate,
        description,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    if (taskIdInput.value) {
        // Update tugas yang ada
        const index = tasks.findIndex(t => t.id === id);
        task.completed = tasks[index].completed; // Pertahankan status selesai
        tasks[index] = task;
        showToast('Tugas berhasil diperbarui!', 'success');
    } else {
        // Tambah tugas baru
        tasks.push(task);
        showToast('Tugas berhasil ditambahkan!', 'success');
    }
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    taskModal.classList.remove('show');
    
    if (activeTab === 'tasks') {
        renderTasks();
    } else {
        renderSchedules(); // Untuk memperbarui badge jumlah tugas
    }
    
    return true;
}

// Hapus jadwal
function deleteSchedule(id) {
    // Hapus jadwal
    schedules = schedules.filter(s => s.id !== id);
    localStorage.setItem('schedules', JSON.stringify(schedules));
    
    // Hapus tugas terkait
    tasks = tasks.filter(t => t.courseId !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    renderSchedules();
    showToast('Jadwal berhasil dihapus!', 'success');
}

// Hapus tugas
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    renderTasks();
    showToast('Tugas berhasil dihapus!', 'success');
}

// Tampilkan toast notification
function showToast(message, type = '') {
    toast.textContent = message;
    toast.className = 'toast';
    
    if (type) {
        toast.classList.add(type);
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Tambahkan contoh jadwal
function addSampleSchedules() {
    // Contoh jadwal reguler
    const regularSchedules = [
        {
            id: generateId(),
            courseName: 'Pemrograman Web',
            day: '1',
            timeStart: '08:00',
            timeEnd: '09:40',
            room: 'Lab Komputer 1',
            lecturer: 'Dr. Ahmad',
            note: 'Bawa laptop'
        },
        {
            id: generateId(),
            courseName: 'Basis Data',
            day: '2',
            timeStart: '10:00',
            timeEnd: '11:40',
            room: 'G.302',
            lecturer: 'Prof. Budi',
            note: ''
        },
        {
            id: generateId(),
            courseName: 'Matematika Diskrit',
            day: '4',
            timeStart: '13:00',
            timeEnd: '14:40',
            room: 'R.206',
            lecturer: 'Dr. Siti',
            note: ''
        }
    ];
    
    // Contoh jadwal weekend
    const weekendSchedules = [
        {
            id: generateId(),
            courseName: 'Algoritma Lanjut',
            day: '6',
            timeStart: '08:30',
            timeEnd: '11:30',
            room: 'Gedung B Lt. 3',
            lecturer: 'Dr. Joko',
            note: ''
        },
        {
            id: generateId(),
            courseName: 'Struktur Data',
            day: '6',
            timeStart: '13:00',
            timeEnd: '16:00',
            room: 'Lab Komputer 2',
            lecturer: 'Prof. Anwar',
            note: 'Praktikum'
        },
        {
            id: generateId(),
            courseName: 'Sistem Operasi',
            day: '7',
            timeStart: '09:00',
            timeEnd: '12:00',
            room: 'R.501',
            lecturer: 'Dr. Maya',
            note: ''
        }
    ];
    
    schedules = [...regularSchedules, ...weekendSchedules];
    localStorage.setItem('schedules', JSON.stringify(schedules));
    
    // Tambah contoh tugas
    const sampleTasks = [
        {
            id: generateId(),
            title: 'Laporan Praktikum',
            courseId: regularSchedules[0].id,
            dueDate: formatDateForInput(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)), // 3 hari dari sekarang
            description: 'Membuat laporan praktikum CSS dan JavaScript',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            title: 'Presentasi ERD',
            courseId: regularSchedules[1].id,
            dueDate: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 hari dari sekarang
            description: 'Presentasi desain database perpustakaan',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            title: 'Quiz Minggu Depan',
            courseId: weekendSchedules[2].id,
            dueDate: formatDateForInput(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)), // 10 hari dari sekarang
            description: 'Persiapan quiz tentang proses dan thread',
            completed: false,
            createdAt: new Date().toISOString()
        }
    ];
    
    tasks = sampleTasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initialize app on page load
initApp();