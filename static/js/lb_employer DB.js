// Add your JavaScript code here

function toggleContact(button) {
    const contactInfo = button.nextElementSibling;
    if (contactInfo.style.display === "block") {
        contactInfo.style.display = "none";
        button.textContent = "View Contact Info";
    } else {
        contactInfo.style.display = "block";
        button.textContent = "Hide Contact Info";
    }
}