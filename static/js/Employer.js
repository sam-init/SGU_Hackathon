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



  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('searchBox');
    const suggestions = document.getElementById('suggestions');
    const jobListings = document.querySelector('.job-listings');
  
    const locationFilter = document.getElementById('location-filter');
    const skillFilter = document.getElementById('skill-filter');
    const jobTypeFilter = document.getElementById('job-type-filter');
    const clearBtn = document.getElementById('filter-clear');
  
    let timer = null;
  
    // Fetch and render jobs
    async function fetchJobs(query = '') {
      const res = await fetch(`/job/api/search?q=${encodeURIComponent(query)}`);
      const jobs = await res.json();
      renderJobs(jobs);
    }
  
    // Render job cards
    function renderJobs(jobs) {
      jobListings.innerHTML = '';
  
      const filtered = jobs.filter(job => {
        const loc = locationFilter.value;
        const skill = skillFilter.value;
        const type = jobTypeFilter.value;
  
        const locationMatch = !loc || (job.location && job.location.toLowerCase() === loc);
        const skillMatch = !skill || (job.skills && job.skills.includes(skill.toLowerCase()));
        const typeMatch = !type || (job.job_type && job.job_type.toLowerCase() === type);
  
        return locationMatch && skillMatch && typeMatch;
      });
  
      if (filtered.length === 0) {
        jobListings.innerHTML = '<p>No jobs match your criteria.</p>';
        return;
      }
  
      for (const job of filtered) {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.innerHTML = `
          <h3>${job.title}</h3>
          <p><strong>Company:</strong> ${job.company}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Type:</strong> ${job.job_type}</p>
          <p><strong>Skills:</strong> ${job.skills.join(', ')}</p>
          <p>${job.description}</p>
        `;
        jobListings.appendChild(card);
      }
    }
  
    // Search suggestions with debounce
    input.addEventListener('input', () => {
      clearTimeout(timer);
      const query = input.value.trim();
  
      if (!query) {
        suggestions.innerHTML = '';
        return;
      }
  
      timer = setTimeout(async () => {
        const res = await fetch(`/job/api/search?q=${encodeURIComponent(query)}`);
        const hits = await res.json();
  
        suggestions.innerHTML = hits.map(h =>
          `<li data-id="${h.id}">${h.title}</li>`
        ).join('');
      }, 300);
    });
  
    // Suggestion click: trigger search
    suggestions.addEventListener('click', e => {
      if (e.target.tagName === 'LI') {
        input.value = e.target.textContent;
        suggestions.innerHTML = '';
        fetchJobs(input.value);
      }
    });
  
    // Close suggestions when clicking outside
    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !suggestions.contains(e.target)) {
        suggestions.innerHTML = '';
      }
    });
  
    // Filter change triggers re-render
    [locationFilter, skillFilter, jobTypeFilter].forEach(filter =>
      filter.addEventListener('change', () => fetchJobs(input.value))
    );
  
    // Clear filters
    clearBtn.addEventListener('click', () => {
      locationFilter.value = '';
      skillFilter.value = '';
      jobTypeFilter.value = '';
      fetchJobs(input.value);
    });
  
    // Initial job fetch
    fetchJobs();
  });

  

  

