// Функция для получения номера текущей недели
function getWeekNumber(date) {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
}

// Функция для загрузки соответствующего файла календаря
function loadCalendar() {
    const weekNumber = getWeekNumber(new Date());
    const fileName = weekNumber % 2 === 0 ? 'calendar1.ics' : 'calendar2.ics';

    fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки файла: ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            const jCal = ICAL.parse(data);
            const comp = new ICAL.Component(jCal);
            const events = comp.getAllProperties('vevent');
            const scheduleContainer = document.getElementById('schedule');
            scheduleContainer.innerHTML = '';

            events.forEach(event => {
                const summary = event.getFirstPropertyValue('summary');
                const startDate = event.getFirstPropertyValue('dtstart').toString();
                const lessonItem = document.createElement('div');
                lessonItem.className = 'lesson-item';
                lessonItem.innerHTML = ${summary} - ${startDate};
                scheduleContainer.appendChild(lessonItem);
            });
        })
        .catch(error => console.error('Ошибка загрузки календаря:', error));
}

// Функция для отслеживания посещаемости
function trackAttendance() {
    let attendanceCount = localStorage.getItem('attendanceCount') || 0;
    attendanceCount++;
    localStorage.setItem('attendanceCount', attendanceCount);

    const attendanceReport = document.getElementById('attendanceReport');
    attendanceReport.innerHTML = Количество посещений: ${attendanceCount};
}

// Функция для сохранения заметок
function saveNote() {
    const noteInput = document.getElementById('noteInput');
    const note = noteInput.value.trim();
    if (note) {
        const savedNotes = document.getElementById('savedNotes');
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.textContent = note;
        savedNotes.appendChild(noteItem);
        noteInput.value = '';
    }
}

// Функция для добавления сроков
function addDeadline() {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const task = taskInput.value.trim();
    const date = dateInput.value;

    if (task && date) {
        const deadlinesContainer = document.getElementById('deadlines');
        const deadlineItem = document.createElement('div');
        deadlineItem.className = 'deadline-item';
        deadlineItem.innerHTML = ${task} - ${date};
        deadlinesContainer.appendChild(deadlineItem);
        taskInput.value = '';
        dateInput.value = '';
    }
}

// Вызываем функции при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadCalendar();
    trackAttendance();
});
