
  // JavaScript for handling category selection and display
  function editCategories() {
    document.getElementById('categoryForm').style.display = 'block';
    document.getElementById('selectedCategoriesSection').style.display = 'none';
  }

  function searchCategories() {
    const searchInput = document.getElementById('searchBar').value.toLowerCase();
    const labels = document.querySelectorAll('.categories label');
    
    labels.forEach(label => {
      const text = label.textContent.toLowerCase();
      if (text.includes(searchInput)) {
        label.style.display = 'flex';
      } else {
        label.style.display = 'none';
      }
    });
  }
  
  // Add visual feedback when checkboxes are selected
  document.querySelectorAll('input[name="category"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        this.parentElement.classList.add('selected');
      } else {
        this.parentElement.classList.remove('selected');
      }
    });
  });