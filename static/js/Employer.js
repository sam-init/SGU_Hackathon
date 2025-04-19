// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-menu a');
    const views = document.querySelectorAll('.view');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    // Modals
    const applicationModal = document.getElementById('application-modal');
    const scheduleModal = document.getElementById('schedule-modal');
    const aiMatchModal = document.getElementById('ai-match-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    
    // Forms
    const jobForm = document.getElementById('job-form');
    const scheduleForm = document.getElementById('schedule-form');
    const aiMatchForm = document.getElementById('ai-match-form');
    
    // Search and Filter
    const jobSearch = document.getElementById('job-search');
    const locationFilter = document.getElementById('location-filter');
    const skillFilter = document.getElementById('skill-filter');
    const jobTypeFilter = document.getElementById('job-type-filter');
    const filterClearBtn = document.getElementById('filter-clear');
    
    // Calendar
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthElement = document.getElementById('current-month');
    const calendarContainer = document.getElementById('interview-calendar');
    
    // AI Match
    const aiMatchBtn = document.getElementById('ai-match-btn');
    
    // Containers for dynamic content
    const jobListingsContainer = document.querySelector('.job-listings');
    const applicationsTableBody = document.getElementById('applications-table-body');
    const candidatesContainer = document.getElementById('candidates-container');
    const upcomingInterviewsContainer = document.getElementById('upcoming-interviews');
    
    // Remove the sample data from here
    // Fetch the data from the HTML instead
    const jobs = JSON.parse(document.getElementById('jobs-data').textContent);
    const applications = JSON.parse(document.getElementById('applications-data').textContent);
    const candidates = JSON.parse(document.getElementById('candidates-data').textContent);
    const interviews = JSON.parse(document.getElementById('interviews-data').textContent);
    
    // Utility Functions
    function formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    }
    
    function getInitials(name) {
      return name.split(' ').map(word => word[0]).join('');
    }
    
    function getMatchScoreClass(score) {
      if (score >= 85) return 'high';
      if (score >= 70) return 'medium';
      return 'low';
    }
    
    function getStatusClass(status) {
      return `status-${status}`;
    }
    
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
      
      // Load data for the view
      switch(viewId) {
        case 'jobs':
          renderJobListings();
          break;
        case 'applications':
          renderApplications();
          break;
        case 'interviews':
          renderCalendar();
          renderUpcomingInterviews();
          break;
        case 'candidates':
          renderCandidates();
          break;
      }
    }
    
    // Jobs View
    function renderJobListings(filters = {}) {
      jobListingsContainer.innerHTML = '';
      
      let filteredJobs = [...jobs];
      
      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredJobs = filteredJobs.filter(job => 
          job.title.toLowerCase().includes(searchTerm) || 
          job.company.toLowerCase().includes(searchTerm) || 
          job.description.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.location) {
        filteredJobs = filteredJobs.filter(job => 
          job.location.toLowerCase() === filters.location.toLowerCase()
        );
      }
      
      if (filters.skill) {
        filteredJobs = filteredJobs.filter(job => 
          job.skills.some(skill => skill.toLowerCase().includes(filters.skill.toLowerCase()))
        );
      }
      
      if (filters.type) {
        filteredJobs = filteredJobs.filter(job => 
          job.type.toLowerCase() === filters.type.toLowerCase()
        );
      }
      
      if (filteredJobs.length === 0) {
        jobListingsContainer.innerHTML = `
          <div class="no-results">
            <p>No jobs match your search criteria. Try adjusting your filters.</p>
          </div>
        `;
        return;
      }
      
      filteredJobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
          <div class="job-card-header">
            <div>
              <h3 class="job-title">${job.title}</h3>
              <p class="company-name">${job.company}</p>
            </div>
            <span class="job-type">${job.type.replace('-', ' ')}</span>
          </div>
          <div class="job-details">
            <span class="job-detail"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
            <span class="job-detail"><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
          </div>
          <p class="job-description">${job.description}</p>
          <div class="job-skills">
            ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
          <div class="job-card-footer">
            <span class="posted-date">Posted ${formatDate(job.postedDate)}</span>
            <button class="btn btn-primary apply-btn" data-job-id="${job.id}">Apply Now</button>
          </div>
        `;
        jobListingsContainer.appendChild(jobCard);
      });
      
      // Add event listeners to apply buttons
      document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', function() {
          const jobId = this.getAttribute('data-job-id');
          alert(`Apply functionality would be implemented here for job ID: ${jobId}`);
        });
      });
    }
    
    // Applications View
    function renderApplications(filters = {}) {
      applicationsTableBody.innerHTML = '';
      
      let filteredApplications = [...applications];
      
      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredApplications = filteredApplications.filter(app => {
          const candidate = candidates.find(c => c.id === app.candidateId);
          const job = jobs.find(j => j.id === app.jobId);
          return (
            candidate.name.toLowerCase().includes(searchTerm) ||
            candidate.email.toLowerCase().includes(searchTerm) ||
            job.title.toLowerCase().includes(searchTerm)
          );
        });
      }
      
      if (filters.status) {
        filteredApplications = filteredApplications.filter(app => 
          app.status.toLowerCase() === filters.status.toLowerCase()
        );
      }
      
      if (filteredApplications.length === 0) {
        applicationsTableBody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center">No applications match your search criteria.</td>
          </tr>
        `;
        return;
      }
      
      filteredApplications.forEach(app => {
        const candidate = candidates.find(c => c.id === app.candidateId);
        const job = jobs.find(j => j.id === app.jobId);
        
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>
            <div class="candidate-info">
              <div class="candidate-avatar">${getInitials(candidate.name)}</div>
              <div>
                <div class="candidate-name">${candidate.name}</div>
                <div class="candidate-email">${candidate.email}</div>
              </div>
            </div>
          </td>
          <td>${job.title}</td>
          <td>${formatDate(app.appliedDate)}</td>
          <td><span class="status-badge ${getStatusClass(app.status)}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></td>
          <td><span class="match-score match-${getMatchScoreClass(app.matchScore)}">${app.matchScore}%</span></td>
          <td>
            <div class="action-buttons">
              <button class="action-btn view-application" data-app-id="${app.id}" title="View Details">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn schedule-interview" data-app-id="${app.id}" title="Schedule Interview">
                <i class="fas fa-calendar-alt"></i>
              </button>
              <button class="action-btn reject-application" data-app-id="${app.id}" title="Reject">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </td>
        `;
        applicationsTableBody.appendChild(row);
      });
      
      // Add event listeners to action buttons
      document.querySelectorAll('.view-application').forEach(button => {
        button.addEventListener('click', function() {
          const appId = this.getAttribute('data-app-id');
          openApplicationModal(appId);
        });
      });
      
      document.querySelectorAll('.schedule-interview').forEach(button => {
        button.addEventListener('click', function() {
          const appId = this.getAttribute('data-app-id');
          openScheduleModal(appId);
        });
      });
      
      document.querySelectorAll('.reject-application').forEach(button => {
        button.addEventListener('click', function() {
          const appId = this.getAttribute('data-app-id');
          if (confirm('Are you sure you want to reject this application?')) {
            rejectApplication(appId);
          }
        });
      });
    }
    
    // Calendar View
    function renderCalendar() {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      
      renderMonth(currentYear, currentMonth);
    }
    
    function renderMonth(year, month) {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Update month display
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      currentMonthElement.textContent = `${monthNames[month]} ${year}`;
      
      // Clear calendar
      calendarContainer.innerHTML = '';
      
      // Add day headers
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarContainer.appendChild(dayHeader);
      });
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day inactive';
        calendarContainer.appendChild(emptyDay);
      }
      
      // Add days of the month
      const today = new Date();
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const hasInterviewsOnThisDay = interviews.some(interview => interview.date === dateStr);
        
        const calendarDay = document.createElement('div');
        calendarDay.className = 'calendar-day';
        
        if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
          calendarDay.classList.add('today');
        }
        
        if (hasInterviewsOnThisDay) {
          calendarDay.classList.add('has-interviews');
        }
        
        calendarDay.innerHTML = `<span class="calendar-day-number">${day}</span>`;
        calendarDay.setAttribute('data-date', dateStr);
        
        calendarDay.addEventListener('click', function() {
          const selectedDate = this.getAttribute('data-date');
          showInterviewsForDate(selectedDate);
        });
        
        calendarContainer.appendChild(calendarDay);
      }
    }
    
    function showInterviewsForDate(date) {
      const interviewsOnDate = interviews.filter(interview => interview.date === date);
      
      if (interviewsOnDate.length === 0) {
        alert(`No interviews scheduled for ${formatDate(date)}`);
        return;
      }
      
      let message = `Interviews for ${formatDate(date)}:\n\n`;
      interviewsOnDate.forEach(interview => {
        message += `${interview.time} - ${interview.candidateName} for ${interview.position}\n`;
      });
      
      alert(message);
    }
    
    function navigateMonth(direction) {
      const currentMonthText = currentMonthElement.textContent;
      const [monthName, year] = currentMonthText.split(' ');
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      let month = monthNames.indexOf(monthName);
      let yearNum = parseInt(year);
      
      if (direction === 'prev') {
        if (month === 0) {
          month = 11;
          yearNum--;
        } else {
          month--;
        }
      } else {
        if (month === 11) {
          month = 0;
          yearNum++;
        } else {
          month++;
        }
      }
      
      renderMonth(yearNum, month);
    }
    
    function renderUpcomingInterviews() {
      upcomingInterviewsContainer.innerHTML = '';
      
      if (interviews.length === 0) {
        upcomingInterviewsContainer.innerHTML = `
          <div class="no-interviews">
            <p>No upcoming interviews scheduled.</p>
          </div>
        `;
        return;
      }
      
      // Sort interviews by date and time
      const sortedInterviews = [...interviews].sort((a, b) => {
        if (a.date !== b.date) {
          return new Date(a.date) - new Date(b.date);
        }
        return a.time.localeCompare(b.time);
      });
      
      sortedInterviews.forEach(interview => {
        const interviewDate = new Date(interview.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (interviewDate >= today) {
          const interviewCard = document.createElement('div');
          interviewCard.className = 'interview-card';
          
          // Format time from 24h to 12h format
          const [hours, minutes] = interview.time.split(':');
          const hoursNum = parseInt(hours);
          const period = hoursNum >= 12 ? 'PM' : 'AM';
          const displayHours = hoursNum > 12 ? hoursNum - 12 : (hoursNum === 0 ? 12 : hoursNum);
          
          interviewCard.innerHTML = `
            <div class="interview-time">
              <div class="interview-time-value">${displayHours}:${minutes}</div>
              <div class="interview-time-period">${period}</div>
            </div>
            <div class="interview-details">
              <h4>${interview.candidateName}</h4>
              <div class="interview-position">${interview.position}</div>
              <div class="interview-type">
                <i class="${interview.type === 'video' ? 'fas fa-video' : interview.type === 'phone' ? 'fas fa-phone' : 'fas fa-building'}"></i>
                ${interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}
              </div>
            </div>
            <div class="interview-date">${formatDate(interview.date)}</div>
          `;
          
          upcomingInterviewsContainer.appendChild(interviewCard);
        }
      });
    }
    
    // Candidates View
    function renderCandidates(filters = {}) {
      candidatesContainer.innerHTML = '';
      
      let filteredCandidates = [...candidates];
      
      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredCandidates = filteredCandidates.filter(candidate => 
          candidate.name.toLowerCase().includes(searchTerm) || 
          candidate.title.toLowerCase().includes(searchTerm) || 
          candidate.email.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.skill) {
        filteredCandidates = filteredCandidates.filter(candidate => 
          candidate.skills.some(skill => skill.toLowerCase().includes(filters.skill.toLowerCase()))
        );
      }
      
      if (filteredCandidates.length === 0) {
        candidatesContainer.innerHTML = `
          <div class="no-results">
            <p>No candidates match your search criteria. Try adjusting your filters.</p>
          </div>
        `;
        return;
      }
      
      filteredCandidates.forEach(candidate => {
        const candidateCard = document.createElement('div');
        candidateCard.className = 'candidate-card';
        candidateCard.innerHTML = `
          <div class="candidate-header">
            <div class="candidate-profile">${getInitials(candidate.name)}</div>
            <div class="candidate-info-header">
              <h3>${candidate.name}</h3>
              <div class="candidate-title">${candidate.title}</div>
            </div>
          </div>
          <div class="candidate-details">
            <div class="candidate-detail">
              <i class="fas fa-envelope"></i> ${candidate.email}
            </div>
            <div class="candidate-detail">
              <i class="fas fa-map-marker-alt"></i> ${candidate.location}
            </div>
            <div class="candidate-detail">
              <i class="fas fa-briefcase"></i> ${candidate.experience}
            </div>
            <div class="candidate-detail">
              <i class="fas fa-graduation-cap"></i> ${candidate.education}
            </div>
          </div>
          <div class="candidate-skills">
            ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
          <div class="candidate-match">
            <div class="match-percentage ${getMatchScoreClass(candidate.matchScore)}">${candidate.matchScore}%</div>
            <div class="match-label">Match Score</div>
          </div>
        `;
        candidatesContainer.appendChild(candidateCard);
      });
    }
    
    // Modal Functions
    function openApplicationModal(applicationId) {
      const application = applications.find(app => app.id === parseInt(applicationId));
      if (!application) return;
      
      const candidate = candidates.find(c => c.id === application.candidateId);
      const job = jobs.find(j => j.id === application.jobId);
      
      const applicationDetails = document.querySelector('.application-details');
      applicationDetails.innerHTML = `
        <div class="detail-group">
          <div class="detail-label">Candidate</div>
          <div class="detail-value">${candidate.name}</div>
        </div>
        <div class="detail-group">
          <div class="detail-label">Position</div>
          <div class="detail-value">${job.title} at ${job.company}</div>
        </div>
        <div class="detail-group">
          <div class="detail-label">Applied Date</div>
          <div class="detail-value">${formatDate(application.appliedDate)}</div>
        </div>
        <div class="detail-group">
          <div class="detail-label">Status</div>
          <div class="detail-value"><span class="status-badge ${getStatusClass(application.status)}">${application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span></div>
        </div>
        <div class="detail-group">
          <div class="detail-label">Match Score</div>
          <div class="detail-value"><span class="match-score match-${getMatchScoreClass(application.matchScore)}">${application.matchScore}%</span></div>
        </div>
        <div class="detail-group">
          <div class="detail-label">Cover Letter</div>
          <div class="detail-value">${application.coverLetter}</div>
        </div>
      `;
      
      // Set up action buttons
      const rejectBtn = document.querySelector('.reject-btn');
      const scheduleInterviewBtn = document.querySelector('.schedule-interview-btn');
      
      rejectBtn.setAttribute('data-app-id', applicationId);
      scheduleInterviewBtn.setAttribute('data-app-id', applicationId);
      
      rejectBtn.addEventListener('click', function() {
        const appId = this.getAttribute('data-app-id');
        if (confirm('Are you sure you want to reject this application?')) {
          rejectApplication(appId);
          closeModal(applicationModal);
        }
      });
      
      scheduleInterviewBtn.addEventListener('click', function() {
        const appId = this.getAttribute('data-app-id');
        closeModal(applicationModal);
        openScheduleModal(appId);
      });
      
      applicationModal.style.display = 'block';
    }
    
    function openScheduleModal(applicationId) {
      const application = applications.find(app => app.id === parseInt(applicationId));
      if (!application) return;
      
      const candidate = candidates.find(c => c.id === application.candidateId);
      const job = jobs.find(j => j.id === application.jobId);
      
      document.getElementById('interview-candidate').value = candidate.name;
      document.getElementById('interview-position').value = job.title;
      
      // Set min date to today
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0];
      document.getElementById('interview-date').min = formattedToday;
      
      // Store application ID for form submission
      scheduleForm.setAttribute('data-app-id', applicationId);
      
      scheduleModal.style.display = 'block';
    }
    
    function openAIMatchModal() {
      aiMatchModal.style.display = 'block';
      
      // Hide results section initially
      document.querySelector('.ai-match-results').style.display = 'none';
    }
    
    function closeModal(modal) {
      modal.style.display = 'none';
    }
    
    // Application Actions
    function rejectApplication(applicationId) {
      // In a real application, this would make an API call
      const appIndex = applications.findIndex(app => app.id === parseInt(applicationId));
      if (appIndex !== -1) {
        applications[appIndex].status = 'rejected';
        renderApplications();
      }
    }
    
    function scheduleInterview(applicationId, interviewData) {
      // In a real application, this would make an API call
      const newInterview = {
        id: interviews.length + 1,
        applicationId: parseInt(applicationId),
        candidateName: document.getElementById('interview-candidate').value,
        position: document.getElementById('interview-position').value,
        date: interviewData.date,
        time: interviewData.time,
        type: interviewData.type,
        notes: interviewData.notes
      };
      
      interviews.push(newInterview);
      
      // Update application status
      const appIndex = applications.findIndex(app => app.id === parseInt(applicationId));
      if (appIndex !== -1) {
        applications[appIndex].status = 'interview';
      }
      
      alert('Interview scheduled successfully!');
    }
    
    function performAIMatch(requirements) {
      // In a real application, this would make an API call to an AI service
      // Here we simulate the AI matching by showing random results
      
      // Show the results section
      document.querySelector('.ai-match-results').style.display = 'block';
      
      const resultsContainer = document.getElementById('ai-match-results-container');
      resultsContainer.innerHTML = '';
      
      // Sort candidates by match score for demo
      const sortedCandidates = [...candidates].sort((a, b) => b.matchScore - a.matchScore);
      
      // Take top 3 matches
      const topMatches = sortedCandidates.slice(0, 3);
      
      topMatches.forEach(candidate => {
        const resultCard = document.createElement('div');
        resultCard.className = 'match-result-card';
        resultCard.innerHTML = `
          <div class="match-result-profile">${getInitials(candidate.name)}</div>
          <div class="match-result-info">
            <div class="match-result-name">${candidate.name}</div>
            <div class="match-result-title">${candidate.title}</div>
          </div>
          <div class="match-result-score ${getMatchScoreClass(candidate.matchScore)}">${candidate.matchScore}%</div>
          <div class="match-result-actions">
            <button class="action-btn" title="View Profile">
              <i class="fas fa-user"></i>
            </button>
            <button class="action-btn" title="Contact">
              <i class="fas fa-envelope"></i>
            </button>
          </div>
        `;
        resultsContainer.appendChild(resultCard);
      });
    }
    
    // Event Listeners
    // Navigation
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
    
    // Modal Close Buttons
    closeModalButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
      });
    });
    
    cancelButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        closeModal(modal);
      });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target.classList.contains('modal')) {
        closeModal(e.target);
      }
    });
    
    // Job Form Submit
    if (jobForm) {
      jobForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real application, this would make an API call
        const newJob = {
          id: jobs.length + 1,
          title: document.getElementById('job-title').value,
          company: document.getElementById('company').value,
          location: document.getElementById('job-location').value,
          type: document.getElementById('job-type').value,
          salary: document.getElementById('salary-range').value,
          description: document.getElementById('job-description').value,
          skills: document.getElementById('required-skills').value.split(',').map(skill => skill.trim()),
          postedDate: new Date().toISOString().split('T')[0]
        };
        
        jobs.push(newJob);
        alert('Job posted successfully!');
        this.reset();
        
        // Show the jobs view
        navLinks.forEach(link => {
          if (link.getAttribute('data-view') === 'jobs') {
            link.click();
          }
        });
      });
    }
    
    // Schedule Form Submit
    if (scheduleForm) {
      scheduleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const applicationId = this.getAttribute('data-app-id');
        const interviewData = {
          date: document.getElementById('interview-date').value,
          time: document.getElementById('interview-time').value,
          type: document.getElementById('interview-type').value,
          notes: document.getElementById('interview-notes').value
        };
        
        scheduleInterview(applicationId, interviewData);
        this.reset();
        closeModal(scheduleModal);
        
        // Update applications view if it's active
        if (document.getElementById('applications').classList.contains('active')) {
          renderApplications();
        }
      });
    }
    
    // AI Match Form Submit
    if (aiMatchForm) {
      aiMatchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const requirements = {
          jobRequirements: document.getElementById('job-requirements').value,
          experienceLevel: document.getElementById('experience-level').value,
          locationPreference: document.getElementById('location-preference').value
        };
        
        performAIMatch(requirements);
      });
    }
    
    // Search and Filter
    if (jobSearch) {
      jobSearch.addEventListener('input', function() {
        const filters = {
          search: this.value,
          location: locationFilter.value,
          skill: skillFilter.value,
          type: jobTypeFilter.value
        };
        renderJobListings(filters);
      });
    }
    
    if (locationFilter) {
      locationFilter.addEventListener('change', function() {
        const filters = {
          search: jobSearch.value,
          location: this.value,
          skill: skillFilter.value,
          type: jobTypeFilter.value
        };
        renderJobListings(filters);
      });
    }
    
    if (skillFilter) {
      skillFilter.addEventListener('change', function() {
        const filters = {
          search: jobSearch.value,
          location: locationFilter.value,
          skill: this.value,
          type: jobTypeFilter.value
        };
        renderJobListings(filters);
      });
    }
    
    if (jobTypeFilter) {
      jobTypeFilter.addEventListener('change', function() {
        const filters = {
          search: jobSearch.value,
          location: locationFilter.value,
          skill: skillFilter.value,
          type: this.value
        };
        renderJobListings(filters);
      });
    }
    
    if (filterClearBtn) {
      filterClearBtn.addEventListener('click', function() {
        jobSearch.value = '';
        locationFilter.value = '';
        skillFilter.value = '';
        jobTypeFilter.value = '';
        renderJobListings();
      });
    }
    
    // Application Search and Filter
    const applicationSearch = document.getElementById('application-search');
    const statusFilter = document.getElementById('status-filter');
    
    if (applicationSearch) {
      applicationSearch.addEventListener('input', function() {
        const filters = {
          search: this.value,
          status: statusFilter.value
        };
        renderApplications(filters);
      });
    }
    
    if (statusFilter) {
      statusFilter.addEventListener('change', function() {
        const filters = {
          search: applicationSearch.value,
          status: this.value
        };
        renderApplications(filters);
      });
    }
    
    // Candidate Search and Filter
    const candidateSearch = document.getElementById('candidate-search');
    const candidateSkillFilter = document.getElementById('candidate-skill-filter');
    
    if (candidateSearch) {
      candidateSearch.addEventListener('input', function() {
        const filters = {
          search: this.value,
          skill: candidateSkillFilter.value
        };
        renderCandidates(filters);
      });
    }
    
    if (candidateSkillFilter) {
      candidateSkillFilter.addEventListener('change', function() {
        const filters = {
          search: candidateSearch.value,
          skill: this.value
        };
        renderCandidates(filters);
      });
    }
    
    // Calendar Navigation
    if (prevMonthBtn) {
      prevMonthBtn.addEventListener('click', function() {
        navigateMonth('prev');
      });
    }
    
    if (nextMonthBtn) {
      nextMonthBtn.addEventListener('click', function() {
        navigateMonth('next');
      });
    }
    
    // AI Match Button
    if (aiMatchBtn) {
      aiMatchBtn.addEventListener('click', function() {
        openAIMatchModal();s
      });
    }
    
    // Initial view
    showView('jobs');
  });
