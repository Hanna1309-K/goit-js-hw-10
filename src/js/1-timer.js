import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const datetimePicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

flatpickr(datetimePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (selectedDate <= new Date()) {
            startBtn.disabled = true;
            userSelectedDate = null;

            iziToast.error({
                message: 'Please choose a date in the future',
                position: 'topRight',
            });

            return;
        }

        userSelectedDate = selectedDate;
        startBtn.disabled = false;
    },
});

startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    datetimePicker.disabled = true;

    timerId = setInterval(() => {
        const currentTime = new Date();
        const diff = userSelectedDate - currentTime;

        if (diff <= 0) {
            clearInterval(timerId);
            updateTimer(0);
            datetimePicker.disabled = false;
            return;
        }

        updateTimer(diff);
    }, 1000);
});

function updateTimer(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);

    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    return {
        days: Math.floor(ms / day),
        hours: Math.floor((ms % day) / hour),
        minutes: Math.floor((ms % hour) / minute),
        seconds: Math.floor((ms % minute) / second),
    };
}
