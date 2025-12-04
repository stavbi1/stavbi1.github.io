// Load and display apps from JSON
async function loadApps() {
  const appsGrid = document.getElementById("apps-grid");

  // Show loading state
  appsGrid.innerHTML = '<div class="loading">Loading apps...</div>';

  try {
    const response = await fetch("/assets/apps.json");
    if (!response.ok) throw new Error("Failed to load apps");

    const data = await response.json();
    const apps = data.apps;

    // Clear loading state
    appsGrid.innerHTML = "";

    // Create app cards
    apps.forEach((app, index) => {
      const card = createAppCard(app, index);
      appsGrid.appendChild(card);
    });

    // Setup staggered fade-in animation for app cards
    setTimeout(() => {
      setupAppCardsAnimation();
    }, 100);
  } catch (error) {
    console.error("Error loading apps:", error);
    appsGrid.innerHTML =
      '<div class="error">Failed to load apps. Please try again later.</div>';
  }
}

// Create an app card element
function createAppCard(app, index) {
  const card = document.createElement("div");
  card.className = "app-card";
  card.setAttribute("data-index", index);

  // Map app names to image filenames
  const imageMap = {
    "Gym PR Tracker": "gym-pr-tracker.png",
    "Sun Tan Tracker": "sun-tran-tracker.png",
    "Habit Dice": "habit-dice.png",
    "CS Mastery: Data Structures": "cs-mastery-data-structures.png",
    "CS Mastery: Algorithms": "cs-mastery-algorithms.png",
    "World Speed Quiz": "world-speed-quiz.png",
  };

  const imageName = imageMap[app.name] || "default.png";

  card.innerHTML = `
        <div class="app-image-container">
            <img src="/assets/images/${imageName}" alt="${app.name}" class="app-image" loading="lazy">
        </div>
        <div class="app-content">
            <h3 class="app-name">${app.name}</h3>
            <p class="app-description">${app.description}</p>
            <a href="${app.link}" target="_blank" rel="noopener noreferrer" class="app-link">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                View on Play Store
            </a>
        </div>
    `;

  return card;
}

// Copy email to clipboard and show notification
function copyEmailToClipboard() {
  const email = "stavbi1@gmail.com";

  navigator.clipboard
    .writeText(email)
    .then(() => {
      showNotification("Email copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy email:", err);
      showNotification("Failed to copy email", true);
    });
}

// Show notification banner
function showNotification(message, isError = false) {
  // Remove existing notification if any
  const existing = document.querySelector(".notification-banner");
  if (existing) {
    existing.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification-banner";
  if (isError) {
    notification.style.background = "#ef4444";
  }

  notification.innerHTML = `
    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
    </svg>
    ${message}
  `;

  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Smooth scroll for anchor links
document.addEventListener("DOMContentLoaded", () => {
  // Load apps
  loadApps();

  // Add event listener for copy email button
  const copyEmailBtn = document.getElementById("copy-email-btn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", copyEmailToClipboard);
  }

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add fade-in class to all elements that should animate
  const animateElements = document.querySelectorAll(
    ".service-card, .portfolio-showcase, .contact-cta, .section-title, .section-subtitle, #apps-grid"
  );

  animateElements.forEach((el) => {
    el.classList.add("fade-in");
  });

  // Setup Intersection Observer for fade-in animations
  setupScrollAnimations();
});

// Setup scroll-based fade-in animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  // Standard observer for most elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all fade-in elements
  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });
}

// Setup staggered animation for app cards
function setupAppCardsAnimation() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const appCards = document.querySelectorAll(".app-card");

  // Add fade-in class to all app cards
  appCards.forEach((card) => {
    card.classList.add("fade-in");
  });

  // Observer for the first app card to trigger all animations
  const appCardsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Trigger staggered animation for all cards
        appCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("visible");
          }, index * 150);
        });
        appCardsObserver.disconnect();
      }
    });
  }, observerOptions);

  // Observe the first app card
  if (appCards.length > 0) {
    appCardsObserver.observe(appCards[0]);
  }
}
