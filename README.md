# APT Planner

AI Planned Trips - Intelligent trip planner for India with multi-modal route optimization.

## 🚀 Features

- **Smart Route Planning**: Intelligent algorithm finds optimal routes across multiple transport modes
- **Indian Cities**: Pre-loaded with major Indian cities (Delhi, Mumbai, Bengaluru, etc.)
- **Multi-Modal**: Supports trains, buses, flights, and shared transportation
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Real-Time Alerts**: Service disruptions and maintenance notifications
- **Trip History**: Track your planned journeys with metrics
- **Google OAuth**: Optional user authentication

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for blazing fast builds
- TailwindCSS for styling
- Shadcn UI components
- React Query for data management

### Backend
- Node.js with Express
- SQLite database (better-sqlite3)
- Passport.js for authentication
- Google OAuth 2.0 support

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Setup

1. **Clone and Install**
```bash
git clone <your-repo>
cd impactful-web-app-main
npm install
cd server && npm install && cd ..
```

2. **Environment Variables** (Optional for Google Auth)

Create `.env` in root directory:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
SESSION_SECRET=your_random_secret
```

> **Note**: Without Google credentials, the app uses Dev Auth Bypass for testing.

3. **Start Development Servers**

```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
npm run dev
```

4. **Access the App**
- Frontend: `http://localhost:5173` or `http://localhost:8080`
- Backend: `http://localhost:3000`

## 🗂️ Project Structure

```
apt/
├── server/                 # Backend Node.js application
│   ├── db.js              # Database setup and seeding
│   ├── index.js           # Express server
│   └── routes/            # API and auth routes
├── src/                    # Frontend React application
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Auth, Theme)
│   ├── pages/             # Page components
│   ├── api/               # API client
│   └── types/             # TypeScript types
└── public/                 # Static assets
```

## 🎨 Key Features Explained

### Dark Mode
Click the moon/sun icon in the header to toggle themes. Preference is saved to localStorage.

### Trip Planning
1. Select origin and destination from Indian cities
2. Choose travel date and occasion (commute, leisure, business, tourism)
3. View optimized routes with cost, duration, and carbon estimates
4. Save trip plans to history

### Dashboard Metrics
- Total trips planned
- Carbon saved (kg CO₂)
- Average trip cost
- Real-time statistics

## 🚀 Deployment

See [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) for detailed deployment instructions.

**Quick Deploy Options**:
- **Vercel** (Frontend) + **Railway** (Backend) - Recommended
- **Render** (Full Stack)
- **Self-hosted** (VPS)

## 📱 Cross-Device Access

Want to test on your mobile phone or another computer?
Check out the [Setup Guide](./SETUP_GUIDE.md) for detailed instructions on how to connect devices on your local network.

## 📝 Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
cd server
npm start            # Start backend server
npm run dev          # Start with nodemon (auto-reload)
```

## 🔐 Authentication

The app supports two authentication modes:

1. **Dev Auth Bypass** (Default): Automatic login for development
2. **Google OAuth**: Real authentication with Google credentials

To switch to Google OAuth, add valid credentials to `.env`.

## 🗄️ Database

Uses SQLite for simplicity. Pre-seeded with:
- 25 Indian cities (6 mega cities, 19 cities)
- 14 realistic routes between major cities
- 2 service alerts
- 12 sample trip plans (for metrics)

To reset database: Delete `server/database.sqlite` and restart backend.

## 🎯 Upcoming Features

- [ ] Real-time train/bus schedules API integration
- [ ] Booking integration
- [ ] Multi-language support
- [ ] PWA support for offline access
- [ ] Route sharing via links

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (backend)
npx kill-port 3000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### Database Issues
Delete `server/database.sqlite` to reset and re-seed.

### CORS Errors
Ensure backend CORS settings include your frontend URL in `server/index.js`.

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💬 Support

For issues or questions:
- Check existing GitHub issues
- Create a new issue with details
- Review the deployment guide for production issues

## 🙏 Acknowledgments

- Built with ❤️ for improving public transportation in India
- UI components from [Shadcn UI](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with 🚆 by APT Team**
