# Full-Stack Authentication Application

A production-ready authentication system built with Next.js, NestJS, and NATS microservices architecture.

## 🎯 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Start everything with one command
docker-compose up -d
```

That's it! The entire application stack will be up and running:
- 🎨 Frontend: http://localhost:3001
- 🔧 Backend API: http://localhost:3000
- 📚 API Documentation: http://localhost:3000/api/docs
- 📊 NATS Monitoring: http://localhost:8222

## 📸 Screenshots

### Signup Page (Dark Mode)
![Signup Dark Mode](./screenshots/signup-dark.png)

### Login Page (Light Mode)
![Login Light Mode](./screenshots/login-light.png)

## 🏗️ Architecture

**Monorepo Structure:**
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Backend**: NestJS 11 + MongoDB + JWT Authentication
- **Microservices**: NATS message broker for service communication
- **Cache**: Redis for session management
- **Database**: MongoDB for data persistence

**All services are containerized and orchestrated with Docker Compose.**

## ✨ Key Features

- 🔐 Complete JWT-based authentication (register, login, protected routes)
- 🎨 Modern UI with dark/light mode support
- 🚀 Microservices architecture with NATS
- ⚡ Redis caching for optimal performance
- 📱 Responsive design with Tailwind CSS v4
- 🧪 Comprehensive test coverage
- 📖 Auto-generated API documentation (Swagger/OpenAPI)
- 🔒 Production-ready security (HTTP-only cookies, bcrypt hashing, CORS)

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development only)
- pnpm (for local development only)

## 🧪 Testing

### Run Tests Locally

**Backend Tests:**
```bash
cd apps/server
pnpm install
pnpm test              # Unit tests
pnpm test:watch        # Watch mode
pnpm test:cov          # Coverage report
```

**Frontend Tests:**
```bash
cd apps/client
pnpm install
pnpm test              # All tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
```

## 📚 Documentation

- **API Documentation**: http://localhost:3000/api/docs (Interactive Swagger UI)
- **Available Endpoints**:
  - `POST /auth/register` - Register new user
  - `POST /auth/login` - Login user
  - `GET /user/me` - Get current user (authenticated)

## 🛠️ Local Development (Without Docker)

If you prefer to run services locally:

**1. Start Infrastructure:**
```bash
docker-compose up mongodb redis nats -d
```

**2. Configure Environment:**

`apps/server/.env`:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI_DEV=mongodb://localhost:27017/app-db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
SALT_ROUNDS=10
NATS_URLS=nats://localhost:4222
```

`apps/client/.env.local`:
```env
NODE_ENV=development
PORT=3001
AUTH_COOKIE_NAME=auth_token
NATS_URLS=nats://localhost:4222
REDIS_URL=redis://localhost:6379
```

**3. Run Applications:**
```bash
# Terminal 1 - Backend
cd apps/server && pnpm install && pnpm start:dev

# Terminal 2 - Frontend
cd apps/client && pnpm install && pnpm dev
```

## 📁 Project Structure

```
.
├── apps/
│   ├── client/              # Next.js frontend
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components (atomic design)
│   │   ├── lib/            # Utils, types, state management
│   │   └── __tests__/      # Test files
│   │
│   └── server/              # NestJS backend
│       ├── src/
│       │   ├── auth/       # Authentication module
│       │   ├── user/       # User management
│       │   └── utils/      # Helpers
│       └── test/           # E2E tests
│
├── docker-compose.yml       # Production setup
└── docker-compose.dev.yml   # Development setup
```

## 🔐 Authentication Flow

1. User registers/logs in → Server validates credentials
2. JWT token generated and stored in HTTP-only cookie
3. Token cached in Redis with user data
4. Subsequent requests include token for authentication
5. Middleware validates token and retrieves user data

## 🌐 Microservices Communication

NATS message patterns:
- `auth.register` - User registration
- `auth.login` - User authentication  
- `user.getOwnData` - Fetch user profile

## 🔒 Security Features

- ✅ JWT tokens with configurable expiration
- ✅ bcrypt password hashing
- ✅ HTTP-only cookies (XSS protection)
- ✅ CORS configuration
- ✅ Environment-based secrets
- ✅ Input validation (client + server)
- ✅ Protected API routes with guards

## 🧹 Cleanup

```bash
# Stop all services
docker-compose down

# Remove all data (fresh start)
docker-compose down -v
```

## 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | NestJS 11, MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Microservices | NATS 2.10 |
| Cache | Redis 7 |
| Database | MongoDB 7 |
| Testing | Jest, React Testing Library, Supertest |
| UI Components | shadcn/ui, Radix UI, Lucide Icons |
| State Management | Zustand, React Hook Form |
| Validation | Yup, class-validator |

---

**Ready to build? Just run `docker-compose up` and start developing! 🚀**
