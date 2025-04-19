// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Navigation
  const navLinks = document.querySelectorAll('.nav-menu a');
  const views = document.querySelectorAll('.view');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');
  
  // Calendar Elements
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const currentMonthElement = document.getElementById('current-month');
  const calendarContainer = document.getElementById('interview-calendar');
  
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
        renderCalendar();
        break;
      case 'candidates':
        // Candidates view loading logic would go here
        break;
    }
  }
  
  // Calendar Functions
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
      
      const calendarDay = document.createElement('div');
      calendarDay.className = 'calendar-day';
      
      if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
        calendarDay.classList.add('today');
      }
      
      calendarDay.innerHTML = `<span class="calendar-day-number">${day}</span>`;
      calendarDay.setAttribute('data-date', dateStr);
      
      calendarDay.addEventListener('click', function() {
        const selectedDate = this.getAttribute('data-date');
        alert(`Selected date: ${selectedDate}`);
        // In a full app, this would show events for the selected date
      });
      
      calendarContainer.appendChild(calendarDay);
    }
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
  
  // Initial view
  showView('jobs');
});