/**
 * ShoreSquad App JavaScript
 * Features: Interactive UI, Weather API, Geolocation, Progressive Web App capabilities
 * Performance: Debouncing, Lazy loading, Service worker ready
 */

class ShoreSquadApp {
  constructor() {
    this.isLoading = false;
    this.currentLocation = null;
    this.events = [];
    this.init();
  }

  init() {
    this.bindEvents();
    this.initIntersectionObserver();
    this.loadInitialData();
    this.initServiceWorker();
  }

  bindEvents() {
    // Navigation
    this.bindNavigation();
    
    // Hero actions
    this.bindHeroActions();
    
    // Event filters
    this.bindEventFilters();
    
    // Modal interactions
    this.bindModals();
    
    // Form submissions
    this.bindForms();
    
    // Scroll events (debounced)
    this.bindScrollEvents();
    
    // Resize events (debounced)
    this.bindResizeEvents();
  }

  bindNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle?.addEventListener('click', () => {
      navMenu?.classList.toggle('active');
      const isExpanded = navMenu?.classList.contains('active');
      navToggle.setAttribute('aria-expanded', isExpanded);
      
      // Animate hamburger lines
      this.animateHamburger(navToggle, isExpanded);
    });

    // Smooth scroll navigation
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Close mobile menu if open
          navMenu?.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          this.animateHamburger(navToggle, false);
          
          // Smooth scroll to target
          this.smoothScrollTo(targetElement);
        }
      });
    });
  }

  animateHamburger(toggle, isOpen) {
    const lines = toggle.querySelectorAll('.hamburger-line');
    if (isOpen) {
      lines[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
    } else {
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    }
  }

  smoothScrollTo(element) {
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = element.offsetTop - navHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
  bindHeroActions() {
    const joinSquadBtn = document.getElementById('joinSquadBtn');
    const createEventBtn = document.getElementById('createEventBtn');
    const joinNextCleanupBtn = document.getElementById('joinNextCleanupBtn');

    joinSquadBtn?.addEventListener('click', () => {
      this.openModal('joinSquadModal');
    });

    createEventBtn?.addEventListener('click', () => {
      this.showCreateEventInterface();
    });

    joinNextCleanupBtn?.addEventListener('click', () => {
      this.handleJoinNextCleanup();
    });
  }

  bindEventFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('loadMoreEvents');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter events
        const filterType = btn.dataset.filter;
        this.filterEvents(filterType);
      });
    });

    loadMoreBtn?.addEventListener('click', () => {
      this.loadMoreEvents();
    });
  }

  bindModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
      const closeBtn = modal.querySelector('.modal-close');
      
      // Close on button click
      closeBtn?.addEventListener('click', () => {
        this.closeModal(modal.id);
      });
      
      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
      
      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          this.closeModal(modal.id);
        }
      });
    });
  }

  bindForms() {
    const joinSquadForm = document.getElementById('joinSquadForm');
    
    joinSquadForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleJoinSquadForm(new FormData(joinSquadForm));
    });
  }

  bindScrollEvents() {
    const scrollHandler = this.debounce(() => {
      this.updateNavbarOnScroll();
      this.updateAnimationsOnScroll();
    }, 16); // ~60fps

    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  bindResizeEvents() {
    const resizeHandler = this.debounce(() => {
      this.handleResize();
    }, 250);

    window.addEventListener('resize', resizeHandler);
  }

  // Modal Management
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Focus management
      const firstFocusable = modal.querySelector('input, button, select, textarea, [tabindex]:not([tabindex="-1"])');
      firstFocusable?.focus();
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Weather Integration
  async loadWeatherData() {
    try {
      // Get user location first
      const location = await this.getCurrentLocation();
      this.currentLocation = location;
      
      // Mock weather data (replace with real API)
      const weatherData = await this.fetchWeatherData(location);
      this.updateWeatherDisplay(weatherData);
    } catch (error) {
      console.warn('Weather data unavailable:', error);
      this.showWeatherError();
    }
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          // Fallback to default location (Santa Monica)
          resolve({ lat: 34.0195, lng: -118.4912 });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }

  async fetchWeatherData(location) {
    // Mock weather data - replace with actual weather API
    // Example: OpenWeatherMap, WeatherAPI, etc.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          temperature: Math.round(18 + Math.random() * 12), // 18-30°C
          description: ['Perfect for cleanup!', 'Great beach weather', 'Ideal conditions'][Math.floor(Math.random() * 3)],
          icon: ['☀️', '⛅', '🌤️'][Math.floor(Math.random() * 3)],
          windSpeed: Math.round(5 + Math.random() * 10),
          humidity: Math.round(50 + Math.random() * 30),
          uvIndex: Math.round(3 + Math.random() * 7),
          tide: 'Low 2:30 PM',
          location: 'Santa Monica Beach'
        });
      }, 500);
    });
  }

  updateWeatherDisplay(data) {
    const elements = {
      icon: document.getElementById('weatherIcon'),
      temperature: document.getElementById('temperature'),
      description: document.getElementById('weatherDesc'),
      location: document.getElementById('location'),
      windSpeed: document.getElementById('windSpeed'),
      humidity: document.getElementById('humidity'),
      uvIndex: document.getElementById('uvIndex'),
      tideInfo: document.getElementById('tideInfo')
    };

    if (elements.icon) elements.icon.textContent = data.icon;
    if (elements.temperature) elements.temperature.textContent = `${data.temperature}°C`;
    if (elements.description) elements.description.textContent = data.description;
    if (elements.location) elements.location.textContent = data.location;
    if (elements.windSpeed) elements.windSpeed.textContent = `${data.windSpeed} mph`;
    if (elements.humidity) elements.humidity.textContent = `${data.humidity}%`;
    if (elements.uvIndex) elements.uvIndex.textContent = data.uvIndex;
    if (elements.tideInfo) elements.tideInfo.textContent = data.tide;
  }

  showWeatherError() {
    const weatherDesc = document.getElementById('weatherDesc');
    if (weatherDesc) {
      weatherDesc.textContent = 'Weather data unavailable';
    }
  }

  // Events Management
  async loadEvents() {
    try {
      this.setLoading(true);
      const events = await this.fetchEvents();
      this.events = events;
      this.displayEvents(events);
    } catch (error) {
      console.error('Failed to load events:', error);
      this.showEventsError();
    } finally {
      this.setLoading(false);
    }
  }

  async fetchEvents() {
    // Mock events data - replace with actual API
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockEvents = [
          {
            id: 1,
            title: 'Santa Monica Sunrise Cleanup',
            date: '2025-06-07',
            time: '07:00',
            location: 'Santa Monica Beach',
            participants: 28,
            maxParticipants: 50,
            difficulty: 'beginner',
            description: 'Join us for an early morning beach cleanup with coffee and pastries!',
            organizer: 'Ocean Guardians',
            tags: ['weekend', 'beginner', 'nearby']
          },
          {
            id: 2,
            title: 'Malibu Surfrider Cleanup',
            date: '2025-06-08',
            time: '09:00',
            location: 'Surfrider Beach, Malibu',
            participants: 45,
            maxParticipants: 60,
            difficulty: 'intermediate',
            description: 'Protect the waves we love! Equipment provided.',
            organizer: 'Surf & Clean',
            tags: ['weekend', 'nearby']
          },
          {
            id: 3,
            title: 'Manhattan Beach Family Day',
            date: '2025-06-14',
            time: '10:00',
            location: 'Manhattan Beach',
            participants: 67,
            maxParticipants: 100,
            difficulty: 'beginner',
            description: 'Family-friendly cleanup with activities for kids!',
            organizer: 'Beach Families United',
            tags: ['weekend', 'beginner', 'family']
          }
        ];
        resolve(mockEvents);
      }, 800);
    });
  }

  displayEvents(events) {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = events.map(event => this.createEventCard(event)).join('');
    
    // Add event listeners to new cards
    this.bindEventCards();
  }

  createEventCard(event) {
    const spotsLeft = event.maxParticipants - event.participants;
    const isFull = spotsLeft <= 0;
    
    return `
      <div class="event-card fade-in" data-event-id="${event.id}">
        <div class="event-header">
          <h3 class="event-title">${event.title}</h3>
          <span class="event-difficulty ${event.difficulty}">${event.difficulty}</span>
        </div>
        <div class="event-details">
          <div class="event-date">
            <span class="icon">📅</span>
            <span>${this.formatDate(event.date)} at ${event.time}</span>
          </div>
          <div class="event-location">
            <span class="icon">📍</span>
            <span>${event.location}</span>
          </div>
          <div class="event-organizer">
            <span class="icon">👥</span>
            <span>${event.organizer}</span>
          </div>
        </div>
        <p class="event-description">${event.description}</p>
        <div class="event-footer">
          <div class="event-participants">
            <span class="participants-count">${event.participants}/${event.maxParticipants}</span>
            <span class="spots-left">${isFull ? 'Full' : `${spotsLeft} spots left`}</span>
          </div>
          <button class="btn ${isFull ? 'btn-outline' : 'btn-primary'} join-event-btn" 
                  ${isFull ? 'disabled' : ''}>
            ${isFull ? 'Waitlist' : 'Join Event'}
          </button>
        </div>
      </div>
    `;
  }

  bindEventCards() {
    const joinBtns = document.querySelectorAll('.join-event-btn');
    joinBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const eventCard = e.target.closest('.event-card');
        const eventId = eventCard.dataset.eventId;
        this.handleJoinEvent(eventId);
      });
    });
  }

  filterEvents(filterType) {
    let filteredEvents = this.events;
    
    if (filterType !== 'all') {
      filteredEvents = this.events.filter(event => 
        event.tags.includes(filterType)
      );
    }
    
    this.displayEvents(filteredEvents);
    this.triggerAnimations();
  }

  // Stats Animation
  animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
      const target = parseInt(stat.dataset.count);
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = Math.floor(current).toLocaleString();
      }, 16);
    });
  }

  // Intersection Observer for animations
  initIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Trigger stats animation
          if (entry.target.classList.contains('stats-section')) {
            this.animateStats();
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for animation
    this.observeElements();
  }

  observeElements() {
    const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .stats-section');
    elements.forEach(el => this.observer.observe(el));
  }

  triggerAnimations() {
    // Re-observe new elements after dynamic content load
    setTimeout(() => {
      this.observeElements();
    }, 100);
  }

  // Navbar scroll behavior
  updateNavbarOnScroll() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.scrollY > 100;
    
    if (scrolled) {
      navbar.style.background = 'rgba(248, 250, 252, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.background = 'rgba(248, 250, 252, 0.95)';
      navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
  }

  // Form Handlers
  async handleJoinSquadForm(formData) {
    try {
      this.setLoading(true);
      const location = formData.get('location');
      const preference = formData.get('preference');
      
      // Simulate API call
      await this.delay(1500);
      
      // Mock response
      const squads = await this.findSquads(location, preference);
      this.displaySquadResults(squads);
      
    } catch (error) {
      console.error('Error joining squad:', error);
      this.showError('Failed to find squads. Please try again.');
    } finally {
      this.setLoading(false);
    }
  }

  async findSquads(location, preference) {
    // Mock squad finding
    return [
      { name: 'Ocean Guardians', members: 24, distance: '2.3 miles' },
      { name: 'Beach Warriors', members: 18, distance: '3.1 miles' },
      { name: 'Coastal Cleaners', members: 31, distance: '4.7 miles' }
    ];
  }

  displaySquadResults(squads) {
    // Update modal content with results
    const modalBody = document.querySelector('#joinSquadModal .modal-body');
    modalBody.innerHTML = `
      <h3>Squads Near You</h3>
      <div class="squad-results">
        ${squads.map(squad => `
          <div class="squad-result">
            <h4>${squad.name}</h4>
            <p>${squad.members} members • ${squad.distance} away</p>
            <button class="btn btn-primary btn-sm">Join Squad</button>
          </div>
        `).join('')}
      </div>
    `;
  }
  handleJoinEvent(eventId) {
    // Simulate joining an event
    console.log(`Joining event ${eventId}`);
    this.showNotification('Successfully joined the cleanup event!', 'success');
  }

  handleJoinNextCleanup() {
    // Handle joining the next cleanup at Pasir Ris
    this.showNotification('Awesome! You\'ve joined the Pasir Ris Beach cleanup. Check your email for details!', 'success');
    
    // Simulate API call to register user
    setTimeout(() => {
      this.showNotification('Calendar invite sent! See you at Pasir Ris Beach this weekend! 🌊', 'info');
    }, 2000);
  }

  showCreateEventInterface() {
    this.showNotification('Create Event feature coming soon!', 'info');
  }

  // Utility Functions
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    const loadingElements = document.querySelectorAll('.loading-target');
    loadingElements.forEach(el => {
      if (isLoading) {
        el.classList.add('loading');
      } else {
        el.classList.remove('loading');
      }
    });
  }

  showNotification(message, type = 'info') {
    // Create and show notification toast
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      background: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#0EA5E9',
      color: 'white',
      zIndex: '3000',
      transform: 'translateX(400px)',
      transition: 'transform 0.3s ease',
      maxWidth: '300px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  handleResize() {
    // Handle responsive adjustments
    this.updateNavbarLayout();
  }

  updateNavbarLayout() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    
    if (window.innerWidth > 768) {
      navMenu?.classList.remove('active');
      navToggle?.setAttribute('aria-expanded', 'false');
      this.animateHamburger(navToggle, false);
    }
  }

  // Service Worker Registration
  async initServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        // Register service worker for PWA capabilities
        // await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker support detected');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }

  // Initial data loading
  async loadInitialData() {
    try {
      // Load all initial data
      await Promise.all([
        this.loadWeatherData(),
        this.loadEvents(),
        this.loadLeaderboard()
      ]);
      
      // Trigger initial animations
      this.triggerAnimations();
      
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  }

  async loadLeaderboard() {
    // Mock leaderboard data
    const leaderboard = [
      { rank: 1, name: 'Ocean Guardians', score: 287, trend: '+15' },
      { rank: 2, name: 'Beach Warriors', score: 251, trend: '+8' },
      { rank: 3, name: 'Coastal Cleaners', score: 234, trend: '+22' }
    ];
    
    this.displayLeaderboard(leaderboard);
  }

  displayLeaderboard(data) {
    const leaderboardEl = document.getElementById('leaderboard');
    if (!leaderboardEl) return;
    
    leaderboardEl.innerHTML = data.map(item => `
      <div class="leaderboard-item">
        <span class="rank">#${item.rank}</span>
        <span class="name">${item.name}</span>
        <span class="score">${item.score} lbs</span>
        <span class="trend ${item.trend.startsWith('+') ? 'positive' : 'negative'}">${item.trend}</span>
      </div>
    `).join('');
  }

  async loadMoreEvents() {
    // Simulate loading more events
    this.showNotification('Loading more events...', 'info');
    await this.delay(1000);
    this.showNotification('No more events to load', 'info');
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.shoreSquadApp = new ShoreSquadApp();
});

// Additional CSS for dynamic elements
const dynamicStyles = `
  .event-card {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: 1px solid #F1F5F9;
  }
  
  .event-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  
  .event-title {
    margin: 0;
    color: #1E293B;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .event-difficulty {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .event-difficulty.beginner {
    background: #D1FAE5;
    color: #059669;
  }
  
  .event-difficulty.intermediate {
    background: #FEF3C7;
    color: #D97706;
  }
  
  .event-details {
    margin-bottom: 16px;
  }
  
  .event-details > div {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    color: #64748B;
    font-size: 14px;
  }
  
  .event-details .icon {
    margin-right: 8px;
    width: 16px;
  }
  
  .event-description {
    color: #64748B;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 20px;
  }
  
  .event-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #F1F5F9;
  }
  
  .participants-count {
    font-weight: 600;
    color: #1E293B;
  }
  
  .spots-left {
    color: #64748B;
    font-size: 12px;
  }
  
  .btn-sm {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  .squad-results {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .squad-result {
    padding: 16px;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    background: #FAFAFA;
  }
  
  .squad-result h4 {
    margin: 0 0 8px 0;
    color: #0EA5E9;
  }
  
  .squad-result p {
    margin: 0 0 12px 0;
    color: #64748B;
    font-size: 14px;
  }
  
  .leaderboard-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #F1F5F9;
  }
  
  .leaderboard-item:last-child {
    border-bottom: none;
  }
  
  .rank {
    font-weight: 700;
    color: #0EA5E9;
    margin-right: 12px;
    min-width: 30px;
  }
  
  .name {
    flex: 1;
    font-weight: 500;
  }
  
  .score {
    color: #64748B;
    margin-right: 12px;
  }
  
  .trend {
    font-size: 12px;
    font-weight: 600;
  }
  
  .trend.positive {
    color: #10B981;
  }
  
  .trend.negative {
    color: #EF4444;
  }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);
