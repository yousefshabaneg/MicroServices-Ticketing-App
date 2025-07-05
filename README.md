# 🎫 Ticket Microservices Application

A comprehensive microservices-based ticket booking application built with Node.js, TypeScript, React, and Kubernetes. This application demonstrates modern microservices architecture patterns including event-driven communication, service isolation, and containerized deployment.

## 🏗️ Architecture Overview

This application follows a microservices architecture pattern with the following services:

### Core Services

- **Auth Service** - User authentication and authorization
- **Tickets Service** - Ticket management and inventory
- **Orders Service** - Order processing and management
- **Payments Service** - Payment processing with Stripe integration
- **Expiration Service** - Order expiration handling
- **Client Service** - React-based frontend application

### Infrastructure Components

- **NATS Streaming** - Event-driven messaging system
- **MongoDB** - Primary database for each service
- **Redis** - Caching and job queue for expiration service
- **Kubernetes** - Container orchestration
- **Skaffold** - Development workflow automation

## 🛠️ Technology Stack

### Backend Services

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with cookie-session
- **Validation**: Express-validator
- **Testing**: Vitest with Supertest
- **Event Bus**: NATS Streaming
- **Job Queue**: Bull (Redis-based)
- **Shared Logic**: `@joe-tickets/common` npm package

### Frontend

- **Framework**: Next.js with React
- **Styling**: Bootstrap
- **HTTP Client**: Axios
- **Payment**: Stripe integration

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Development**: Skaffold
- **Ingress**: NGINX Ingress Controller

## 📁 Project Structure

```
ticketApp/
├── auth/                 # Authentication service
├── tickets/             # Ticket management service
├── orders/              # Order processing service
├── payments/            # Payment processing service
├── expiration/          # Order expiration service
├── client/              # React frontend
├── infra/
│   └── k8s/            # Kubernetes manifests
├── nats-test/          # NATS testing utilities
└── skaffold.yaml       # Skaffold configuration
```

**Note**: The `@joe-tickets/common` package is published to npm and contains shared logic including:

- Authentication middlewares
- Error types and handlers
- Event types and interfaces
- Base classes for publishers and listeners
- Validation utilities

## 🔄 Event-Driven Communication

The application uses NATS Streaming for event-driven communication between services:

### Event Types

- `TicketCreated` - When a new ticket is created
- `TicketUpdated` - When ticket details are modified
- `OrderCreated` - When a new order is placed
- `OrderCancelled` - When an order is cancelled
- `OrderComplete` - When an order is completed
- `ExpirationComplete` - When an order expires
- `PaymentCreated` - When payment is processed

### Event Flow

1. **Ticket Creation**: Tickets service publishes `TicketCreated` event
2. **Order Placement**: Orders service listens to ticket events and creates orders
3. **Payment Processing**: Payments service processes payments and publishes `PaymentCreated`
4. **Order Completion**: Orders service completes orders based on payment events
5. **Expiration Handling**: Expiration service manages order timeouts

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Kubernetes](https://kubernetes.io/docs/setup/) (Docker Desktop with Kubernetes enabled)
- [Skaffold](https://skaffold.dev/docs/install/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ticketApp
   ```

2. **Install dependencies for each service**

   ```bash
   # Install service dependencies (common package is automatically installed from npm)
   cd auth && npm install && cd ..
   cd tickets && npm install && cd ..
   cd orders && npm install && cd ..
   cd payments && npm install && cd ..
   cd expiration && npm install && cd ..
   cd client && npm install && cd ..
   ```

3. **Set up Kubernetes secrets**

   Create the required secrets before deploying:

   ```bash
   # Create JWT secret (used by auth, tickets, orders, and payments services)
   kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_jwt_secret_key

   # Create Stripe secret (used by payments service)
   kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=your_stripe_secret_key
   ```

   **Note**: Environment variables are already configured in the Kubernetes deployment files:

   - Database URIs are set to point to the respective MongoDB services
   - NATS configuration is set for event-driven communication
   - JWT keys are referenced from `jwt-secret` (used by auth, tickets, orders, payments)
   - Stripe keys are referenced from `stripe-secret` (used by payments service)
   - Redis host is configured for the expiration service

### Running with Skaffold

1. **Start the application**

   ```bash
   skaffold dev
   ```

   This command will:

   - Build all Docker images
   - Deploy all services to Kubernetes
   - Set up port forwarding
   - Watch for changes and rebuild/redeploy automatically

2. **Access the application**

   Add the following entry to your `/etc/hosts` file (or `C:\Windows\System32\drivers\etc\hosts` on Windows):

   ```
   127.0.0.1 ticketing.dev
   ```

   Then access the application at: `http://ticketing.dev`

### Manual Kubernetes Deployment

If you prefer to deploy manually without Skaffold:

1. **Create Kubernetes secrets** (if not already created)

   ```bash
   kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your_jwt_secret_key
   kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=your_stripe_secret_key
   ```

2. **Apply Kubernetes manifests**

   ```bash
   kubectl apply -f infra/k8s/
   ```

3. **Check deployment status**

   ```bash
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

4. **Port forward for local access**
   ```bash
   kubectl port-forward ingress-nginx-controller 80:80 -n ingress-nginx
   ```

## 🧪 Testing

### Running Tests

Each service includes comprehensive test suites:

```bash
# Run tests for all services
cd auth && npm test && cd ..
cd tickets && npm test && cd ..
cd orders && npm test && cd ..
cd payments && npm test && cd ..
cd expiration && npm test && cd ..
```

### Test Coverage

- **Unit Tests**: Individual function and component testing
- **Integration Tests**: API endpoint testing with Supertest
- **Event Tests**: NATS event publishing and listening tests
- **Database Tests**: MongoDB operations with in-memory database

## 📊 API Documentation

### Auth Service (`/api/users`)

- `POST /api/users/signup` - User registration
- `POST /api/users/signin` - User login
- `POST /api/users/signout` - User logout
- `GET /api/users/currentuser` - Get current user

### Tickets Service (`/api/tickets`)

- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets` - List all tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `PUT /api/tickets/:id` - Update ticket

### Orders Service (`/api/orders`)

- `POST /api/orders` - Create a new order
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Get order by ID
- `DELETE /api/orders/:id` - Cancel order

### Payments Service (`/api/payments`)

- `POST /api/payments` - Process payment

### Service Communication Patterns

- **Synchronous**: HTTP requests for immediate responses
- **Asynchronous**: NATS events for eventual consistency
- **Database**: Each service maintains its own database
- **Shared State**: `@joe-tickets/common` npm package for shared types and utilities

## Debugging Commands

```bash
# View all resources
kubectl get all

# View service endpoints
kubectl get endpoints

# View ingress configuration
kubectl describe ingress ingress-service

# View pod events
kubectl get events --sort-by='.lastTimestamp'

# Access service logs
kubectl logs -f deployment/auth-depl
```

## 🔒 Security Considerations

- **JWT Authentication**: Secure token-based authentication
- **HTTPS**: Secure communication in production
- **Input Validation**: Comprehensive request validation
- **Database Security**: Isolated databases per service
- **Secrets Management**: Kubernetes secrets for sensitive data (JWT keys, Stripe keys)
- **Environment Configuration**: All environment variables defined in Kubernetes deployment files

## 🚀 Production Deployment

### Prerequisites

- Kubernetes cluster (EKS, GKE, AKS, or self-hosted)
- Container registry (Docker Hub, ECR, GCR, etc.)
- Ingress controller (NGINX, Traefik, etc.)
- SSL certificate management

### Deployment Steps

1. **Update image references** in Kubernetes manifests
2. **Configure production environment variables**
3. **Set up monitoring and logging**
4. **Configure SSL certificates**
5. **Set up CI/CD pipeline**

### Production Considerations

- **Resource Limits**: Set appropriate CPU/memory limits
- **Replicas**: Configure multiple replicas for high availability
- **Persistent Storage**: Use persistent volumes for databases
- **Backup Strategy**: Implement database backup procedures
- **Monitoring**: Set up comprehensive monitoring and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Yousef Shaban**- email: [yousefshaban.eg@gmail.com](mailto:yousefshaban.eg@gmail.com)

---

## 🎯 Key Features

- **Microservices Architecture**: Scalable, maintainable service separation
- **Event-Driven Communication**: Loose coupling with NATS streaming
- **Container Orchestration**: Kubernetes deployment and scaling
- **Type Safety**: Full TypeScript implementation
- **Comprehensive Testing**: Unit, integration, and event testing
- **Modern Frontend**: React with Next.js and Bootstrap
- **Payment Integration**: Stripe payment processing
- **Real-time Updates**: Event-driven UI updates
- **Development Workflow**: Skaffold for seamless development experience

This application demonstrates modern microservices best practices and provides a solid foundation for building scalable, event-driven applications.
