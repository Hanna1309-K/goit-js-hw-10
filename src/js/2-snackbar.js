import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form");

    function createPromise(delay, state) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (state === "fulfilled") resolve(delay);
                else reject(delay);
            }, delay);
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const delay = Number(form.elements.delay.value);
        const state = form.elements.state.value;

        createPromise(delay, state)
            .then((delay) => {
                iziToast.success({
                    title: "✅ Fulfilled",
                    message: `Fulfilled promise in ${delay}ms`,
                    position: "topRight",
                });
            })
            .catch((delay) => {
                iziToast.error({
                    title: "❌ Rejected",
                    message: `Rejected promise in ${delay}ms`,
                    position: "topRight",
                });
            });

        form.reset();
    });
});

