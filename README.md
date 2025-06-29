# Spring Boot + React CRUD Application

A full-stack web application with Spring Boot backend, React frontend, and PostgreSQL database, containerized with Docker.

## Tech Stack

* **Frontend**: React 19 + Bootstrap
* **Backend**: Spring Boot 3.5.3 + JWT Auth
* **Database**: PostgreSQL 15
* **Deployment**: Docker + Docker Compose

## Project Structure

```
spring-react-crud-app/
├── backend/
│   ├── src/main/
│   │   ├── java/
│   │   └── resources/
│   │       ├── application.yml
│   │       └── data.sql
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker/
├── docker-compose.yml
├── run.sh
└── README.md
```

## Quick Start

### Prerequisites

* Docker & Docker Compose

### Run Application

**Option 1: Using run script (Recommended)**

```bash
git clone https://github.com/Zerrad0z/spring-react-crud-app
cd spring-react-crud-app
chmod +x run.sh
./run.sh
```

**Option 2: Manual Docker Compose**

```bash
git clone https://github.com/Zerrad0z/spring-react-crud-app
cd spring-react-crud-app
docker-compose up --build
```

## Access Points

* **Frontend**: http://localhost
* **Backend API**: http://localhost:8080
* **API Docs**: http://localhost:8080/swagger-ui.html

## Default Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `123` | ADMIN |
| `user` | `123` | USER |

## Sample Data

The app automatically creates:
* 2 users (admin/user)
* 5 product categories
* 25 sample products

## Stop Application

**Using run script:**

```bash
# The script handles cleanup automatically when you press Ctrl+C
# Or you can stop manually:
docker-compose down
```

**Manual stop:**

```bash
# Stop containers
docker-compose down

# Stop and remove data
docker-compose down -v
```

## Environment Variables

Key configurations in `docker-compose.yml`:
* `POSTGRES_DB=crud_app_db`
* `POSTGRES_USER=crud_user`
* `POSTGRES_PASSWORD=password`
* `JWT_SECRET=jwt_secret_key_here`

## Main API Endpoints

### Authentication
* `POST /api/v1/auth/login` - Login
* `POST /api/v1/auth/register` - Register

### Products
* `GET /api/v1/products` - List products
* `POST /api/v1/products` - Create (Admin)
* `PUT /api/v1/products/{id}` - Update (Admin)
* `DELETE /api/v1/products/{id}` - Delete (Admin)

### Categories
* `GET /api/v1/categories` - List categories
* `POST /api/v1/categories` - Create (Admin)
* `PUT /api/v1/categories/{id}` - Update (Admin)
* `DELETE /api/v1/categories/{id}` - Delete (Admin)

## Troubleshooting

### View Logs

```bash
docker-compose logs backend
docker-compose logs frontend
```

### Common Issues
* **Port conflicts**: Ensure ports 80, 8080, 5432 are free
* **DB connection**: Wait for PostgreSQL to fully start
* **Build issues**: Run `docker-compose build --no-cache`

### Database Access

```bash
docker exec -it postgres-db psql -U crud_user -d crud_app_db
```

### Script Permissions

If you get permission denied:

```bash
chmod +x run.sh
```
