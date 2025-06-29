#!/bin/bash

echo "🚀 Starting Spring React CRUD Application..."

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🏥 Checking service health..."
if docker-compose ps | grep -q "unhealthy\|Exit"; then
    echo "❌ Some services failed to start. Check logs:"
    docker-compose logs
    exit 1
fi

echo "✅ Application started successfully!"
echo ""
echo "📱 Access Points:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8080/api/v1"
echo "   Swagger UI: http://localhost:8080/api/v1/swagger-ui.html"
echo ""
echo "👥 Test Users:"
echo "   USER:  username=user,  password=123"
echo "   ADMIN: username=admin, password=123"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop app:  docker-compose down"
echo "   Restart:   docker-compose restart"