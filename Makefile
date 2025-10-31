.PHONY: help build up down restart logs clean test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Production commands
build: ## Build all Docker images
	docker-compose build

up: ## Start all services in production mode
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## Show logs from all services
	docker-compose logs -f

clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all

# Development commands
dev-up: ## Start all services in development mode
	docker-compose -f docker-compose.dev.yml up

dev-down: ## Stop development services
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## Show development logs
	docker-compose -f docker-compose.dev.yml logs -f

# Database commands
db-shell: ## Access MongoDB shell
	docker exec -it app-mongodb mongosh -u admin -p password123

redis-cli: ## Access Redis CLI
	docker exec -it app-redis redis-cli

# Service-specific logs
server-logs: ## Show server logs
	docker-compose logs -f server

client-logs: ## Show client logs
	docker-compose logs -f client

# Testing
test-server: ## Run server tests
	cd apps/server && npm test

test-client: ## Run client tests
	cd apps/client && npm test

test-all: ## Run all tests
	cd apps/server && npm test && cd ../client && npm test

# Cleanup commands
prune: ## Remove unused Docker data
	docker system prune -af --volumes

# Health checks
health: ## Check health of all services
	@echo "Checking MongoDB..."
	@docker exec app-mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null && echo "✓ MongoDB is healthy" || echo "✗ MongoDB is down"
	@echo "Checking Redis..."
	@docker exec app-redis redis-cli ping > /dev/null && echo "✓ Redis is healthy" || echo "✗ Redis is down"
	@echo "Checking NATS..."
	@curl -s http://localhost:8222/healthz > /dev/null && echo "✓ NATS is healthy" || echo "✗ NATS is down"
	@echo "Checking Server..."
	@curl -s http://localhost:3000 > /dev/null && echo "✓ Server is healthy" || echo "✗ Server is down"
	@echo "Checking Client..."
	@curl -s http://localhost:3001 > /dev/null && echo "✓ Client is healthy" || echo "✗ Client is down"