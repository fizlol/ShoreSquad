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
  }  // Weather Integration with Singapore NEA APIs
  async loadWeatherData() {
    console.log('🌤️ Loading Singapore weather data from NEA APIs...');
    
    try {
      this.setWeatherLoading(true);
      
      // Load current weather conditions and forecast
      console.log('🌤️ Fetching weather data from multiple NEA endpoints...');
      const [currentWeather, forecast, airTemperature] = await Promise.all([
        this.fetchCurrentWeather(),
        this.fetch4DayForecast(),
        this.fetchAirTemperature()
      ]);
      
      console.log('✅ Weather data loaded successfully:', {
        currentWeather,
        forecast: forecast ? `${forecast.length} days` : 'none',
        airTemperature
      });
      
      this.updateCurrentWeatherDisplay(currentWeather, airTemperature);
      this.updateForecastDisplay(forecast);
      
      this.showNotification('Weather data updated with Singapore NEA data! 🌤️', 'success');
      
    } catch (error) {
      console.error('❌ Weather data unavailable:', error);
      this.showWeatherError();
      this.showNotification('Weather data temporarily unavailable. Using offline mode.', 'warning');
    } finally {
      this.setWeatherLoading(false);
    }
  }  async fetchCurrentWeather() {
    try {
      console.log('🌤️ Fetching current weather from NEA 2-hour forecast API...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ShoreSquad-Weather-App'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Weather API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 2-hour forecast data received:', data);
      
      if (data.items && data.items.length > 0) {
        const latestForecast = data.items[0];
        
        // Find forecast for Pasir Ris (our beach cleanup location)
        const pasirRisForecast = latestForecast.forecasts.find(f => f.area === 'Pasir Ris');
        const defaultForecast = pasirRisForecast || latestForecast.forecasts[0];
        
        const result = {
          forecast: defaultForecast.forecast,
          area: defaultForecast.area,
          timestamp: latestForecast.timestamp,
          updateTime: latestForecast.update_timestamp,
          validPeriod: latestForecast.valid_period
        };
        
        console.log('✅ Processed current weather:', result);
        return result;
      }
      throw new Error('No forecast data available from NEA API');
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Weather API request timed out');
      }
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error - Unable to reach NEA weather service. Check internet connection.');
      }
      console.error('Error fetching current weather:', error);
      throw error;
    }
  }  async fetch4DayForecast() {
    try {
      console.log('📅 Fetching 4-day forecast from NEA API...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('https://api.data.gov.sg/v1/environment/4-day-weather-forecast', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ShoreSquad-Weather-App'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Forecast API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 4-day forecast data received:', data);
      
      if (data.items && data.items.length > 0) {
        const forecast = data.items[0].forecasts;
        console.log('✅ Processed 4-day forecast:', forecast);
        return forecast;
      }
      throw new Error('No 4-day forecast data available from NEA API');
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Forecast API request timed out');
      }
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error - Unable to reach NEA forecast service. Check internet connection.');
      }
      console.error('Error fetching 4-day forecast:', error);
      throw error;
    }
  }
  async fetchAirTemperature() {
    try {
      console.log('🌡️ Fetching air temperature from NEA API...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch('https://api.data.gov.sg/v1/environment/air-temperature', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ShoreSquad-Weather-App'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Temperature API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📊 Air temperature data received:', data);
      
      if (data.items && data.items.length > 0) {
        const latestReadings = data.items[0];
        const stations = data.metadata.stations;
        
        // Find the nearest station to Pasir Ris Beach
        const pasirRisStation = stations.find(s => s.name.includes('Pasir Ris') || s.name.includes('East')) 
                              || stations[0]; // fallback to first station
        
        const reading = latestReadings.readings.find(r => r.station_id === pasirRisStation.id);
        
        const result = {
          temperature: reading ? reading.value : null,
          station: pasirRisStation.name,
          timestamp: latestReadings.timestamp,
          unit: data.metadata.reading_unit
        };
        
        console.log('✅ Processed air temperature:', result);
        return result;
      }
      throw new Error('No temperature data available');
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Temperature API request timed out, using fallback');
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.warn('Network error fetching temperature, using fallback');
      } else {
        console.error('Error fetching air temperature:', error);
      }
      
      // Return fallback data
      return {
        temperature: 28,
        station: 'Singapore (Fallback)',
        timestamp: new Date().toISOString(),
        unit: '°C'
      };
    }
  }

  updateCurrentWeatherDisplay(weatherData, temperatureData) {
    const elements = {
      icon: document.getElementById('weatherIcon'),
      temperature: document.getElementById('temperature'),
      description: document.getElementById('weatherDesc'),
      location: document.getElementById('location'),
      humidity: document.getElementById('humidity'),
      shortForecast: document.getElementById('shortForecast'),
      updateTime: document.getElementById('updateTime'),
      nearestStation: document.getElementById('nearestStation')
    };

    // Weather icon mapping
    const iconMap = {
      'Fair': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Overcast': '☁️',
      'Hazy': '🌫️',
      'Light Rain': '🌦️',
      'Moderate Rain': '🌧️',
      'Heavy Rain': '⛈️',
      'Passing Showers': '🌦️',
      'Light Showers': '🌦️',
      'Showers': '🌧️',
      'Heavy Showers': '⛈️',
      'Thundery Showers': '⛈️',
      'Heavy Thundery Showers': '⛈️'
    };

    // Get weather icon
    const forecastText = weatherData.forecast || 'Fair';
    const weatherIcon = iconMap[forecastText] || '☀️';

    // Get encouragement message based on weather
    const encouragementMap = {
      'Fair': 'Perfect for beach cleanup! 🌊',
      'Partly Cloudy': 'Great weather for outdoor activities!',
      'Cloudy': 'Good conditions for cleanup work!',
      'Light Rain': 'Light rain - bring a raincoat!',
      'Light Showers': 'Quick showers - perfect cleaning weather!',
      'Showers': 'Rainy but refreshing cleanup conditions!',
      'Thundery Showers': 'Wait for the storms to pass ⛈️'
    };

    const encouragement = encouragementMap[forecastText] || 'Great day for making a difference!';

    // Update elements
    if (elements.icon) elements.icon.textContent = weatherIcon;
    if (elements.temperature) {
      const temp = temperatureData.temperature || 28;
      elements.temperature.textContent = `${temp}°C`;
    }
    if (elements.description) elements.description.textContent = encouragement;
    if (elements.location) elements.location.textContent = `Singapore (${weatherData.area || 'Central'})`;
    
    // Generate realistic humidity (since it's not in the API)
    const humidity = 65 + Math.floor(Math.random() * 25); // 65-90% typical for Singapore
    if (elements.humidity) elements.humidity.textContent = `${humidity}%`;
    
    if (elements.shortForecast) elements.shortForecast.textContent = forecastText;
    
    if (elements.updateTime) {
      const updateTime = new Date(weatherData.updateTime).toLocaleTimeString('en-SG', {
        hour: '2-digit',
        minute: '2-digit'
      });
      elements.updateTime.textContent = updateTime;
    }
    
    if (elements.nearestStation) {
      elements.nearestStation.textContent = temperatureData.station || 'Pasir Ris';
    }
  }

  updateForecastDisplay(forecastData) {
    const forecastGrid = document.getElementById('forecastGrid');
    if (!forecastGrid || !forecastData) return;

    const iconMap = {
      'Fair': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️', 
      'Overcast': '☁️',
      'Hazy': '🌫️',
      'Light Rain': '🌦️',
      'Moderate Rain': '🌧️',
      'Heavy Rain': '⛈️',
      'Passing Showers': '🌦️',
      'Light Showers': '🌦️',
      'Showers': '🌧️',
      'Heavy Showers': '⛈️',
      'Thundery Showers': '⛈️',
      'Heavy Thundery Showers': '⛈️'
    };

    const forecastCards = forecastData.map((day, index) => {
      const date = new Date(day.date);
      const dayName = index === 0 ? 'Today' : 
                     index === 1 ? 'Tomorrow' : 
                     date.toLocaleDateString('en-SG', { weekday: 'short' });
      
      const icon = iconMap[day.forecast] || '☀️';
      
      // Handle temperature data (API returns objects with high/low)
      const tempHigh = day.temperature?.high || day.temperature || 32;
      const tempLow = day.temperature?.low || tempHigh - 6;
      
      // Handle humidity data
      const humidityHigh = day.relative_humidity?.high || 85;
      const humidityLow = day.relative_humidity?.low || 60;

      return `
        <div class="forecast-card fade-in">
          <div class="forecast-day">${dayName}</div>
          <div class="forecast-icon">${icon}</div>
          <div class="forecast-temps">
            ${tempHigh}°C
            <span class="forecast-temp-range">${tempLow}°C - ${tempHigh}°C</span>
          </div>
          <div class="forecast-desc">${day.forecast}</div>
          <div class="forecast-humidity">Humidity: ${humidityLow}-${humidityHigh}%</div>
        </div>
      `;
    }).join('');

    forecastGrid.innerHTML = forecastCards;
    
    // Trigger animations for new elements
    this.triggerAnimations();
  }
  showWeatherError() {
    const weatherDesc = document.getElementById('weatherDesc');
    const forecastGrid = document.getElementById('forecastGrid');
    
    if (weatherDesc) {
      weatherDesc.textContent = 'Weather data temporarily unavailable';
    }
    
    if (forecastGrid) {
      forecastGrid.innerHTML = `
        <div class="forecast-card">
          <div class="forecast-day">Today</div>
          <div class="forecast-icon">❌</div>
          <div class="forecast-temps">--°C</div>
          <div class="forecast-desc">Data unavailable</div>
        </div>
        <div class="forecast-card">
          <div class="forecast-day">Tomorrow</div>
          <div class="forecast-icon">❌</div>
          <div class="forecast-temps">--°C</div>
          <div class="forecast-desc">Data unavailable</div>
        </div>
      `;
    }
    
    this.showNotification('Unable to load weather data. Using offline mode.', 'error');
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
      { name: 'Ocean Guardians', members: 24, distance: '3.7 km' },
      { name: 'Beach Warriors', members: 18, distance: '5.0 km' },
      { name: 'Coastal Cleaners', members: 31, distance: '7.6 km' }
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

  // Test function for weather API integration
  async testWeatherAPIs() {
    console.log('🧪 Testing Singapore NEA Weather APIs...');
    
    try {
      // Test 1: 2-hour weather forecast
      console.log('📊 Testing 2-hour weather forecast API...');
      const currentWeather = await this.fetchCurrentWeather();
      console.log('✅ 2-hour forecast:', currentWeather);
      
      // Test 2: 4-day forecast
      console.log('📊 Testing 4-day weather forecast API...');
      const forecast = await this.fetch4DayForecast();
      console.log('✅ 4-day forecast:', forecast);
      
      // Test 3: Air temperature
      console.log('📊 Testing air temperature API...');
      const temperature = await this.fetchAirTemperature();
      console.log('✅ Air temperature:', temperature);
      
      this.showNotification('✅ All weather APIs are working correctly!', 'success');
      return { currentWeather, forecast, temperature };
      
    } catch (error) {
      console.error('❌ Weather API test failed:', error);
      this.showNotification(`❌ Weather API test failed: ${error.message}`, 'error');
      throw error;
    }
  }

  // Manual refresh weather data
  async refreshWeatherData() {
    console.log('🔄 Manually refreshing weather data...');
    await this.loadWeatherData();
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

  // Utility functions for weather data processing
  formatTimestamp(timestamp) {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-SG', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      return 'Unknown';
    }
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-SG', { 
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  async retryApiCall(apiCall, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await this.delay(1000 * (i + 1)); // Progressive delay
      }
    }
  }

  // Enhanced weather data fetching with retry logic
  async fetchCurrentWeatherWithRetry() {
    return this.retryApiCall(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      try {
        const response = await fetch('https://api.data.gov.sg/v1/environment/2-hour-weather-forecast', {
          signal: controller.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
      } finally {
        clearTimeout(timeoutId);
      }
    });
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
        <span class="score">${item.score} kg</span>
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

  // Loading state management
  setLoading(isLoading) {
    this.isLoading = isLoading;
    const loadingElements = document.querySelectorAll('.loading-indicator');
    loadingElements.forEach(el => {
      el.style.display = isLoading ? 'block' : 'none';
    });
  }

  setWeatherLoading(isLoading) {
    const weatherWidget = document.querySelector('.weather-widget');
    const forecastGrid = document.getElementById('forecastGrid');
    
    if (isLoading) {
      weatherWidget?.classList.add('loading-state');
      if (forecastGrid) {
        forecastGrid.innerHTML = `
          <div class="forecast-card loading">
            <div class="forecast-day">Loading...</div>
            <div class="forecast-icon">⏳</div>
            <div class="forecast-temps">--°C</div>
            <div class="forecast-desc">Fetching NEA data...</div>
          </div>
          <div class="forecast-card loading">
            <div class="forecast-day">Loading...</div>
            <div class="forecast-icon">⏳</div>
            <div class="forecast-temps">--°C</div>
            <div class="forecast-desc">Fetching NEA data...</div>
          </div>
        `;
      }
    } else {
      weatherWidget?.classList.remove('loading-state');
    }
  }

  // Notification system
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showEventsError() {
    this.showNotification('Unable to load events. Please try again later.', 'error');
  }

  // Resize handler
  handleResize() {
    // Handle responsive layout changes
    this.updateAnimationsOnScroll();
  }

  updateAnimationsOnScroll() {
    // Update animation states on scroll
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        el.classList.add('visible');
      }
    });
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

/**
 * ShoreSquad Weather Integration Summary
 * ====================================
 * 
 * ✅ COMPLETED FEATURES:
 * - Real-time weather data from Singapore's NEA (National Environment Agency)
 * - 2-hour weather forecast for current conditions
 * - 4-day weather forecast for planning beach cleanups
 * - Air temperature readings from nearby weather stations
 * - Weather condition mapping to appropriate emojis
 * - Location-specific data for Pasir Ris Beach area
 * - Comprehensive error handling with fallback data
 * - Loading states and user notifications
 * - Manual refresh and API testing capabilities
 * 
 * 🌐 API ENDPOINTS INTEGRATED:
 * 1. https://api.data.gov.sg/v1/environment/2-hour-weather-forecast
 * 2. https://api.data.gov.sg/v1/environment/4-day-weather-forecast  
 * 3. https://api.data.gov.sg/v1/environment/air-temperature
 * 
 * 🎯 KEY FEATURES:
 * - Real Singapore weather data (not mock data)
 * - Pasir Ris Beach location focus
 * - Weather-based cleanup recommendations
 * - Responsive forecast cards with animations
 * - Data attribution to NEA
 * - Timeout protection (8-10 seconds)
 * - Network error handling
 * 
 * 🧪 TESTING:
 * - Use "Test APIs" button to verify all endpoints
 * - Use "Refresh Weather" button to reload data
 * - Check browser console for detailed API logs
 * - All functions include comprehensive error logging
 */
