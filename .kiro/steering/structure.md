# Project Structure

## Root Directory
```
├── src/                    # Source code
├── prisma/                 # Database schema and migrations
├── test/                   # End-to-end tests
├── dist/                   # Compiled output
├── backup/                 # Data backups and exports
└── node_modules/           # Dependencies
```

## Source Code Organization (`src/`)
```
src/
├── api/                    # Feature modules (domain-driven)
│   ├── auth/              # Authentication & authorization
│   ├── users/             # User management
│   ├── lugares-turisticos/ # Tourist locations
│   ├── locales/           # Local businesses
│   ├── eventos/           # Events management
│   ├── rutas-turisticas/  # Tourist routes
│   ├── attraction/        # Attractions
│   ├── image-item/        # Image management
│   ├── suscribe/          # Event subscriptions
│   ├── suscripcion-local/ # Local business subscriptions
│   ├── tipo-local/        # Business type categories
│   └── logs/              # System logging
├── filters/               # Global exception filters
├── prisma/                # Prisma service
├── app.module.ts          # Root application module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
└── main.ts                # Application bootstrap
```

## Module Structure Pattern
Each API module follows NestJS conventions:
```
module-name/
├── dto/                   # Data Transfer Objects
├── entities/              # TypeScript interfaces/types
├── module-name.controller.ts
├── module-name.service.ts
├── module-name.module.ts
└── module-name.controller.spec.ts
```

## Database Schema (`prisma/`)
- **schema.prisma** - Prisma schema definition with MongoDB models
- Models include: LugaresTuristicos, Local, Evento, User, RutasTuristicas, etc.
- Relationships managed through ObjectId references

## Configuration Files
- **.env** - Environment variables
- **package.json** - Dependencies and scripts
- **tsconfig.json** - TypeScript configuration
- **nest-cli.json** - NestJS CLI configuration
- **.eslintrc.js** - ESLint rules
- **.prettierrc** - Code formatting rules

## Key Architectural Patterns
- **Modular architecture** - Feature-based modules
- **Dependency injection** - NestJS IoC container
- **DTO validation** - class-validator decorators
- **Global filters** - Exception handling
- **Swagger documentation** - Auto-generated API docs
- **Prisma ORM** - Type-safe database operations