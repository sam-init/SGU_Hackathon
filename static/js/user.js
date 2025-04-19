
// Mock data for workers
const workers = [
  {
      id: 1,
      name: "Kiran Patel",
      title: "Professional Handyman",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
      reviews: 124,
      location: "Belagavi, KA",
      mapLocation: "Belagavi,Karnataka,India",
      distance: null,
      skills: ["Plumbing", "Electrical", "Carpentry"],
      completedJobs: 156,
      responseTime: "Under 1hr",
      badge: "Top Rated"
  },
  {
      id: 2,
      name: "Hirshita Sharma",
      title: "Expert Cleaner",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      rating: 4.9,
      reviews: 87,
      location: "Pune, MH",
      mapLocation: "Pune,Maharashtra,India",
      distance: null,
      skills: ["Deep Cleaning", "Sanitization", "Office Cleaning"],
      completedJobs: 91,
      responseTime: "Under 2hrs",
      badge: "Verified Pro"
  },
  {
      id: 3,
      name: "Akash Sharma",
      title: "Moving Specialist",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 4.7,
      reviews: 56,
      location: "Dhaplapur, KA",
      mapLocation: "Dhaplapur,Karnataka,India",
      distance: null,
      skills: ["Packing", "Furniture Assembly", "Home Shifting"],
      completedJobs: 63,
      responseTime: "Under 3hrs"
  },
  {
      id: 4,
      name: "Akastha Rao",
      title: "Landscape Designer",
      image: "https://randomuser.me/api/portraits/women/79.jpg",
      rating: 4.6,
      reviews: 43,
      location: "Dharwad, KA",
      mapLocation: "Dharwad,Karnataka,India",
      distance: null,
      skills: ["Garden Design", "Maintenance", "Plant Selection"],
      completedJobs: 47,
      responseTime: "Same Day"
  },
  {
      id: 5,
      name: "Bassanguda Kumar",
      title: "Professional Painter",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      rating: 4.9,
      reviews: 78,
      location: "Kalaburagi, KA",
      mapLocation: "Kalaburagi,Karnataka,India",
      distance: null,
      skills: ["Interior Painting", "Texture Work", "Wall Design"],
      completedJobs: 83,
      responseTime: "Under 2hrs",
      badge: "Featured"
  },
  {
      id: 6,
      name: "Kumari Priya",
      title: "Home Organizer",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 4.8,
      reviews: 39,
      location: "Pune, MH",
      mapLocation: "Pune,Maharashtra,India",
      distance: null,
      skills: ["Decluttering", "Space Planning", "Storage Solutions"],
      completedJobs: 45,
      responseTime: "Under 4hrs"
  }
];

  // DOM Elements
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const jobForm = document.getElementById("jobForm");
  const jobPostedMessage = document.getElementById("jobPostedMessage");
  const workersContainer = document.getElementById("workersContainer");
  const workerModal = document.getElementById("workerModal");
  const workerDetails = document.getElementById("workerDetails");
  const bookingForm = document.getElementById("bookingForm");
  const confirmationModal = document.getElementById("confirmationModal");
  const bookingDetails = document.getElementById("bookingDetails");
  const reviewModal = document.getElementById("reviewModal");
  const reviewWorkerInfo = document.getElementById("reviewWorkerInfo");
  const reviewForm = document.getElementById("reviewForm");
  const starRating = document.querySelector(".star-rating");
  const ratingInput = document.getElementById("ratingValue");
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  
  // Mobile Navigation
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
  }
  
  // Close mobile menu when clicking on a nav link
  document.querySelectorAll(".nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });
  
  // Initialize the workers section
  function initWorkers() {
    renderWorkers(workers);
  }
  
  // Render workers cards
  function renderWorkers(workersArray) {
    workersContainer.innerHTML = "";
    
    if (workersArray.length === 0) {
      workersContainer.innerHTML = "<p class='no-results'>No workers match your search criteria. Try different filters.</p>";
      return;
    }
  
    workersArray.forEach(worker => {
      const workerCard = document.createElement("div");
      workerCard.className = "worker-card";
      workerCard.innerHTML = `
        <div class="worker-image" style="background-image: url('${worker.image}')"></div>
        <div class="worker-info">
          <h3>${worker.name}</h3>
          <p>${worker.title}</p>
          <div class="worker-rating">
            ${getStarRating(worker.rating)}
            <span>${worker.rating} (${worker.reviews} reviews)</span>
          </div>
          <div class="worker-specs">
            ${worker.skills.map(skill => `<span class="worker-spec">${skill}</span>`).join("")}
          </div>
          <p class="worker-price">$${worker.hourlyRate}/hour</p>
          <button class="btn primary-btn view-profile" data-id="${worker.id}">View Profile</button>
        </div>
      `;
      workersContainer.appendChild(workerCard);
    });
  
    // Add event listeners to view profile buttons
    document.querySelectorAll(".view-profile").forEach(button => {
      button.addEventListener("click", () => {
        const workerId = parseInt(button.getAttribute("data-id"));
        showWorkerDetails(workerId);
      });
    });
  }
  
  // Generate star rating HTML
  function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
      stars += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
  }
  
  // Filter workers
  function filterWorkers() {
    const searchTerm = document.getElementById("workerSearch").value.toLowerCase();
    const category = document.getElementById("workerFilter").value;
    
    const filteredWorkers = workers.filter(worker => {
      const matchesSearch = worker.name.toLowerCase().includes(searchTerm) || 
                            worker.title.toLowerCase().includes(searchTerm) || 
                            worker.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
                            worker.location.toLowerCase().includes(searchTerm);
                            
      const matchesCategory = category === "all" || worker.categories.includes(category);
      
      return matchesSearch && matchesCategory;
    });
    
    renderWorkers(filteredWorkers);
  }
  
  // Show worker details in modal
  function showWorkerDetails(workerId) {
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;
    
    workerDetails.innerHTML = `
      <img src="${worker.image}" alt="${worker.name}" class="worker-detail-image">
      <div class="worker-detail-info">
        <h2>${worker.name}</h2>
        <p>${worker.title}</p>
        <div class="worker-detail-rating">
          ${getStarRating(worker.rating)}
          <span>${worker.rating} (${worker.reviews.length} reviews)</span>
        </div>
        <p><i class="fas fa-map-marker-alt"></i> ${worker.location}</p>
        <p class="worker-detail-price">$${worker.hourlyRate}/hour</p>
        <div class="worker-specs">
          ${worker.skills.map(skill => `<span class="worker-spec">${skill}</span>`).join("")}
        </div>
      </div>
      <div class="worker-about">
        <h3>About</h3>
        <p>${worker.about}</p>
      </div>
      <div class="worker-reviews">
        <h3>Reviews</h3>
        ${worker.reviews.map(review => `
          <div class="review">
            <div class="review-header">
              <span class="review-name">${review.name}</span>
              <span class="review-date">${review.date}</span>
            </div>
            <div class="worker-rating">
              ${getStarRating(review.rating)}
            </div>
            <p>${review.text}</p>
          </div>
        `).join("")}
      </div>
    `;
    
    // Set worker ID on booking form
    bookingForm.setAttribute("data-worker-id", workerId);
    
    // Show modal
    workerModal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }
  
  // Close modals when clicking on close button or outside
  document.querySelectorAll(".close-modal").forEach(closeBtn => {
    closeBtn.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach(modal => {
        modal.style.display = "none";
      });
      document.body.style.overflow = "auto"; // Enable scrolling
    });
  });
  
  window.addEventListener("click", (e) => {
    document.querySelectorAll(".modal").forEach(modal => {
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Enable scrolling
      }
    });
  });
  
  // Handle job form submission
  if (jobForm) {
    jobForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // In a real app, you would send the form data to a server
      // For this demo, we'll just show a success message
      jobForm.reset();
      jobPostedMessage.style.display = "block";
    });
  }
  
  // Hide job posted message
  function hideJobPostedMessage() {
    jobPostedMessage.style.display = "none";
  }
  
  // Handle booking form submission
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const workerId = parseInt(bookingForm.getAttribute("data-worker-id"));
      const worker = workers.find(w => w.id === workerId);
      const bookingDate = document.getElementById("bookingDate").value;
      const bookingTime = document.getElementById("bookingTime").value;
      const bookingDetailsText = document.getElementById("bookingDetails").value;
      
      // Format date for display
      const formattedDate = new Date(bookingDate + "T" + bookingTime).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      });
      
      // In a real app, you would send the booking to a server
      // For this demo, we'll just show a confirmation modal
      bookingDetails.innerHTML = `
        <p><strong>Worker:</strong> ${worker.name}</p>
        <p><strong>Date & Time:</strong> ${formattedDate}</p>
        <p><strong>Hourly Rate:</strong> $${worker.hourlyRate}</p>
        <p><strong>Job Details:</strong> ${bookingDetailsText}</p>
      `;
      
      // Hide worker modal and show confirmation
      workerModal.style.display = "none";
      confirmationModal.style.display = "block";
      
      // Reset booking form
      bookingForm.reset();
      
      // Store booking info for review (in a real app, this would be stored in a database)
      localStorage.setItem("lastBookedWorker", JSON.stringify({
        id: worker.id,
        name: worker.name,
        image: worker.image
      }));
    });
  }
  
  // Close confirmation modal
  function closeConfirmationModal() {
    confirmationModal.style.display = "none";
    document.body.style.overflow = "auto"; // Enable scrolling
    
    // In a real app, you would check if this is the first booking 
    // and only show the review modal after a completed job
    // For this demo, we'll show it right away
    setTimeout(() => {
      showReviewModal();
    }, 1000);
  }
  
  // Show review modal
  function showReviewModal() {
    const lastBookedWorker = JSON.parse(localStorage.getItem("lastBookedWorker"));
    if (!lastBookedWorker) return;
    
    reviewWorkerInfo.innerHTML = `
      <img src="${lastBookedWorker.image}" alt="${lastBookedWorker.name}">
      <div>
        <h4>${lastBookedWorker.name}</h4>
        <p>How was your experience?</p>
      </div>
    `;
    
    reviewModal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }
  
  // Handle star rating in review form
  if (starRating) {
    const stars = starRating.querySelectorAll("i");
    stars.forEach(star => {
      star.addEventListener("click", () => {
        const rating = star.getAttribute("data-rating");
        ratingInput.value = rating;
        
        // Update star display
        stars.forEach(s => {
          const sRating = s.getAttribute("data-rating");
          if (sRating <= rating) {
            s.className = "fas fa-star";
          } else {
            s.className = "far fa-star";
          }
        });
      });
      
      star.addEventListener("mouseover", () => {
        const rating = star.getAttribute("data-rating");
        
        // Update star display on hover
        stars.forEach(s => {
          const sRating = s.getAttribute("data-rating");
          if (sRating <= rating) {
            s.className = "fas fa-star";
          } else {
            s.className = "far fa-star";
          }
        });
      });
      
      star.addEventListener("mouseout", () => {
        const currentRating = ratingInput.value;
        
        // Reset to current rating on mouseout
        stars.forEach(s => {
          const sRating = s.getAttribute("data-rating");
          if (sRating <= currentRating) {
            s.className = "fas fa-star";
          } else {
            s.className = "far fa-star";
          }
        });
      });
    });
  }
  
  // Handle review form submission
  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const rating = ratingInput.value;
      const reviewText = document.getElementById("reviewText").value;
      
      // In a real app, you would send the review to a server
      // For this demo, we'll just close the modal and show an alert
      reviewModal.style.display = "none";
      document.body.style.overflow = "auto"; // Enable scrolling
      
      alert("Thank you for your review!");
      reviewForm.reset();
      ratingInput.value = "0";
      
      // Reset star display
      starRating.querySelectorAll("i").forEach(star => {
        star.className = "far fa-star";
      });
    });
  }
  
  // Show login modal
  function showLoginModal() {
    signupModal.style.display = "none";
    loginModal.style.display = "block";
  }
  
  // Show signup modal
  function showSignupModal() {
    loginModal.style.display = "none";
    signupModal.style.display = "block";
  }
  
  // Handle login button click
  document.querySelectorAll(".btn-login").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showLoginModal();
    });
  });
  
  // Handle signup button click
  document.querySelectorAll(".btn-signup").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      showSignupModal();
    });
  });
  
  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      
      // In a real app, you would validate and authenticate the user
      // For this demo, we'll just close the modal and show an alert
      loginModal.style.display = "none";
      document.body.style.overflow = "auto"; // Enable scrolling
      
      alert(`Logged in as ${email}`);
      loginForm.reset();
    });
  }
  
  // Handle signup form submission
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("signupConfirmPassword").value;
      
      // Validate password match
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      
      // In a real app, you would register the user
      // For this demo, we'll just close the modal and show an alert
      signupModal.style.display = "none";
      document.body.style.overflow = "auto"; // Enable scrolling
      
      alert(`Account created for ${name} (${email})`);
      signupForm.reset();
    });
  }
  
  // Scroll to section function for hero buttons
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }
  
  // Initialize the app
  document.addEventListener("DOMContentLoaded", () => {
    initWorkers();
    
    // Add search input event listener
    const searchInput = document.getElementById("workerSearch");
    if (searchInput) {
      searchInput.addEventListener("input", filterWorkers);
    }
    
    // Add filter select event listener
    const filterSelect = document.getElementById("workerFilter");
    if (filterSelect) {
      filterSelect.addEventListener("change", filterWorkers);
    }
  });
  