
// Mock data for workers
const workers = [
    {
      id: 1,
      name: "Michael Johnson",
      title: "Professional Handyman",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
      reviews: 124,
      hourlyRate: 35,
      categories: ["home-repair", "painting"],
      skills: ["Electrical", "Plumbing", "Carpentry"],
      location: "Brooklyn, NY",
      about: "With over 15 years of experience in home repairs, I can fix almost anything in your house. I specialize in electrical work, plumbing, and carpentry. I take pride in providing quality work with attention to detail.",
      reviews: [
        { name: "Sarah L.", date: "March 15, 2025", rating: 5, text: "Michael did an excellent job fixing my kitchen sink and installing new cabinets. Very professional and clean work." },
        { name: "Robert T.", date: "February 28, 2025", rating: 5, text: "Great work ethic and attention to detail. Completed the job faster than expected and at a reasonable price." },
        { name: "Jennifer K.", date: "January 10, 2025", rating: 4, text: "Fixed my electrical issues quickly. Would hire again for future projects." }
      ]
    },
    {
      id: 2,
      name: "Lisa Williams",
      title: "Expert Cleaner",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      rating: 4.9,
      reviews: 87,
      hourlyRate: 28,
      categories: ["cleaning"],
      skills: ["Deep Cleaning", "Organization", "Eco-friendly"],
      location: "Queens, NY",
      about: "I deliver professional cleaning services for homes and small offices. I use eco-friendly products and pay special attention to details. I'm flexible with scheduling and can accommodate regular cleaning or one-time deep cleans.",
      reviews: [
        { name: "David M.", date: "April 2, 2025", rating: 5, text: "Lisa is amazing! My apartment has never been so clean. She's thorough and efficient." },
        { name: "Emily R.", date: "March 20, 2025", rating: 5, text: "Very reliable and does an excellent job. I've booked her for weekly cleaning." },
        { name: "James P.", date: "February 15, 2025", rating: 4, text: "Great work, but arrived a bit late. Otherwise very satisfied with the cleaning." }
      ]
    },
    {
      id: 3,
      name: "Carlos Rodriguez",
      title: "Moving Specialist",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 4.7,
      reviews: 56,
      hourlyRate: 40,
      categories: ["moving"],
      skills: ["Heavy Lifting", "Furniture Assembly", "Packing"],
      location: "Bronx, NY",
      about: "I specialize in residential and small office moves. I can help with packing, heavy lifting, furniture assembly, and everything in between. I bring my own tools and equipment to make your move as smooth as possible.",
      reviews: [
        { name: "Sophia T.", date: "March 28, 2025", rating: 5, text: "Carlos and his helper made my move so much easier. They were careful with my furniture and very efficient." },
        { name: "Michael B.", date: "February 12, 2025", rating: 4, text: "Good service overall. Assembled my furniture quickly and correctly." },
        { name: "Jessica L.", date: "January 5, 2025", rating: 5, text: "Carlos is strong, fast, and knows how to pack a truck efficiently. Will definitely use his services again." }
      ]
    },
    {
      id: 4,
      name: "Anna Chen",
      title: "Landscape Designer",
      image: "https://randomuser.me/api/portraits/women/79.jpg",
      rating: 4.6,
      reviews: 43,
      hourlyRate: 45,
      categories: ["landscaping"],
      skills: ["Garden Design", "Plant Care", "Lawn Maintenance"],
      location: "Manhattan, NY",
      about: "I offer comprehensive landscaping services including garden design, plant selection, lawn maintenance, and seasonal cleanups. I have a degree in horticulture and over 8 years of hands-on experience creating beautiful outdoor spaces.",
      reviews: [
        { name: "William H.", date: "April 10, 2025", rating: 5, text: "Anna transformed my backyard into a beautiful garden. She selected plants that work perfectly in my space." },
        { name: "Karen M.", date: "March 5, 2025", rating: 4, text: "Very knowledgeable about plants and garden design. My garden looks amazing now." },
        { name: "Thomas R.", date: "February 20, 2025", rating: 5, text: "Anna is creative and hardworking. She completed our landscaping project on time and within budget." }
      ]
    },
    {
      id: 5,
      name: "James Wilson",
      title: "Professional Painter",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      rating: 4.9,
      reviews: 78,
      hourlyRate: 38,
      categories: ["painting"],
      skills: ["Interior Painting", "Exterior Painting", "Color Consultation"],
      location: "Staten Island, NY",
      about: "I'm a professional painter with expertise in both interior and exterior painting. I use premium paints and materials to ensure a long-lasting finish. I can help with color selection, surface preparation, and detailed finishing work.",
      reviews: [
        { name: "Laura B.", date: "April 5, 2025", rating: 5, text: "James did an excellent job painting my living room and kitchen. Clean lines, no mess, and finished ahead of schedule." },
        { name: "Daniel K.", date: "March 18, 2025", rating: 5, text: "Very professional and detail-oriented. The exterior of my house looks brand new." },
        { name: "Natalie S.", date: "February 28, 2025", rating: 4, text: "James helped me choose the perfect colors for my home office. Great work and reasonable prices." }
      ]
    },
    {
      id: 6,
      name: "Maria Gonzalez",
      title: "Home Organizer",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 4.8,
      reviews: 39,
      hourlyRate: 32,
      categories: ["cleaning", "home-repair"],
      skills: ["Space Optimization", "Decluttering", "Storage Solutions"],
      location: "Queens, NY",
      about: "I help clients transform cluttered spaces into organized, functional areas. I create customized organization systems based on your lifestyle and needs. I can organize any space from closets and kitchens to garages and home offices.",
      reviews: [
        { name: "Christopher L.", date: "April 15, 2025", rating: 5, text: "Maria reorganized my entire kitchen and pantry. I can finally find everything I need easily!" },
        { name: "Amanda J.", date: "March 25, 2025", rating: 4, text: "She helped me declutter my home office and set up an efficient filing system. Great advice and hands-on help." },
        { name: "Ryan T.", date: "February 10, 2025", rating: 5, text: "Maria has amazing organizational skills. My closets and garage have never been so organized." }
      ]
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
  