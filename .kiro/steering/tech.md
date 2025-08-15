# Technology Stack

## Framework & Runtime
- **NestJS** - Progressive Node.js framework for building scalable server-side applications
- **Node.js** - JavaScript runtime environment
- **TypeScript** - Primary programming language with strict typing

## Database & ORM
- **MongoDB** - NoSQL database for data persistence
- **Prisma** - Database ORM and query builder
- **@prisma/client** - Prisma client for database operations

## Authentication & Security
- **JWT** (@nestjs/jwt) - JSON Web Token authentication
- **Passport** - Authentication middleware with JWT strategy
- **bcrypt** - Password hashing and encryption

## API Documentation & Validation
- **Swagger/OpenAPI** (@nestjs/swagger) - API documentation and testing interface
- **class-validator** - DTO validation decorators
- **class-transformer** - Object transformation and serialization

## Development Tools
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting (single quotes, trailing commas)
- **Jest** - Testing framework for unit and e2e tests

## Common Commands

### Development
```bash
npm run start:dev    # Start in watch mode
npm run start:debug  # Start with debugging
npm run build        # Build for production
npm run start:prod   # Run production build
```

### Code Quality
```bash
npm run lint         # Run ESLint with auto-fix
npm run format       # Format code with Prettier
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run end-to-end tests
npm run test:cov     # Run tests with coverage
```

### Database
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open Prisma Studio GUI
```

## Configuration
- Environment variables managed through `.env` file
- Global configuration via `@nestjs/config`
- CORS configured for specific origins
- Global validation pipes enabled
- Swagger documentation available at `/api` endpoint