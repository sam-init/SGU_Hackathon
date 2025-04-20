// script.js - Updated to include Vertex AI functionality

const jobList = document.getElementById('jobList');
const roleList = document.getElementById('roleList');
const searchInput = document.getElementById('searchInput');

let allJobs = [];
let allRoles = [];

const API_URL = 'https://script.google.com/macros/s/AKfycbzLoLe-SMDd3-MK0gJJyO3q_780224E9Ulr9ySKkRM/exec'; // Replace with your real deployment URL
const VERTEX_AI_RESULTS_ELEMENT = document.getElementById('vertexAiResults');

// Fetch jobs from Google Sheets
async function fetchJobsFromBackend() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    allJobs = data;
    allRoles = [...new Set(data.map(job => job.title))];
    renderRoles(allRoles);
    renderJobs(allJobs);
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
  }
}

// Function to display Vertex AI analysis
async function displayVertexAiAnalysis(jobId) {
  try {
    // This URL should point to your Vertex AI endpoint or a proxy that calls Vertex AI
    const vertexResponse = await fetch(`YOUR_VERTEX_AI_ENDPOINT?jobId=${jobId}`);
    const vertexData = await vertexResponse.json();
    
    // Display Vertex AI results
    if (VERTEX_AI_RESULTS_ELEMENT) {
      VERTEX_AI_RESULTS_ELEMENT.innerHTML = `
        <h3>Vertex AI Analysis</h3>
        <div class="vertex-result">
          <p><strong>Recommended Skills:</strong> ${vertexData.recommendedSkills.join(', ')}</p>
          <p><strong>Market Trend:</strong> ${vertexData.marketTrend}</p>
          <p><strong>Candidate Match Score:</strong> ${vertexData.matchScore}%</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Failed to fetch Vertex AI analysis:', error);
    if (VERTEX_AI_RESULTS_ELEMENT) {
      VERTEX_AI_RESULTS_ELEMENT.innerHTML = '<p>Vertex AI analysis currently unavailable</p>';
    }
  }
}

function renderRoles(roles) {
  roleList.innerHTML = '';
  roles.forEach(role => {
    const li = document.createElement('li');
    li.className = 'role-item';
    li.textContent = role;
    li.addEventListener('click', () => {
      document.querySelectorAll('.role-item').forEach(item => item.classList.remove('active'));
      li.classList.add('active');
      const filtered = allJobs.filter(job => job.title === role);
      renderJobs(filtered);
      
      // If we have jobs, fetch Vertex AI analysis for the first one
      if (filtered.length > 0) {
        displayVertexAiAnalysis(filtered[0].id || role);
      }
    });
    roleList.appendChild(li);
  });
}

function renderJobs(jobs) {
  jobList.innerHTML = '';
  jobs.forEach(job => {
    const li = document.createElement('li');
    li.className = 'job-item';
    li.innerHTML = `
      <h3 class="job-title">${job.title}</h3>
      <div class="job-meta">${job.location} • ${job.job_type}</div>
      <div class="job-skills">
        ${(job.skills || []).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
      <button class="analyze-btn" data-job-id="${job.id || job.title}">Analyze with Vertex AI</button>
    `;
    
    jobList.appendChild(li);
    
    // Add click event for the analyze button
    const analyzeBtn = li.querySelector('.analyze-btn');
    analyzeBtn.addEventListener('click', () => {
      displayVertexAiAnalysis(job.id || job.title);
    });
  });
}

searchInput.addEventListener('input', e => {
  const searchVal = e.target.value.toLowerCase();
  const filteredRoles = allRoles.filter(role => role.toLowerCase().includes(searchVal));
  renderRoles(filteredRoles);
});

fetchJobsFromBackend();