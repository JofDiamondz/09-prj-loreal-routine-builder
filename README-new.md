# 🌟 L'Oréal Product-Aware Routine Builder

A sophisticated, AI-powered beauty routine builder that helps users discover, select, and create personalized skincare and beauty routines using L'Oréal's product ecosystem.

![L'Oréal Routine Builder](https://img.shields.io/badge/L'Oréal-Routine%20Builder-ff003b?style=for-the-badge&logo=loreal&logoColor=white)

## ✨ Features

### 🎯 Core Functionality

- **Product Discovery**: Browse 30+ beauty products across 9 categories
- **Smart Search**: Real-time filtering by category, name, brand, or ingredients
- **Visual Selection**: Click-to-select interface with elegant visual feedback
- **Product Details**: Comprehensive modal with product information and descriptions
- **Routine Generation**: AI-powered personalized routine creation using selected products
- **Interactive Chat**: Contextual AI assistant for product questions and advice

### 🚀 Enhanced Features

- **Multi-language Support**: English, Arabic, Hebrew, French, Spanish with RTL layout support
- **Local Storage**: Persistent product selections across browser sessions
- **Real-time Updates**: Optional web search integration for latest product information
- **Accessibility**: Full keyboard navigation, screen reader support, high contrast mode
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Performance**: Lazy loading, debounced search, optimized rendering

## 🏗️ Architecture

### Frontend Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and CSS Variables
- **Vanilla JavaScript**: ES6+ with modular architecture
- **Font Awesome**: Icons and visual elements
- **Google Fonts**: Montserrat typography

### Backend Integration

- **Cloudflare Worker**: Serverless API endpoint for secure OpenAI integration
- **OpenAI GPT-4**: Advanced AI for routine generation and chat functionality
- **JSON Database**: Local product catalog with comprehensive product data

### Key Components

```
├── index.html          # Main application structure
├── style.css           # L'Oréal brand-consistent styling
├── script.js           # Application logic and API integration
├── secrets.js          # Configuration and API settings
├── products.json       # Product database (30+ items)
└── img/               # Brand assets and product images
```

## 🎨 Design System

### Brand Colors

- **L'Oréal Red**: `#ff003b` - Primary brand color for CTAs and accents
- **L'Oréal Gold**: `#e3a535` - Secondary color for highlights and interactive elements
- **Dark Gray**: `#1a1a1a` - Primary text color
- **Light Gray**: `#f8f8f8` - Background and subtle elements

### Typography

- **Primary Font**: Montserrat (300, 500, 700 weights)
- **Hierarchy**: Clear visual hierarchy with consistent sizing
- **Accessibility**: Sufficient contrast ratios and readable sizes

### Visual Elements

- **Gradients**: Subtle brand gradients for premium feel
- **Shadows**: Layered shadow system for depth
- **Borders**: Rounded corners and elegant borders
- **Animations**: Smooth transitions and micro-interactions

## 🔧 Setup & Installation

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local HTTP server (Python, Node.js, or any static server)
- Internet connection for external dependencies

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-repo/loreal-routine-builder.git
   cd loreal-routine-builder
   ```

2. **Start a local server**

   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Configuration

Update `secrets.js` with your API configuration:

```javascript
const API_ENDPOINT = "https://your-cloudflare-worker.workers.dev/";
const SYSTEM_PROMPT = "Your custom AI assistant prompt...";
```

## 🔌 API Integration

### Cloudflare Worker Endpoint

The application communicates with a Cloudflare Worker that securely handles OpenAI API calls:

```javascript
// Request format
{
  "model": "gpt-4o",
  "messages": [...chatHistory],
  "temperature": 0.7,
  "max_tokens": 1000
}

// Response format
{
  "choices": [
    {
      "message": {
        "content": "AI-generated routine or response"
      }
    }
  ]
}
```

### Error Handling

- Graceful fallbacks for network issues
- User-friendly error messages
- Retry logic for failed requests
- Offline mode support

## 📱 Usage Guide

### Getting Started

1. **Browse Products**: Select a category to view available products
2. **Search**: Use the search bar to find specific products
3. **Select Products**: Click products to add them to your routine
4. **View Details**: Double-click for detailed product information
5. **Generate Routine**: Click "Generate Routine" for AI-powered recommendations
6. **Chat**: Ask follow-up questions about your routine

### Keyboard Shortcuts

- **Enter**: Select/deselect product
- **Shift + Enter**: View product details
- **Escape**: Close modal or dialogs
- **Tab**: Navigate through interface

### Language Support

- Use the language selector (top-right) to switch languages
- RTL languages automatically adjust layout direction
- All interface elements adapt to selected language

## 🧪 Testing

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Responsive Breakpoints

- 📱 Mobile: 320px - 768px
- 📱 Tablet: 768px - 1024px
- 💻 Desktop: 1024px+

### Accessibility Testing

- Screen reader compatibility (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- High contrast mode support
- Color blindness considerations

## 🚀 Deployment

### Static Hosting

Deploy to any static hosting service:

- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Repository-based hosting
- **AWS S3**: Scalable cloud hosting

### CDN Configuration

For optimal performance:

```javascript
// Enable caching headers
Cache-Control: public, max-age=31536000

// Compress assets
Content-Encoding: gzip
```

## 🔒 Security Considerations

### API Security

- API keys stored securely in Cloudflare Worker
- No sensitive data exposed in frontend code
- CORS properly configured
- Rate limiting implemented

### Data Privacy

- No personal data collection
- Local storage for user preferences only
- No third-party tracking
- GDPR compliant

## 📊 Performance Metrics

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Techniques

- Lazy loading for images
- Debounced search input
- Efficient DOM manipulation
- Minimal external dependencies

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards

- ES6+ JavaScript
- Semantic HTML
- BEM CSS methodology
- JSDoc comments
- Accessibility guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **L'Oréal**: Brand guidelines and design inspiration
- **OpenAI**: GPT-4 API for intelligent chat functionality
- **Cloudflare**: Serverless infrastructure
- **Google Fonts**: Montserrat typography
- **Font Awesome**: Icon library

## 📞 Support

For questions, issues, or contributions:

- 📧 Email: support@loreal-routine-builder.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

---

**Built with ❤️ for the L'Oréal community**
