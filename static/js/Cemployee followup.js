// File upload display
document.getElementById('resumeUpload').addEventListener('change', function(e) {
    const fileName = e.target.files[0] ? e.target.files[0].name : '';
    document.getElementById('fileName').textContent = fileName;
    
    if (fileName) {
        document.getElementById('resumeUploadArea').style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
    }
});

// Form submission handler
document.getElementById('employeeInfoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Employee information submitted successfully!');
});
