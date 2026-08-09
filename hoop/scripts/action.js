const STORAGE_KEY = "hoophistory-contact-submission";

function renderSubmission() {
    const container = document.querySelector("#submission-output");
    if (!container) return;

    const raw = sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
        container.innerHTML = `
            <p class="status-msg">No submission found. Please fill out the form first.</p>
            <a class="btn btn-outline" href="form.html">Back to the form</a>
        `;
        return;
    }

    try {
        const data = JSON.parse(raw);
        const fields = [
            { label: "Name", value: data.name },
            { label: "Email", value: data.email },
            { label: "Topic", value: data.topic },
            { label: "Message", value: data.message },
            { label: "Submitted", value: data.submittedAt },
        ];

        const rows = fields
        .map((field) => `<dt>${field.label}</dt><dd>${field.value}</dd>`)
        .join("");

        container.innerHTML = `
            <p>Thanks, ${data.name}! Here's what we received:</p>
            <dl>${rows}</dl>
        `;
    } catch (error) {
        console.error("Could not read submission:", error);
        container.innerHTML = `<p class="status-msg">Something went wrong reading your submission.</p>`;
    }
}

document.addEventListener("DOMContentLoaded", renderSubmission);