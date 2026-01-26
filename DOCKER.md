# Rent-a-Wheel Docker Setup

## 🚀 Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Start All Services

```bash
# Copy environment file
cp .env.docker .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### With Kafka (Optional)

```bash
# Start with Kafka for background job processing
docker-compose --profile with-kafka up -d
```

## 📦 Services

| Service        | Port | URL                             |
| -------------- | ---- | ------------------------------- |
| **PostgreSQL** | 5432 | `localhost:5432`                |
| **Redis**      | 6379 | `localhost:6379`                |
| **API**        | 4000 | http://localhost:4000           |
| **CRM**        | 3000 | http://localhost:3000           |
| **Admin**      | 3001 | http://localhost:3001           |
| **Kafka**      | 9092 | `localhost:9092` (with profile) |

## 🔧 Common Commands

```bash
# Rebuild services after code changes
docker-compose up -d --build

# View service logs
docker-compose logs api
docker-compose logs crm
docker-compose logs admin

# Run database migrations
docker-compose exec api pnpm exec prisma migrate deploy

# Access PostgreSQL shell
docker-compose exec postgres psql -U postgres -d rent_a_wheel

# Access Redis CLI
docker-compose exec redis redis-cli -a redis_password

# Restart a specific service
docker-compose restart api

# Stop and remove all containers, networks, volumes
docker-compose down -v
```

## 🗄️ Database Management

```bash
# Run Prisma Studio (database GUI)
docker-compose exec api npx prisma studio

# Generate Prisma client
docker-compose exec api pnpm exec prisma generate

# Create migration
docker-compose exec api pnpm exec prisma migrate dev --name migration_name

# Apply migrations
docker-compose exec api pnpm exec prisma migrate deploy

# Reset database (⚠️ Deletes all data)
docker-compose exec api pnpm exec prisma migrate reset
```

## 📊 Monitoring

### Health Checks

```bash
# API health
curl http://localhost:4000/health

# Check all container health
docker-compose ps
```

### Resource Usage

```bash
# View resource usage
docker stats

# View logs
docker-compose logs -f --tail=100 api
```

## 🔒 Security Notes

1. **Change default passwords** in `.env` before production:
   - `POSTGRES_PASSWORD`
   - `REDIS_PASSWORD`
   - `JWT_SECRET`

2. **Environment Variables**: Never commit `.env` to version control

3. **Volumes**: Data is persisted in Docker volumes:
   - `postgres_data` - Database files
   - `redis_data` - Redis persistence

## 🛠️ Development Workflow

### Local Development with Docker

```bash
# Start dependencies only (PostgreSQL, Redis)
docker-compose up -d postgres redis

# Run apps locally
pnpm dev
```

### Full Docker Development

```bash
# Start everything
docker-compose up -d

# Watch logs
docker-compose logs -f api crm admin

# Make code changes (auto-reload in dev mode)
# Changes are reflected via volume mounts
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :4000  # macOS/Linux
netstat -ano | findstr :4000  # Windows

# Change port in docker-compose.yml
```

### Container Won't Start

```bash
# Check logs
docker-compose logs service-name

# Rebuild without cache
docker-compose build --no-cache service-name
docker-compose up -d service-name
```

### Database Connection Issues

```bash
# Check PostgreSQL is healthy
docker-compose exec postgres pg_isready

# Verify environment variables
docker-compose exec api env | grep DATABASE_URL
```

### Redis Connection Issues

```bash
# Test Redis connection
docker-compose exec redis redis-cli -a redis_password ping

# Check Redis logs
docker-compose logs redis
```

## 📝 Environment Variables

See [.env.docker](./.env.docker) for all available environment variables.

Key variables:

- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string (auto-generated)
- `REDIS_URL` - Redis connection string (auto-generated)
- `JWT_SECRET` - Secret key for JWT tokens
- `ALLOWED_ORIGINS` - CORS allowed origins

## 🚢 Production Deployment

For production deployment:

1. Use environment-specific `.env` files
2. Enable HTTPS/SSL
3. Configure proper logging and monitoring
4. Set up automated backups for PostgreSQL
5. Use secrets management (AWS Secrets Manager, Vault, etc.)
6. Configure resource limits in docker-compose.yml

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Redis Documentation](https://redis.io/documentation)
