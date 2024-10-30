// Пример данных для расписания
const schedule = [
    { lesson: "Математика", time: "09:00", attended: false, homework: "" },
    { lesson: "Физика", time: "11:00", attended: false, homework: "" },
    // добавьте другие занятия
];

// Функция отображения расписания
function renderSchedule() {
    const scheduleDiv = document.getElementById('schedule');
    scheduleDiv.innerHTML = schedule.map((item, index) => `
        <div class="lesson">
            <span>${item.time} - ${item.lesson}</span>
            <button onclick="toggleAttendance(${index})">
                ${item.attended ? "Посетил" : "Пропустил"}
            </button>
            <input type="text" placeholder="Домашнее задание"
            onchange="addHomework(${index}, this.value)" value="${item.homework}">
            </div>
        `).join('');
    }
    
    // Обработка посещаемости
    function toggleAttendance(index) {
        schedule[index].attended = !schedule[index].attended;
        localStorage.setItem('schedule', JSON.stringify(schedule));
        renderSchedule();
    }
    
    // Добавление домашнего задания
    function addHomework(index, homework) {
        schedule[index].homework = homework;
        localStorage.setItem('schedule', JSON.stringify(schedule));
    }
    
    // Загрузка данных из localStorage
    function loadSchedule() {
        const saved = localStorage.getItem('schedule');
        if (saved) {
            schedule.splice(0, schedule.length, ...JSON.parse(saved));
        }
    }
    
    loadSchedule();
    renderSchedule();
    // Сохранение заметки
function saveNote() {
    const noteInput = document.getElementById('noteInput').value;
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(noteInput);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

// Удаление заметки
function deleteNote(index) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);  // Удаляем заметку по индексу
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}


// Отображение сохраненных заметок
function displayNotes() {
    const savedNotesDiv = document.getElementById('savedNotes');
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotesDiv.innerHTML = notes.map(note => `<p>${note}</p>`).join('');
}

// Загрузка заметок при загрузке страницы
if (document.getElementById('savedNotes')) {
    displayNotes();
}
// Добавление дедлайна
function addDeadline() {
    const task = document.getElementById('taskInput').value;
    const date = document.getElementById('dateInput').value;
    let deadlines = JSON.parse(localStorage.getItem('deadlines')) || [];
    deadlines.push({ task, date });
    localStorage.setItem('deadlines', JSON.stringify(deadlines));
    displayDeadlines();
}
function deleteDeadline(index) {
    let deadlines = JSON.parse(localStorage.getItem('deadlines')) || [];
    deadlines.splice(index, 1);  // Удаляем дедлайн по индексу
    localStorage.setItem('deadlines', JSON.stringify(deadlines));
    displayDeadlines();
}

// Отображение дедлайнов
function displayDeadlines() {
    const deadlinesDiv = document.getElementById('deadlines');
    const deadlines = JSON.parse(localStorage.getItem('deadlines')) || [];
    deadlinesDiv.innerHTML = deadlines.map(item => `
        <p>${item.task} — до ${item.date}</p>
    `).join('');
}

// Загрузка дедлайнов при загрузке страницы
if (document.getElementById('deadlines')) {
    displayDeadlines();
}
// Инициализация расписания
let schedule = JSON.parse(localStorage.getItem('schedule')) || [];

// Обработка загрузки файла .ics
function loadICSFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result;
            const jcalData = ICAL.parse(data);
            const comp = new ICAL.Component(jcalData);
            const events = comp.getAllSubcomponents("vevent");

            schedule = events.map(event => {
                const summary = event.getFirstPropertyValue("summary");
                const startDate = event.getFirstPropertyValue("dtstart").toJSDate();
                const day = startDate.toLocaleDateString('ru-RU', { weekday: 'long' });
                const date = startDate.toISOString().split('T')[0];

                return {
                    date: date,
                    day: day.charAt(0).toUpperCase() + day.slice(1),
                    subject: summary,
                    type: 'Лекция', // Задайте тип события по умолчанию или извлеките из события, если оно указано
                    attended: false
                };
            });

            localStorage.setItem('schedule', JSON.stringify(schedule));
            renderSchedule();
            renderAttendanceReport();
        };
        reader.readAsText(file);
    }
}

// Отображение расписания
function renderSchedule() {
    const scheduleDiv = document.getElementById('schedule');
    scheduleDiv.innerHTML = schedule.map((item, index) => `
        <div class="lesson-item">
            <div>
                <strong>${item.date} (${item.day})</strong>: ${item.subject} — ${item.type}
            </div>
            <div>
                <button onclick="toggleAttendance(${index})">${item.attended ? 'Посетил' : 'Пропустил'}</button>
            </div>
        </div>
    `).join('');
}

// Обработка посещаемости
function toggleAttendance(index) {
    schedule[index].attended = !schedule[index].attended;
    localStorage.setItem('schedule', JSON.stringify(schedule));
    renderSchedule();
    renderAttendanceReport();
}

// Отчёт о посещаемости
function renderAttendanceReport() {
    const reportDiv = document.getElementById('attendanceReport');
    const subjects = schedule.reduce((acc, item) => {
        if (!acc[item.subject]) {
            acc[item.subject] = { attended: 0, missed: 0 };
        }
        acc[item.subject][item.attended ? 'attended' : 'missed']++;
        return acc;
    }, {});

    reportDiv.innerHTML = Object.entries(subjects).map(([subject, stats]) => `
        <div class="report-item">
            <span>${subject}</span>
            <span>Посещено: ${stats.attended}</span>
            <span>Пропущено: ${stats.missed}</span>
        </div>
    `).join('');
}

// Загрузка расписания и отчета при запуске страницы
document.addEventListener("DOMContentLoaded", function() {
    renderSchedule();
    renderAttendanceReport();
});
