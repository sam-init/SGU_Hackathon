// DOM Elements
const sidebarLinks = document.querySelectorAll('#sidebar ul li a');
const sections = document.querySelectorAll('section');
const skillList = document.querySelector('.skill-list');
const jobListContainer = document.getElementById('job-list');
const courseListContainer = document.getElementById('course-list');
const jobTemplate = document.querySelector('.job-card.template');
const courseTemplate = document.querySelector('.course-card.template');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
  initSidebarNavigation();
  loadEmployeeData();
});

// Navigation functionality
function initSidebarNavigation() {
  // Hide all sections except the first one
  sections.forEach((section, index) => {
    if (index !== 0) {
      section.style.display = 'none';
    }
  });

  // Add active class to first sidebar link
  sidebarLinks[0].classList.add('active');

  // Add click event listeners to sidebar links
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all links
      sidebarLinks.forEach(link => link.classList.remove('active'));
      
      // Add active class to clicked link
      e.target.classList.add('active');
      
      // Hide all sections
      sections.forEach(section => {
        section.style.display = 'none';
      });
      
      // Show the selected section
      const targetId = e.target.getAttribute('href').substring(1);
      document.getElementById(targetId).style.display = 'block';
    });
  });
}

// Load employee data from API
function loadEmployeeData() {
  // In a real application, this would be your API endpoint
  // For now, we'll simulate an API response
  const mockApiData = {
    profile: {
      name: "Rahul Kumar",
      location: "Bangalore, India",
      education: "B.Tech in Computer Science",
      preferred_role: "Full Stack Developer"
    },
    skills: [
      { name: "Python", proficiency: 90 },
      { name: "JavaScript", proficiency: 85 },
      { name: "React", proficiency: 80 },
      { name: "Node.js", proficiency: 75 },
      { name: "MongoDB", proficiency: 70 },
      { name: "SQL", proficiency: 65 }
    ],
    jobs: [
      {
        title: "Full Stack Developer",
        company: "TechCorp Solutions",
        location: "Bangalore (Remote)",
        match_score: 92
      },
      {
        title: "Frontend Engineer",
        company: "WebVision",
        location: "Hyderabad",
        match_score: 88
      },
      {
        title: "Python Developer",
        company: "DataSense Analytics",
        location: "Bangalore",
        match_score: 85
      },
      {
        title: "MERN Stack Developer",
        company: "Innovate Systems",
        location: "Remote",
        match_score: 82
      }
    ],
    courses: [
      {
        title: "Advanced React Patterns",
        source: "YouTube - Frontend Masters",
        url: "#"
      },
      {
        title: "Python for Data Science",
        source: "YouTube - DataCamp",
        url: "#"
      },
      {
        title: "Complete MongoDB Course",
        source: "YouTube - Academind",
        url: "#"
      },
      {
        title: "Node.js REST API Development",
        source: "YouTube - Traversy Media",
        url: "#"
      }
    ]
  };
  
  // Simulate an API call
  setTimeout(() => {
    updateDashboard(mockApiData);
  }, 500);
}

// Update dashboard with data
function updateDashboard(data) {
  // Update profile section
  document.getElementById('emp-name').innerText = data.profile.name;
  document.getElementById('emp-location').innerText = data.profile.location;
  document.getElementById('emp-education').innerText = data.profile.education;
  document.getElementById('emp-role').innerText = data.profile.preferred_role;
  
  // Update skills section
  updateSkills(data.skills);
  
  // Update jobs section
  updateJobs(data.jobs);
  
  // Update courses section
  updateCourses(data.courses);
  
  // Add a loading animation effect
  sections.forEach(section => {
    section.classList.add('loaded');
  });
}

// Update skills display
function updateSkills(skills) {
  // Clear existing skills (except template)
  const existingSkills = document.querySelectorAll('.skill-block:not(.template)');
  existingSkills.forEach(skill => skill.remove());
  
  // Add each skill with animation
  skills.forEach((skill, index) => {
    const skillBlock = document.createElement('div');
    skillBlock.className = 'skill-block';
    skillBlock.setAttribute('data-skill', skill.name);
    
    skillBlock.innerHTML = `
      <span>${skill.name}</span>
      <div class="bar-container"><div class="bar" style="width: 0%"></div></div>
      <span class="percent">${skill.proficiency}%</span>
    `;
    
    skillList.appendChild(skillBlock);
    
    // Animate skill bar after a small delay
    setTimeout(() => {
      const bar = skillBlock.querySelector('.bar');
      bar.style.width = `${skill.proficiency}%`;
    }, 100 * index);
  });
}

// Update job recommendations
function updateJobs(jobs) {
  // Clear existing job cards (except template)
  const existingJobs = document.querySelectorAll('.job-card:not(.template)');
  existingJobs.forEach(job => job.remove());
  
  // Add each job card
  jobs.forEach(job => {
    const jobCard = jobTemplate.cloneNode(true);
    jobCard.classList.remove('template');
    jobCard.style.display = 'block';
    
    jobCard.querySelector('.job-title').innerText = job.title;
    jobCard.querySelector('.company').innerText = job.company;
    jobCard.querySelector('.location').innerText = job.location;
    jobCard.querySelector('.score').innerText = `Match: ${job.match_score}%`;
    
    // Add click event to job card
    jobCard.addEventListener('click', () => {
      alert(`You clicked on ${job.title} at ${job.company}`);
      // This would open job details in a real application
    });
    
    jobListContainer.appendChild(jobCard);
  });
}

// Update course suggestions
function updateCourses(courses) {
  // Clear existing course cards (except template)
  const existingCourses = document.querySelectorAll('.course-card:not(.template)');
  existingCourses.forEach(course => course.remove());
  
  // Add each course card
  courses.forEach(course => {
    const courseCard = courseTemplate.cloneNode(true);
    courseCard.classList.remove('template');
    courseCard.style.display = 'block';
    
    courseCard.querySelector('.course-title').innerText = course.title;
    courseCard.querySelector('.source').innerText = course.source;
    
    const watchBtn = courseCard.querySelector('.btn');
    watchBtn.setAttribute('href', course.url);
    watchBtn.addEventListener('click', (e) => {
      // In a real app, this would navigate to the course
      e.preventDefault();
      alert(`Redirecting to: ${course.title}`);
    });
    
    courseListContainer.appendChild(courseCard);
  });
}

// Function to simulate API calls for real-time job recommendations
function refreshJobRecommendations() {
  const refreshBtn = document.createElement('button');
  refreshBtn.innerText = 'Refresh Recommendations';
  refreshBtn.className = 'btn refresh-btn';
  document.querySelector('#jobs h3').appendChild(refreshBtn);
  
  refreshBtn.addEventListener('click', () => {
    refreshBtn.innerText = 'Loading...';
    refreshBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
      const newJobs = [
        {
          title: "Senior Full Stack Developer",
          company: "InnoTech Solutions",
          location: "Bangalore (Hybrid)",
          match_score: 94
        },
        {
          title: "React Team Lead",
          company: "SoftVision",
          location: "Remote",
          match_score: 91
        },
        {
          title: "Python Developer",
          company: "DataSense Analytics",
          location: "Bangalore",
          match_score: 85
        },
        {
          title: "Backend Engineer",
          company: "CloudScale Inc",
          location: "Pune (Hybrid)",
          match_score: 82
        }
      ];
      
      updateJobs(newJobs);
      refreshBtn.innerText = 'Refresh Recommendations';
      refreshBtn.disabled = false;
    }, 1500);
  });
}

// Add skill assessment functionality
function initSkillAssessment() {
  const assessBtn = document.createElement('button');
  assessBtn.innerText = 'Take Skill Assessment';
  assessBtn.className = 'btn assess-btn';
  document.querySelector('#skills h3').appendChild(assessBtn);
  
  assessBtn.addEventListener('click', () => {
    alert('In a real application, this would launch the Vertex AI skill assessment.');
  });
}

// Initialize additional features
setTimeout(() => {
  refreshJobRecommendations();
  initSkillAssessment();
}, 1000);

// API simulation for course recommendations based on skills
function recommendCoursesBasedOnSkills(skills) {
  // This would be an actual API call to YouTube Data API in a real application
  console.log("Recommending courses based on skills:", skills);
  
  // For demonstration, we're using the mock data already loaded
}