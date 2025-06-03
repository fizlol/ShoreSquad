<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# ShoreSquad Project Instructions

## Project Overview
ShoreSquad is a beach cleanup coordination web application targeting young people. The app focuses on social features, weather tracking, and community engagement to make environmental action fun and connected.

## Brand Guidelines
- **Tone**: Energetic, youth-focused, eco-conscious, community-driven
- **Target Audience**: Young people (16-30) passionate about environmental action
- **Color Palette**: 
  - Primary: Ocean Blue (#0EA5E9) - Energy, trust, action
  - Secondary: Coral (#FF6B6B) - Warmth, community, urgency  
  - Accent: Seafoam (#10B981) - Growth, nature, success
  - Neutral: Sand (#F8FAFC) - Clean, modern, accessible
  - Dark: Deep Navy (#1E293B) - Professionalism, contrast

## Technical Stack
- **Frontend**: HTML5, CSS3 (with CSS Custom Properties), Vanilla JavaScript ES6+
- **Architecture**: Mobile-first responsive design, Progressive Web App ready
- **APIs**: Weather API integration, Geolocation API, Service Worker support
- **Performance**: Intersection Observer, debounced events, lazy loading

## Code Standards
- Use semantic HTML with proper ARIA labels for accessibility
- Follow mobile-first responsive design principles
- Implement smooth animations with respect for `prefers-reduced-motion`
- Use CSS custom properties (variables) for consistent theming
- Write modular, class-based JavaScript with proper error handling
- Include proper focus management for modal interactions
- Optimize for Core Web Vitals (LCP, FID, CLS)

## Features to Maintain
- Interactive weather widget with real location data
- Event filtering and search functionality
- Social squad management and leaderboards
- Smooth scroll navigation with active states
- Modal accessibility with keyboard navigation
- Mobile-responsive hamburger navigation
- Animated statistics counters
- Real-time notifications system

## UX Principles
- **Accessibility First**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- **Performance**: Fast loading, optimized images, efficient animations
- **Usability**: Clear call-to-actions, intuitive navigation, helpful feedback
- **Engagement**: Gamification elements, social features, progress tracking
- **Trust**: Clear data usage, environmental impact visibility

## File Structure
```
/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # Complete stylesheet with CSS custom properties
├── js/
│   └── app.js          # Main application logic and interactivity
├── .github/
│   └── copilot-instructions.md
└── .vscode/
    └── tasks.json      # Build and development tasks
```

## Development Notes
- The app is designed to be easily extensible with real APIs
- Weather data currently uses mock data - replace with actual weather service
- Event data is simulated - integrate with backend when available
- Service Worker registration is prepared for PWA capabilities
- All interactive elements include loading states and error handling
