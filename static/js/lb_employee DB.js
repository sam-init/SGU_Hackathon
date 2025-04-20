function toggleContact(button) {
    const contactInfo = button.nextElementSibling;
    if (contactInfo.style.display === "block") {
        contactInfo.style.display = "none";
        button.textContent = "Contact Employer";
    } else {
        contactInfo.style.display = "block";
        button.textContent = "Hide Contact Info";
    }
}
function handleSubmit() {
    alert('Submitted');
}