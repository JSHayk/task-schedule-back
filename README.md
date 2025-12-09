# Backend - Task Scheduling API

NestJS REST API with TypeORM, MySQL, and JWT authentication.

## Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **Database**: MySQL 8.x
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Password Hashing**: bcrypt
- **Events**: @nestjs/event-emitter

## Prerequisites

- Node.js 18+
- MySQL 8+ (or Docker)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Environment variables:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=task_scheduler
JWT_SECRET=your-secret-key
PORT=3000
```

### 3. Start Database

Using Docker:
```bash
docker-compose up -d
```

Or use your local MySQL installation.

### 4. Seed Database

```bash
npm run seed
```

This creates:
- 4 users (admin, john, jane, bob)
- 4 task statuses (TODO, IN_PROGRESS, DONE, CANCELLED)
- 3 sample tasks

### 5. Start Server

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

Server runs on `http://localhost:3000`

## Project Structure

```
src/
├── controllers/       # REST endpoints
│   ├── auth.controller.ts
│   ├── task.controller.ts
│   └── user.controller.ts
├── services/          # Business logic
│   ├── auth.service.ts
│   ├── task.service.ts
│   └── user.service.ts
├── entities/          # Database models
│   ├── user.entity.ts
│   ├── task.entity.ts
│   └── task-status.entity.ts
├── dto/               # Data transfer objects
│   ├── login.dto.ts
│   ├── create-task.dto.ts
│   ├── update-task.dto.ts
│   └── reassign-task.dto.ts
├── events/            # Event definitions
│   └── task.events.ts
├── listeners/         # Event handlers
│   └── task.listener.ts
├── guards/            # Auth guards
│   └── jwt-auth.guard.ts
├── strategies/        # Auth strategies
│   └── jwt.strategy.ts
├── utils/             # Utility functions
│   ├── constants.ts
│   ├── date.utils.ts
│   └── user.utils.ts
├── app.module.ts      # Main module
├── main.ts            # Entry point
└── seed.ts            # Database seeding
```

## API Endpoints

### Authentication

**POST** `/auth/login`
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:
```json
{
  "access_token": "jwt-token",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

### Tasks

All task endpoints require JWT authentication.

**GET** `/tasks` - List all tasks
- Query params: `search`, `statusId`, `userId`

**GET** `/tasks/:id` - Get single task

**POST** `/tasks` - Create task
```json
{
  "title": "Task title",
  "description": "Task description",
  "startDate": "2024-12-10",
  "endDate": "2024-12-11",
  "statusId": 1,
  "userId": 2
}
```

**PATCH** `/tasks/:id` - Update task
```json
{
  "title": "Updated title",
  "statusId": 2
}
```

**PATCH** `/tasks/:id/reassign` - Reassign task
```json
{
  "userId": 3
}
```

**DELETE** `/tasks/:id` - Delete task

### Users

**GET** `/users` - List all users

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique, indexed
- `password` - Hashed with bcrypt
- `name` - User's full name
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Tasks Table
- `id` - Primary key
- `title` - Indexed for search
- `description` - Text field
- `startDate` - Date
- `endDate` - Date
- `statusId` - Foreign key to task_statuses
- `userId` - Foreign key to users
- `createdAt` - Timestamp
- `updatedAt` - Timestamp
- Composite index on `(userId, startDate, endDate)` for overlap detection

### Task Statuses Table
- `id` - Primary key
- `name` - Unique (TODO, IN_PROGRESS, DONE, CANCELLED)

## Features

### Overlap Detection
Prevents users from having overlapping tasks:
```typescript
// Checks if date ranges intersect
task.startDate <= endDate && task.endDate >= startDate
```

### Event-Driven Architecture
Async notifications using event emitters:
- `task.created` - Fired when task is created
- `task.updated` - Fired when task is updated
- `task.reassigned` - Fired when task is reassigned

### Security
- JWT token authentication
- Password hashing with bcrypt (10 rounds)
- Protected routes with guards
- Input validation with class-validator
- Password excluded from all responses

## Utility Functions

### Date Utils (`utils/date.utils.ts`)
```typescript
addDays(date, days)        // Add days to date
parseDate(dateString)      // Parse date string
validateDateRange(s, e)    // Validate date range
```

### User Utils (`utils/user.utils.ts`)
```typescript
sanitizeUser(user)         // Remove password from user object
```

### Constants (`utils/constants.ts`)
```typescript
ERROR_MESSAGES             // Centralized error messages
TASK_RELATIONS            // Reusable relations array
```

## Scripts

```bash
npm run start:dev          # Start in development mode
npm run start:prod         # Start in production mode
npm run build              # Build for production
npm run seed               # Seed database
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## Testing

Run the seed script to populate test data:
```bash
npm run seed
```

Test credentials:
- **Admin**: admin@example.com / admin123
- **Users**: john@example.com / password123

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | localhost |
| `DB_PORT` | MySQL port | 3306 |
| `DB_USERNAME` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | password |
| `DB_DATABASE` | Database name | task_scheduler |
| `JWT_SECRET` | JWT secret key | (change in production) |
| `PORT` | Server port | 3000 |

## Production Deployment

1. Set environment variables
2. Build the application:
   ```bash
   npm run build
   ```
3. Start with PM2:
   ```bash
   pm2 start dist/main.js --name task-api
   ```
4. Configure reverse proxy (Nginx)
5. Set up SSL certificate

## Troubleshooting

### Database Connection Failed
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process using port 3000

### Seeding Fails
- Ensure database is empty or use `SET FOREIGN_KEY_CHECKS = 0`
- Check database permissions

## License

MIT
