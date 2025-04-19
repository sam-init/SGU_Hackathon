// File upload display
document.getElementById('resumeUpload').addEventListener('change', function(e) {
    const fileName = e.target.files[0] ? e.target.files[0].name : '';
    document.getElementById('fileName').textContent = fileName;
    
    if (fileName) {
        document.getElementById('resumeUploadArea').style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
    }
});

