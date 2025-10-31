# Full-Stack Authentication Application

A production-ready full-stack application featuring user authentication, real-time messaging, and microservices architecture.

## 🏗️ Architecture

This monorepo contains:

- **Frontend (Client)**: Next.js 16 with React 19, TypeScript, Tailwind CSS
- **Backend (Server)**: NestJS with TypeScript, MongoDB, JWT authentication
- **Message Broker**: NATS for microservices communication
- **Cache Layer**: Redis for session management
- **Database**: MongoDB for data persistence

## 🚀 Tech Stack

### Frontend (apps/client)
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: Zustand
- **Form Handling**: React Hook Form with Yup validation
- **HTTP Client**: Native fetch API
- **Testing**: Jest, React Testing Library

### Backend (apps/server)
- **Framework**: NestJS 11
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **Message Queue**: NATS microservices
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest
- **Validation**: class-validator, class-transformer

### Infrastructure
- **Message Broker**: NATS 2.10
- **Cache**: Redis 7
- **Database**: MongoDB 7
- **Container**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 20+
- Docker and Docker Compose
- pnpm (will be installed automatically if not present)

## 🐳 Docker Setup

### First Time Setup

Before running Docker, you need to generate the lock files:

**On Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Or manually:**
```bash
# Install pnpm globally if not installed
npm install -g pnpm

# Generate lock files
cd apps/server && pnpm install && cd ../..
cd apps/client && pnpm install && cd ../..
```

### Production Mode

1. **Clone the repository**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Build and run all services**
```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Redis on port 6379
- NATS on ports 4222 (client) and 8222 (monitoring)
- Backend server on port 3000
- Frontend client on port 3001

3. **Access the applications**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs
- NATS Monitoring: http://localhost:8222

4. **Stop services**
```bash
docker-compose down
```

5. **Remove volumes (clean slate)**
```bash
docker-compose down -v
```

### Development Mode

For hot-reloading during development:

```bash
docker-compose -f docker-compose.dev.yml up
```

## 💻 Local Development (without Docker)

### Prerequisites Setup

1. **Install dependencies**
```bash
# Install root dependencies (if any)
npm install

# Install client dependencies
cd apps/client
npm install

# Install server dependencies
cd ../server
npm install
```

2. **Set up environment variables**

Create `.env` file in `apps/server`:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI_DEV=mongodb://localhost:27017/app-db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
SALT_ROUNDS=10
NATS_URLS=nats://localhost:4222
```

Create `.env.local` file in `apps/client`:
```env
NODE_ENV=development
PORT=3001
AUTH_COOKIE_NAME=auth_token
NATS_URLS=nats://localhost:4222
REDIS_URL=redis://localhost:6379
```

3. **Start infrastructure services**
```bash
# Using Docker for infrastructure only
docker-compose up mongodb redis nats -d
```

4. **Run the applications**

Terminal 1 - Backend:
```bash
cd apps/server
npm run start:dev
```

Terminal 2 - Frontend:
```bash
cd apps/client
npm run dev
```

## 🧪 Testing

### Client Tests
```bash
cd apps/client

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Server Tests
```bash
cd apps/server

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 📁 Project Structure

```
.
├── apps/
│   ├── client/                 # Next.js frontend application
│   │   ├── __tests__/         # Test files
│   │   ├── app/               # Next.js app directory
│   │   ├── components/        # React components
│   │   │   ├── atoms/         # Basic UI components
│   │   │   ├── molecules/     # Composite components
│   │   │   └── organs/        # Complex components
│   │   ├── lib/               # Utilities and helpers
│   │   │   ├── actions/       # Server actions
│   │   │   ├── schema/        # Validation schemas
│   │   │   ├── store/         # State management
│   │   │   ├── types/         # TypeScript types
│   │   │   └── utils/         # Helper functions
│   │   ├── public/            # Static assets
│   │   ├── Dockerfile         # Production Dockerfile
│   │   ├── Dockerfile.dev     # Development Dockerfile
│   │   └── package.json
│   │
│   └── server/                # NestJS backend application
│       ├── src/
│       │   ├── auth/          # Authentication module
│       │   ├── user/          # User management module
│       │   └── utils/         # Utility functions
│       ├── test/              # E2E tests
│       ├── Dockerfile         # Production Dockerfile
│       ├── Dockerfile.dev     # Development Dockerfile
│       └── package.json
│
├── docker-compose.yml         # Production Docker Compose
├── docker-compose.dev.yml     # Development Docker Compose
└── README.md                  # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### User
- `GET /user/me` - Get current user (requires authentication)

Full API documentation available at: http://localhost:3000/api/docs

## 🔐 Authentication Flow

1. User registers or logs in
2. Server validates credentials and generates JWT token
3. Token stored in HTTP-only cookie (client-side)
4. Token cached in Redis with user data
5. Subsequent requests include token for authentication
6. Server validates token and retrieves user from cache/database

## 🌐 Microservices Communication

The application uses NATS for inter-service communication:

- **Message Patterns**:
  - `auth.register` - User registration
  - `auth.login` - User login
  - `user.getOwnData` - Fetch authenticated user data

- **HTTP to NATS Bridge**: The Next.js middleware can call NestJS services via NATS

## 🎨 UI Components

The client uses a custom component library built on:
- Radix UI primitives
- Tailwind CSS for styling
- Lucide React for icons
- shadcn/ui design patterns

Component structure follows atomic design:
- **Atoms**: Basic components (Button, Input, Label)
- **Molecules**: Composite components (Combobox, Nav)
- **Organisms**: Complex components (LoginForm, SignupForm)

## 📊 State Management

- **Global State**: Zustand for app-wide state (loading states)
- **Form State**: React Hook Form for form management
- **Server State**: React Query patterns for data fetching

## 🔧 Development Tools

### Code Quality
- ESLint for linting
- Prettier for code formatting
- TypeScript for type safety

### Testing
- Jest for unit testing
- React Testing Library for component testing
- Supertest for API testing

### API Documentation
- Swagger/OpenAPI automatic documentation
- Interactive API explorer

## 🚢 Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale server=3
```

### Manual Deployment

1. **Build applications**
```bash
# Build server
cd apps/server
npm run build

# Build client
cd apps/client
npm run build
```

2. **Set production environment variables**

3. **Start services**
```bash
# Start server
cd apps/server
npm run start:prod

# Start client
cd apps/client
npm start
```

## 🔒 Security Considerations

- JWT tokens with configurable expiration
- Password hashing with bcrypt
- HTTP-only cookies for token storage
- CORS configuration
- Environment-based secrets
- Input validation on both client and server
- Protected routes with authentication guards

## 🐛 Troubleshooting

### Docker Issues

**Services not starting:**
```bash
# Check service logs
docker-compose logs <service-name>

# Rebuild services
docker-compose up -d --build --force-recreate
```

**Port conflicts:**
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :3001
lsof -i :27017

# Modify ports in docker-compose.yml if needed
```

### Database Connection Issues

```bash
# Check MongoDB is running
docker-compose ps mongodb

# Access MongoDB shell
docker exec -it app-mongodb mongosh -u admin -p password123
```

### NATS Connection Issues

```bash
# Check NATS health
curl http://localhost:8222/healthz

# View NATS connections
curl http://localhost:8222/connz
```

## 📝 Environment Variables

### Server (.env)
```env
NODE_ENV=production|development
PORT=3000
MONGODB_URI_DEV=mongodb://admin:password123@mongodb:27017/app-db?authSource=admin
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
SALT_ROUNDS=10
NATS_URLS=nats://nats:4222
```

### Client (.env.local)
```env
NODE_ENV=production|development
PORT=3001
AUTH_COOKIE_NAME=auth_token
NATS_URLS=nats://nats:4222
REDIS_URL=redis://redis:6379
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review API documentation at `/api/docs`

## 🎯 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] OAuth integration (Google, GitHub)
- [ ] Role-based access control (RBAC)
- [ ] Rate limiting
- [ ] WebSocket support for real-time features
- [ ] CI/CD pipeline
- [ ] Kubernetes deployment configs
- [ ] Monitoring and logging (Prometheus, Grafana)
- [ ] Performance optimization

---

**Happy Coding! 🚀**