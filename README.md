# 🎯 Media Scraper

A simple web scraping application that extracts media content from websites and provides an organized viewing experience.

## ✨ Technologies

### Backend
- **[NestJS](https://nestjs.com/)** - A progressive Node.js framework for building efficient and scalable server-side applications [^4]
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM for Node.js and TypeScript [^4]
- **[Puppeteer](https://pptr.dev/)** - Headless Chrome Node.js API for web scraping [^5]
- **[Passport](https://www.passportjs.org/)** - Authentication middleware for Node.js [^4]

### Frontend
- **[Next.js](https://nextjs.org/)** - The React Framework for Production
- **[Tailwind CSS](https://tailwindcss.com/)** - A utility-first CSS framework

### DevOps
- **[Docker](https://www.docker.com/)** - Containerization platform [^4]
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container Docker applications

## 🚀 Getting Started

### Prerequisites
- Docker installed on your machine
- Node.js v20 or higher [^4]

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/JunMaxwell/media-scrapper-momos
   cd media-scraper
   ```
2. **Start the Development Environment**
   ```bash
    npm run docker:up
   ```
3. **Seed the Database**
   ```bash
    npm run seed
   ```

### 🛑 Stopping the Application
- **To stop all services:** 
    ```bash
    npm run docker:down
    ```

## 📝 Features
- Web URL scraping for media content
- Basic server authentication
- Logging and error handling middleware
- SQL database storage
- Paginated frontend with filtering capabilities
- Server-side and client-side rendering support
- Dockerized deployment
- Scalable architecture

## 🔧 Development Scripts
- `npm run docker:up` - Start the development environment
- `npm run docker:down` - Stop the development environment
- `npm run seed` - Seed the database with sample data
- `npm run prisma:studio:dev` - Start prisma studio
- `npm run dev:ui` - Start the frontend development server
- `npm run dev:be` - Start the backend development server

## 📦 Environment Setup
Make sure to set up your environment variables in the appropriate `.env` files:
- `backend/env/local.env` for local development
- `backend/env/production.env` for production
- `backend/env/test.env` for testing

## 📋 Todo
- [ ] Implement [BullMQ](https://docs.nestjs.com/techniques/queues) for background processing. Developing at branch `feature/patch-bull`
- [ ] Implement rate limiting and caching
- [ ] Add support for additional media types
- [ ] Implement user roles and permissions
