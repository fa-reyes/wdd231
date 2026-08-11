const STORAGE_KEY = "hoophistory-contact-submission";

function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
 
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = new FormData(form);
 
    const submission = {
        name: formData.get("name"),
        email: formData.get("email"),
        topic: formData.get("topic"),
        message: formData.get("message"),
        submittedAt: new Date().toLocaleString(),
    };
    
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(submission));
    } catch (error) {
        console.warn("Could not store submission:", error);
    }
    
    window.location.href = "action.html";
}

function initForm() {
    const form = document.querySelector("#contact-form");
    if (!form) return;
    form.addEventListener("submit", handleSubmit);
}
 
document.addEventListener("DOMContentLoaded", initForm);