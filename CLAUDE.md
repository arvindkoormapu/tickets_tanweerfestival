# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm start

# Build production bundle
npm run build

# Run tests
npm test

# Eject from Create React App (use with caution)
npm run eject
```

## Architecture Overview

This is a React-based event ticket booking application for Tanweer Festival, built with Create React App. The application follows a component-based architecture with the following key structural patterns:

### API Communication
- All API calls are centralized through `src/AxiosConfig.js` which provides a custom axios instance with interceptors for:
  - Automatic Bearer token authentication from localStorage
  - Global error handling with automatic logout on 403 responses
  - Toast notifications for success/error responses
- Base API URL is configured via `REACT_APP_BASE_URL` environment variable

### Routing Structure
- React Router v6 is used for client-side routing
- All routes are defined in `src/App.js` in a centralized routes array
- Main application pages are in `src/pages/` directory
- Key routes include events, authentication, profile, ticket viewing, and payment flows

### Component Organization
- `src/components/` contains reusable UI components
- `src/components/Events/` contains complex event-related components including:
  - `Pay.js` - Payment processing with Apple Pay integration via MPGS
  - `Tickets.js` - Ticket selection and management
  - `Addons.js` - Additional purchase options
  - `Summary.js` - Order summary display

### State Management
- Local component state via React hooks
- Authentication state stored in localStorage with UUID token
- Google OAuth integration for social login

### Styling
- Tailwind CSS for utility-first styling
- Custom color palette defined in `tailwind.config.js` with brand-specific colors
- Maximum width container of 550px for mobile-first design

### Payment Integration
- IPG (Internet Payment Gateway) integration
- Apple Pay support through MPGS
- Configuration through environment variables:
  - `REACT_APP_IPG_URL`
  - `REACT_APP_IPG_APPLE_PAY_KEY`
  - `REACT_APP_SHARED_SECRET`

### Analytics & Monitoring
- Microsoft Clarity for user behavior analytics
- Google Tag Manager integration via custom `useGtm` hook
- Bugsnag for error tracking