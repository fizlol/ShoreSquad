# 🌊 ShoreSquad

> Rally your crew, track weather, and hit the next beach cleanup with our dope map app!

ShoreSquad is a modern web application that mobilizes young people to participate in beach cleanup events. With real-time weather tracking, social squad features, and an intuitive interface, we make environmental action fun and connected.

## ✨ Features

- **🌤️ Weather Integration**: Real-time weather conditions and forecasts
- **📅 Event Management**: Discover and join local beach cleanup events
- **👥 Squad System**: Join or create cleanup crews with friends
- **📊 Impact Tracking**: Visualize your environmental contribution
- **📱 Mobile-First**: Responsive design optimized for all devices
- **♿ Accessible**: WCAG 2.1 AA compliant with keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Modern web browser
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shoresquad.git
   cd shoresquad
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with live reload
- `npm start` - Start production server
- `npm run build` - Build for production
- `npm test` - Run tests (coming soon)

### Project Structure

```
shoresquad/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Main stylesheet with CSS custom properties
├── js/
│   └── app.js              # Main application logic
├── .github/
│   └── copilot-instructions.md
├── .vscode/
│   └── tasks.json          # VS Code tasks
├── package.json
├── .gitignore
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary Blue** (#0EA5E9) - Energy, trust, action
- **Coral** (#FF6B6B) - Warmth, community, urgency
- **Seafoam** (#10B981) - Growth, nature, success
- **Sand** (#F8FAFC) - Clean, modern, accessible
- **Deep Navy** (#1E293B) - Professionalism, contrast

### Typography
- **Font Family**: Inter (with system font fallbacks)
- **Scale**: 0.75rem to 4rem with consistent spacing
- **Weights**: 300, 400, 500, 600, 700

## 🌐 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 🚧 Roadmap

- [ ] Real weather API integration
- [ ] Backend API development
- [ ] User authentication system
- [ ] Push notifications
- [ ] Progressive Web App features
- [ ] Map integration for event locations
- [ ] Photo sharing for cleanup results
- [ ] Achievement system and badges

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📱 Progressive Web App

ShoreSquad is designed to be PWA-ready with:
- Service Worker support (ready for implementation)
- Offline functionality
- Install prompts
- Push notifications

## ♿ Accessibility

We're committed to making ShoreSquad accessible to everyone:
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- High contrast support
- Reduced motion preferences

## 🔧 Technical Details

### Performance Optimizations
- Intersection Observer for lazy loading
- Debounced scroll and resize events
- Optimized animations with `transform` and `opacity`
- Efficient DOM manipulation

### API Integration Ready
The app is structured to easily integrate with real APIs:
- Weather services (OpenWeatherMap, WeatherAPI)
- Geolocation services
- Backend REST APIs
- Authentication providers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌊 Making Waves

Built with ❤️ for the planet. Every beach cleanup counts!

---

**ShoreSquad Team** - Making environmental action social, fun, and impactful.
