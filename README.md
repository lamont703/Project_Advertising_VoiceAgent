# 🎙️ VoiceAgent - AI-Powered Voice Lead Capture System

VoiceAgent is an intelligent voice conversation system designed specifically for social media advertisers to capture and qualify leads through natural voice interactions. Instead of traditional forms, prospects engage in conversational AI experiences that feel personal and increase conversion rates.

## 🎯 Perfect For

- **Social Media Advertisers** running Facebook, Google, LinkedIn campaigns
- **Marketing Agencies** managing multiple client campaigns
- **SaaS Companies** looking to qualify demo requests
- **Service Businesses** wanting to capture consultation requests
- **E-commerce Brands** qualifying high-value prospects

## ✨ Key Features

### 🎙️ Voice-First Interface

- **Tap-to-speak** activation with visual feedback
- **Real-time conversation** with AI agent
- **Progress tracking** throughout the interaction
- **Mobile-optimized** for social media traffic

### 🤖 Intelligent AI Agent

- **Customizable personality** (Professional, Friendly, Expert)
- **Natural conversation flow** that adapts to responses
- **Smart qualification** with business-specific questions
- **Multi-language support** for global campaigns

### 📊 Complete Admin Dashboard

- **Real-time analytics** and performance metrics
- **Lead management** with filtering and search
- **Agent configuration** with live preview
- **Workflow management** for automation

### 🔗 Seamless Integrations

- **GoHighLevel CRM** with automatic contact creation
- **n8n Workflows** for complex automation
- **Webhook support** for custom integrations
- **CSV export** for external analysis

## 🚀 GoHighLevel Deployment Guide

### 🏗️ **Architecture Overview**

This Voice Agent system is designed to be **hosted within GoHighLevel** and integrate seamlessly with **n8n workflows**:

- **🏠 Frontend Pages**: Hosted as GoHighLevel custom pages/funnels
- **🎙️ Voice Interface**: Embedded in GoHighLevel landing pages
- **📊 Lead Capture**: Direct integration with GoHighLevel CRM
- **⚡ Automation**: n8n workflows triggered via GoHighLevel webhooks

### 1. GoHighLevel Setup

**Create Custom Pages** in your GoHighLevel account:

- **Landing Page**: Use `index.html` content as GoHighLevel funnel page
- **Voice Interface**: Use `voice-interface.html` content as conversation page
- **Assets**: Upload CSS/JS files to GoHighLevel media library

### 2. Configure GoHighLevel Integration

**Set up Custom Fields** in GoHighLevel CRM:

```javascript
// Required custom fields for voice agent data
-current_advertising_platforms(text) -
  monthly_ad_spend(text) -
  main_conversion_challenge(text) -
  implementation_interest(text) -
  wants_consultation(boolean) -
  qualification_score(number) -
  lead_temperature(text); // hot/warm/cold
```

### 3. n8n Workflow Integration

1. **Create n8n Workflow** with GoHighLevel webhook trigger
2. **Configure Webhook URL** in GoHighLevel automation
3. **Set up API connections** for data flow between systems

### 4. Deploy Process

```bash
# No traditional web hosting needed!
# Everything runs within GoHighLevel:

1. Create GoHighLevel funnel pages
2. Embed voice interface code
3. Configure GoHighLevel automation
4. Connect n8n webhook triggers
5. Test complete lead capture flow
```

## 📁 Project Structure

```
VoiceAgent/
├── index.html              # Landing page with voice activation
├── voice-interface.html    # Main conversation interface
├── admin.html              # Admin dashboard
├── assets/
│   ├── css/
│   │   ├── main.css        # Main application styles
│   │   └── admin.css       # Admin panel styles
│   └── js/
│       ├── main.js         # Landing page functionality
│       ├── voice-interface.js  # Voice conversation logic
│       └── admin.js        # Admin panel features
├── docs/
│   ├── index.html          # Complete documentation
│   ├── wireframes.html     # Visual design docs
│   └── api-reference.html  # API documentation
└── README.md               # This file
```

## 🎨 Customization Guide

### Brand Colors

Update the CSS variables in `assets/css/main.css`:

```css
:root {
  --primary-color: #3498db; /* Your brand primary */
  --secondary-color: #2c3e50; /* Secondary/text color */
  --accent-color: #e74c3c; /* Accent/highlight */
  --background-color: #f8f9fa; /* Background */
}
```

### Agent Personality

Configure through the admin panel:

1. Open `admin.html`
2. Go to Agent Configuration
3. Set personality, voice style, and questions
4. Test with the preview feature

### Qualification Questions

Customize the conversation flow:

```javascript
// In voice-interface.js, modify the questions array
const qualificationQuestions = [
  "What's your name?",
  "What's your email address?",
  "What type of business do you run?",
  "What's your biggest challenge right now?",
  // Add your custom questions here
];
```

## 🔧 Technical Requirements

### Browser Support

- **Chrome/Chromium**: Full support (recommended)
- **Safari**: Full support on iOS 14.5+ and macOS
- **Edge**: Full support on Windows
- **Firefox**: Limited Speech API support, fallback available

### Server Requirements

- **HTTPS hosting** (required for microphone access)
- **Modern web server** (Apache, Nginx, or similar)
- **n8n instance** for workflow automation (optional)
- **CRM API access** for lead integration

### GoHighLevel Hosting Architecture

- **GoHighLevel Pages** - Native funnel/page builder hosting
- **GoHighLevel Media Library** - For CSS, JS, and image assets
- **GoHighLevel Workflows** - Built-in automation engine
- **n8n Integration** - External workflow processing via webhooks

## 📊 Analytics & Tracking

### Built-in Metrics

- **Conversion rates** by source and campaign
- **Conversation duration** and completion rates
- **Lead quality scores** based on responses
- **Traffic source attribution** from URL parameters

### Custom Tracking

Add UTM parameters to your ad URLs:

```
https://yourdomain.com/?utm_source=facebook&utm_campaign=lead_gen_q1
```

### Export Options

- **CSV export** of all lead data
- **Webhook integration** for real-time data
- **API access** for custom reporting
- **Dashboard widgets** for quick insights

## 🔗 Integration Examples

### GoHighLevel CRM

```javascript
// Configure in admin panel or via webhook
{
  "contact": {
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "tags": ["voice-lead", "qualified"],
    "source": "facebook-ad"
  }
}
```

### n8n Workflow Trigger

```javascript
// Webhook payload sent to n8n
{
  "event": "lead_captured",
  "lead_data": {
    "name": "John Smith",
    "email": "john@example.com",
    "responses": {
      "business_type": "E-commerce",
      "monthly_revenue": "$10k-50k"
    }
  }
}
```

## 🎯 Campaign Optimization

### A/B Testing

- **Agent personalities** (Professional vs. Friendly)
- **Question sequences** (short vs. detailed)
- **Visual designs** (colors, layouts)
- **Call-to-actions** (button text, placement)

### Conversion Optimization

- **Mobile-first design** for social traffic
- **Clear value proposition** on landing page
- **Progress indicators** to encourage completion
- **Minimal friction** with voice-only input

### Lead Quality Improvement

- **Qualification scoring** based on responses
- **Custom questions** for your specific business
- **Lead tagging** for better CRM organization
- **Follow-up automation** via n8n workflows

## 🛠️ Troubleshooting

### Common Issues

**Microphone Not Working**

- Ensure HTTPS hosting
- Check browser permissions
- Verify microphone hardware
- Try different browser

**Speech Recognition Fails**

- Check internet connection
- Ensure browser compatibility
- Clear browser cache
- Test with different devices

**CRM Integration Issues**

- Verify API keys in admin panel
- Check webhook URL configuration
- Review integration logs
- Test with sample data

**Mobile Performance Issues**

- Optimize images and assets
- Enable gzip compression
- Test on actual devices
- Check responsive design

### Getting Help

- 📖 [Complete Documentation](docs/index.html)
- 🎨 [Visual Wireframes](docs/wireframes.html)
- 🔧 [API Reference](docs/api-reference.html)
- 💬 [Support Forum](https://community.voiceagent.com)

## 🚀 Deployment Checklist

- [ ] **HTTPS hosting** configured
- [ ] **Custom domain** pointed to files
- [ ] **Brand colors** and logo updated
- [ ] **Agent personality** configured
- [ ] **Qualification questions** customized
- [ ] **CRM integration** tested
- [ ] **Webhook endpoints** verified
- [ ] **Mobile responsiveness** tested
- [ ] **Analytics tracking** confirmed
- [ ] **Ad campaign URLs** with UTM parameters

## 📈 Performance Optimization

### Speed Optimization

```bash
# Enable gzip compression (nginx example)
gzip on;
gzip_types text/css application/javascript text/html;

# Set cache headers for static assets
location ~* \.(css|js|png|jpg|jpeg|gif|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### SEO Considerations

- **Meta tags** optimized for each page
- **Schema markup** for better search visibility
- **Page speed** optimization for mobile
- **Social media tags** for better sharing

## 🔒 Security & Privacy

### Data Protection

- **HTTPS encryption** for all communications
- **No data storage** on client side
- **Secure API endpoints** with authentication
- **GDPR compliance** options available

### User Privacy

- **Microphone access** only when activated
- **Clear privacy policy** on data usage
- **Opt-out options** for data collection
- **Secure data transmission** to CRM systems

## 📋 License & Support

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Support

- **Documentation**: Complete guides and API reference included
- **Community**: Join our Discord for peer support
- **Professional**: Enterprise support available
- **Updates**: Regular feature updates and improvements

---

## 🎉 Get Started Today!

1. **Download** the VoiceAgent files
2. **Customize** your brand and messaging
3. **Deploy** to your HTTPS hosting
4. **Connect** your CRM and automation tools
5. **Launch** your voice-powered ad campaigns

Transform your social media advertising with the power of voice conversation. Higher conversion rates, better lead quality, and happier prospects await!

---

_Made with ❤️ for modern marketers who want to convert more leads through natural conversation._
