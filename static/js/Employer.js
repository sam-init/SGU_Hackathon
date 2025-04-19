// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Navigation
  const navLinks = document.querySelectorAll('.nav-menu a');
  const views = document.querySelectorAll('.view');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');
  
  // View Management
  function showView(viewId) {
    views.forEach(view => {
      view.classList.remove('active');
    });
    
    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.add('active');
    }
    
    // Close mobile menu after view change
    nav.classList.remove('open');
    
    // Load data for the view based on which view is active
    switch(viewId) {
      case 'jobs':
        // Jobs view loading logic would go here
        break;
      case 'applications':
        // Applications view loading logic would go here
        break;
      case 'interviews':
        // Interviews view loading logic would go here
        break;
      case 'candidates':
        // Candidates view loading logic would go here
        break;
    }
  }
  
  // Navigation Event Listeners
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      const viewId = this.getAttribute('data-view');
      showView(viewId);
    });
  });
  
  // Mobile Menu Toggle
  mobileMenuToggle.addEventListener('click', function() {
    nav.classList.toggle('open');
  });
  
  // Initial view
  showView('jobs');
});