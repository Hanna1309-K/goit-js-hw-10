// Імпортуємо бібліотеки
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Селектори
const datetimePicker = document.getElementById("datetime-picker");
const startBtn = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

// Змінні
let userSelectedDate = null;
let intervalId = null;

// Додаємо ведучий нуль
function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

// Конвертація мілісекунд у дні, години, хвилини, секунди
function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

// Ініціалізація flatpickr
flatpickr(datetimePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selected = selectedDates[0];

        if (selected <= new Date()) {
            startBtn.disabled = true;
            userSelectedDate = null;

            iziToast.error({
                title: "Помилка",
                message: "Please choose a date in the future",
                position: "topRight",
            });
        } else {
            startBtn.disabled = false;
            userSelectedDate = selected;
        }
    },
});

// Функція оновлення таймера
function updateTimer() {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
        clearInterval(intervalId);
        renderTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });

        datetimePicker.disabled = false;
        startBtn.disabled = true;

        iziToast.success({
            title: "Час вийшов",
            message: "Зворотний відлік завершено!",
            position: "topRight",
        });

        return;
    }

    const time = convertMs(diff);
    renderTimer(time);
}

// Функція виводу часу в інтерфейс
function renderTimer({ days, hours, minutes, seconds }) {
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

// Обробка кліку на кнопку Start
startBtn.addEventListener("click", () => {
    if (!userSelectedDate) return;

    startBtn.disabled = true;
    datetimePicker.disabled = true;

    updateTimer();
    intervalId = setInterval(updateTimer, 1000);
});

// При завантаженні сторінки кнопка Start неактивна
startBtn.disabled = true;
