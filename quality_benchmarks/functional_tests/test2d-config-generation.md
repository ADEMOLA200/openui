# Test 2D: Configuration Generation

## Domain: Infrastructure Configuration
## Execution: Constraint validator checks generated config against requirements

---

## Test Case 1: Medium Complexity

### Problem Description (given to the model)

```
Generate a deployment configuration for a web application based on the following requirements.

Application: "TaskBoard" — a task management web app

Services:
1. Web Frontend
   - Docker image: taskboard/web:3.2.1
   - Needs 2 replicas
   - Requires 512MB memory and 0.5 CPU per replica
   - Exposes port 3000
   - Must be publicly accessible via HTTPS on domain taskboard.example.com
   - Environment variables: API_URL (pointing to the API service's internal URL), NODE_ENV=production
   - Health check: HTTP GET /health every 30 seconds, 5 second timeout, 3 failure threshold

2. API Server
   - Docker image: taskboard/api:3.2.1
   - Needs 3 replicas
   - Requires 1GB memory and 1 CPU per replica
   - Exposes port 8080
   - Internal only (not publicly accessible)
   - Environment variables: DATABASE_URL (pointing to the database), REDIS_URL (pointing to the cache), JWT_SECRET loaded from secret "taskboard-secrets" key "jwt-secret"
   - Health check: HTTP GET /api/health every 15 seconds, 3 second timeout, 2 failure threshold

3. Background Worker
   - Docker image: taskboard/worker:3.2.1
   - Needs 2 replicas
   - Requires 768MB memory and 0.5 CPU per replica
   - No exposed port
   - Environment variables: DATABASE_URL (same as API), REDIS_URL (same as API), WORKER_CONCURRENCY=5
   - No health check needed

Backing Services:
4. Database
   - PostgreSQL 16
   - Single instance (not replicated)
   - 2GB memory, 1 CPU
   - Persistent volume: 20GB, storage class "standard"
   - Exposes port 5432, internal only
   - Environment variables: POSTGRES_DB=taskboard, POSTGRES_USER=taskboard, POSTGRES_PASSWORD loaded from secret "taskboard-secrets" key "db-password"

5. Cache
   - Redis 7.2
   - Single instance
   - 512MB memory, 0.25 CPU
   - No persistent storage needed
   - Exposes port 6379, internal only

Networking:
- Web Frontend can reach API Server
- API Server can reach Database and Cache
- Background Worker can reach Database and Cache
- Web Frontend cannot reach Database or Cache directly
- Background Worker cannot be reached by any other service

Secrets:
- Secret "taskboard-secrets" with keys: "jwt-secret", "db-password"
  (values are opaque — just reference them, don't generate actual values)
```

### Schema

```typescript
const ContainerSpec = z.object({
  name: z.string(),
  image: z.string(),
  replicas: z.number(),
  resources: z.object({
    memoryMb: z.number(),
    cpuCores: z.number(),
  }),
  ports: z.array(
    z.object({
      containerPort: z.number(),
      protocol: z.enum(["TCP", "UDP"]),
    })
  ),
  envVars: z.array(
    z.object({
      name: z.string(),
      value: z.string().optional().describe("Static value"),
      valueFrom: z.object({
        secretName: z.string(),
        key: z.string(),
      }).optional().describe("Reference to a secret"),
      serviceRef: z.string().optional().describe("Reference to another service's internal URL"),
    })
  ),
  healthCheck: z.object({
    type: z.enum(["http", "tcp", "exec"]),
    path: z.string().optional(),
    port: z.number().optional(),
    intervalSeconds: z.number(),
    timeoutSeconds: z.number(),
    failureThreshold: z.number(),
  }).optional(),
  expose: z.enum(["public", "internal", "none"]),
});

const IngressRule = z.object({
  domain: z.string(),
  serviceName: z.string(),
  servicePort: z.number(),
  tlsEnabled: z.boolean(),
});

const PersistentVolume = z.object({
  name: z.string(),
  serviceName: z.string(),
  sizeGb: z.number(),
  storageClass: z.string(),
  mountPath: z.string(),
});

const NetworkPolicy = z.object({
  name: z.string(),
  target: z.string().describe("Service this policy applies to"),
  allowIngressFrom: z.array(z.string()).describe("Services allowed to send traffic to target"),
  allowEgressTo: z.array(z.string()).describe("Services the target is allowed to reach"),
});

const Secret = z.object({
  name: z.string(),
  keys: z.array(z.string()),
});

const DeploymentConfig = z.object({
  appName: z.string(),
  services: z.array(ContainerSpec),
  ingress: z.array(IngressRule),
  volumes: z.array(PersistentVolume),
  networkPolicies: z.array(NetworkPolicy),
  secrets: z.array(Secret),
});
```

### Expected Output

```json
{
  "appName": "TaskBoard",
  "services": [
    {
      "name": "web-frontend",
      "image": "taskboard/web:3.2.1",
      "replicas": 2,
      "resources": { "memoryMb": 512, "cpuCores": 0.5 },
      "ports": [{ "containerPort": 3000, "protocol": "TCP" }],
      "envVars": [
        { "name": "API_URL", "serviceRef": "api-server" },
        { "name": "NODE_ENV", "value": "production" }
      ],
      "healthCheck": {
        "type": "http",
        "path": "/health",
        "port": 3000,
        "intervalSeconds": 30,
        "timeoutSeconds": 5,
        "failureThreshold": 3
      },
      "expose": "public"
    },
    {
      "name": "api-server",
      "image": "taskboard/api:3.2.1",
      "replicas": 3,
      "resources": { "memoryMb": 1024, "cpuCores": 1 },
      "ports": [{ "containerPort": 8080, "protocol": "TCP" }],
      "envVars": [
        { "name": "DATABASE_URL", "serviceRef": "database" },
        { "name": "REDIS_URL", "serviceRef": "cache" },
        { "name": "JWT_SECRET", "valueFrom": { "secretName": "taskboard-secrets", "key": "jwt-secret" } }
      ],
      "healthCheck": {
        "type": "http",
        "path": "/api/health",
        "port": 8080,
        "intervalSeconds": 15,
        "timeoutSeconds": 3,
        "failureThreshold": 2
      },
      "expose": "internal"
    },
    {
      "name": "background-worker",
      "image": "taskboard/worker:3.2.1",
      "replicas": 2,
      "resources": { "memoryMb": 768, "cpuCores": 0.5 },
      "ports": [],
      "envVars": [
        { "name": "DATABASE_URL", "serviceRef": "database" },
        { "name": "REDIS_URL", "serviceRef": "cache" },
        { "name": "WORKER_CONCURRENCY", "value": "5" }
      ],
      "expose": "none"
    },
    {
      "name": "database",
      "image": "postgres:16",
      "replicas": 1,
      "resources": { "memoryMb": 2048, "cpuCores": 1 },
      "ports": [{ "containerPort": 5432, "protocol": "TCP" }],
      "envVars": [
        { "name": "POSTGRES_DB", "value": "taskboard" },
        { "name": "POSTGRES_USER", "value": "taskboard" },
        { "name": "POSTGRES_PASSWORD", "valueFrom": { "secretName": "taskboard-secrets", "key": "db-password" } }
      ],
      "expose": "internal"
    },
    {
      "name": "cache",
      "image": "redis:7.2",
      "replicas": 1,
      "resources": { "memoryMb": 512, "cpuCores": 0.25 },
      "ports": [{ "containerPort": 6379, "protocol": "TCP" }],
      "envVars": [],
      "expose": "internal"
    }
  ],
  "ingress": [
    {
      "domain": "taskboard.example.com",
      "serviceName": "web-frontend",
      "servicePort": 3000,
      "tlsEnabled": true
    }
  ],
  "volumes": [
    {
      "name": "database-data",
      "serviceName": "database",
      "sizeGb": 20,
      "storageClass": "standard",
      "mountPath": "/var/lib/postgresql/data"
    }
  ],
  "networkPolicies": [
    {
      "name": "web-frontend-policy",
      "target": "web-frontend",
      "allowIngressFrom": [],
      "allowEgressTo": ["api-server"]
    },
    {
      "name": "api-server-policy",
      "target": "api-server",
      "allowIngressFrom": ["web-frontend"],
      "allowEgressTo": ["database", "cache"]
    },
    {
      "name": "background-worker-policy",
      "target": "background-worker",
      "allowIngressFrom": [],
      "allowEgressTo": ["database", "cache"]
    },
    {
      "name": "database-policy",
      "target": "database",
      "allowIngressFrom": ["api-server", "background-worker"],
      "allowEgressTo": []
    },
    {
      "name": "cache-policy",
      "target": "cache",
      "allowIngressFrom": ["api-server", "background-worker"],
      "allowEgressTo": []
    }
  ],
  "secrets": [
    {
      "name": "taskboard-secrets",
      "keys": ["jwt-secret", "db-password"]
    }
  ]
}
```

### Verification

1. **Schema validation**: output matches the schema
2. **Service count**: exactly 5 services
3. **Image tags**: exact match on all image strings
4. **Resource specs**: exact match on replicas, memory, CPU
5. **Port assignments**: correct ports, correct protocols
6. **Environment variables**: correct names, correct values/refs/secrets
7. **Health checks**: correct for services that need them, absent for worker
8. **Ingress**: correct domain, service, port, TLS enabled
9. **Volumes**: correct size, storage class, attached to correct service
10. **Network policies**: verify each constraint:
    - web-frontend can reach ONLY api-server
    - api-server can reach ONLY database and cache
    - background-worker can reach ONLY database and cache
    - web-frontend CANNOT reach database or cache
    - NO service can reach background-worker
11. **Secrets**: correct name and keys, correctly referenced in env vars

---

## Test Case 2: Hard Complexity

### Problem Description (given to the model)

```
Generate a deployment configuration for a microservices e-commerce platform with the following requirements.

Application: "ShopFlow" — a microservices e-commerce platform

Services:

1. API Gateway
   - Image: shopflow/gateway:2.0.4
   - 3 replicas, 1GB memory, 1 CPU each
   - Exposes port 8443
   - Public, HTTPS on shop.example.com and api.shop.example.com
   - Environment: RATE_LIMIT_RPS=100, AUTH_SERVICE_URL (ref to auth-service), CATALOG_SERVICE_URL (ref to catalog-service), ORDER_SERVICE_URL (ref to order-service), LOG_LEVEL=info
   - Health check: HTTP GET /gateway/health every 10s, 3s timeout, 2 failure threshold
   - Autoscaling: min 3, max 10, target CPU 65%

2. Auth Service
   - Image: shopflow/auth:2.0.4
   - 2 replicas, 512MB memory, 0.5 CPU each
   - Exposes port 8081
   - Internal only
   - Environment: DATABASE_URL (ref to auth-db), JWT_PRIVATE_KEY from secret "auth-keys" key "private-key", JWT_PUBLIC_KEY from secret "auth-keys" key "public-key", TOKEN_EXPIRY_SECONDS=3600, REDIS_URL (ref to session-cache)
   - Health check: HTTP GET /auth/health every 15s, 3s timeout, 3 failure threshold

3. Catalog Service
   - Image: shopflow/catalog:2.0.4
   - 2 replicas, 768MB memory, 0.5 CPU each
   - Exposes port 8082
   - Internal only
   - Environment: DATABASE_URL (ref to catalog-db), SEARCH_URL (ref to search-engine), CDN_BASE_URL=https://cdn.shop.example.com, CACHE_TTL_SECONDS=300
   - Health check: HTTP GET /catalog/health every 15s, 3s timeout, 3 failure threshold

4. Order Service
   - Image: shopflow/orders:2.0.4
   - 3 replicas, 1GB memory, 1 CPU each
   - Exposes port 8083
   - Internal only
   - Environment: DATABASE_URL (ref to order-db), PAYMENT_GATEWAY_URL from secret "payment-config" key "gateway-url", PAYMENT_API_KEY from secret "payment-config" key "api-key", INVENTORY_SERVICE_URL (ref to inventory-service), NOTIFICATION_SERVICE_URL (ref to notification-service), EVENT_BUS_URL (ref to event-bus)
   - Health check: HTTP GET /orders/health every 10s, 3s timeout, 2 failure threshold

5. Inventory Service
   - Image: shopflow/inventory:2.0.4
   - 2 replicas, 512MB memory, 0.5 CPU each
   - Exposes port 8084
   - Internal only
   - Environment: DATABASE_URL (ref to inventory-db), EVENT_BUS_URL (ref to event-bus), LOW_STOCK_THRESHOLD=10
   - Health check: HTTP GET /inventory/health every 15s, 3s timeout, 3 failure threshold

6. Notification Service
   - Image: shopflow/notifications:2.0.4
   - 2 replicas, 512MB memory, 0.5 CPU each
   - Exposes port 8085
   - Internal only
   - Environment: SMTP_HOST from secret "email-config" key "smtp-host", SMTP_PORT from secret "email-config" key "smtp-port", SMTP_USER from secret "email-config" key "smtp-user", SMTP_PASSWORD from secret "email-config" key "smtp-password", SMS_API_KEY from secret "sms-config" key "api-key", EVENT_BUS_URL (ref to event-bus)
   - Health check: HTTP GET /notifications/health every 20s, 5s timeout, 3 failure threshold

7. Event Bus
   - Image: shopflow/eventbus:1.5.0 (based on NATS)
   - 3 replicas, 512MB memory, 0.5 CPU each
   - Exposes ports 4222 (client) and 6222 (cluster)
   - Internal only
   - Environment: CLUSTER_SIZE=3, MAX_PAYLOAD_MB=8
   - Health check: TCP port 4222 every 10s, 2s timeout, 3 failure threshold
   - Persistent volume: 10GB, storage class "fast", mount at /data/jetstream

Backing Services:

8. Auth Database
   - PostgreSQL 16, image: postgres:16
   - 1 replica, 1GB memory, 0.5 CPU
   - Port 5432, internal
   - Env: POSTGRES_DB=shopflow_auth, POSTGRES_USER=auth_user, POSTGRES_PASSWORD from secret "db-passwords" key "auth-db-password"
   - Persistent volume: 10GB, storage class "standard", mount at /var/lib/postgresql/data

9. Catalog Database
   - PostgreSQL 16, image: postgres:16
   - 1 replica, 2GB memory, 1 CPU
   - Port 5432, internal
   - Env: POSTGRES_DB=shopflow_catalog, POSTGRES_USER=catalog_user, POSTGRES_PASSWORD from secret "db-passwords" key "catalog-db-password"
   - Persistent volume: 30GB, storage class "standard", mount at /var/lib/postgresql/data

10. Order Database
    - PostgreSQL 16, image: postgres:16
    - 1 replica, 2GB memory, 1 CPU
    - Port 5432, internal
    - Env: POSTGRES_DB=shopflow_orders, POSTGRES_USER=orders_user, POSTGRES_PASSWORD from secret "db-passwords" key "orders-db-password"
    - Persistent volume: 50GB, storage class "fast", mount at /var/lib/postgresql/data

11. Inventory Database
    - PostgreSQL 16, image: postgres:16
    - 1 replica, 1GB memory, 0.5 CPU
    - Port 5432, internal
    - Env: POSTGRES_DB=shopflow_inventory, POSTGRES_USER=inventory_user, POSTGRES_PASSWORD from secret "db-passwords" key "inventory-db-password"
    - Persistent volume: 15GB, storage class "standard", mount at /var/lib/postgresql/data

12. Session Cache
    - Redis 7.2, image: redis:7.2
    - 1 replica, 1GB memory, 0.5 CPU
    - Port 6379, internal
    - No env vars
    - No persistent storage

13. Search Engine
    - Elasticsearch 8.12, image: elasticsearch:8.12
    - 2 replicas, 4GB memory, 2 CPU each
    - Port 9200, internal
    - Env: discovery.type=single-node, ES_JAVA_OPTS=-Xms2g -Xmx2g, xpack.security.enabled=false
    - Persistent volume: 50GB, storage class "fast", mount at /usr/share/elasticsearch/data

Networking rules:
- API Gateway can reach: auth-service, catalog-service, order-service
- Auth Service can reach: auth-db, session-cache
- Catalog Service can reach: catalog-db, search-engine
- Order Service can reach: order-db, inventory-service, notification-service, event-bus
- Inventory Service can reach: inventory-db, event-bus
- Notification Service can reach: event-bus
- Event Bus can be reached by: order-service, inventory-service, notification-service
- All databases can ONLY be reached by their respective service
- Session Cache can ONLY be reached by auth-service
- Search Engine can ONLY be reached by catalog-service
- No service can reach API Gateway
- Background services (inventory, notification) cannot be reached by API Gateway directly

Secrets:
- "auth-keys": keys ["private-key", "public-key"]
- "payment-config": keys ["gateway-url", "api-key"]
- "email-config": keys ["smtp-host", "smtp-port", "smtp-user", "smtp-password"]
- "sms-config": keys ["api-key"]
- "db-passwords": keys ["auth-db-password", "catalog-db-password", "orders-db-password", "inventory-db-password"]

Autoscaling (in addition to API Gateway):
- Order Service: min 3, max 8, target CPU 70%
- Catalog Service: min 2, max 6, target CPU 75%
```

### Schema

```typescript
const AutoscalingSpec = z.object({
  minReplicas: z.number(),
  maxReplicas: z.number(),
  targetCpuPercent: z.number(),
});

const ContainerSpec = z.object({
  name: z.string(),
  image: z.string(),
  replicas: z.number(),
  resources: z.object({
    memoryMb: z.number(),
    cpuCores: z.number(),
  }),
  ports: z.array(
    z.object({
      containerPort: z.number(),
      protocol: z.enum(["TCP", "UDP"]),
      name: z.string().optional(),
    })
  ),
  envVars: z.array(
    z.object({
      name: z.string(),
      value: z.string().optional(),
      valueFrom: z.object({
        secretName: z.string(),
        key: z.string(),
      }).optional(),
      serviceRef: z.string().optional(),
    })
  ),
  healthCheck: z.object({
    type: z.enum(["http", "tcp", "exec"]),
    path: z.string().optional(),
    port: z.number().optional(),
    intervalSeconds: z.number(),
    timeoutSeconds: z.number(),
    failureThreshold: z.number(),
  }).optional(),
  expose: z.enum(["public", "internal", "none"]),
  autoscaling: AutoscalingSpec.optional(),
});

const IngressRule = z.object({
  domain: z.string(),
  serviceName: z.string(),
  servicePort: z.number(),
  tlsEnabled: z.boolean(),
});

const PersistentVolume = z.object({
  name: z.string(),
  serviceName: z.string(),
  sizeGb: z.number(),
  storageClass: z.string(),
  mountPath: z.string(),
});

const NetworkPolicy = z.object({
  name: z.string(),
  target: z.string(),
  allowIngressFrom: z.array(z.string()),
  allowEgressTo: z.array(z.string()),
});

const Secret = z.object({
  name: z.string(),
  keys: z.array(z.string()),
});

const DeploymentConfig = z.object({
  appName: z.string(),
  services: z.array(ContainerSpec),
  ingress: z.array(IngressRule),
  volumes: z.array(PersistentVolume),
  networkPolicies: z.array(NetworkPolicy),
  secrets: z.array(Secret),
});
```

### Verification

1. **Service count**: exactly 13 services
2. **Image tags**: all exact match
3. **Resource specs**: all exact match on replicas, memory, CPU
4. **Port assignments**: all correct, including event-bus dual ports
5. **Environment variables**: all correct values, refs, and secrets — 30+ env vars total
6. **Health checks**: correct for all services that need them, correct types (HTTP vs TCP)
7. **Autoscaling**: present on gateway, order-service, catalog-service with correct values; absent on all others
8. **Ingress**: two rules — shop.example.com and api.shop.example.com, both pointing to gateway on 8443 with TLS
9. **Volumes**: 7 persistent volumes with correct sizes, storage classes, and mount paths
10. **Network policies**: 13 policies (one per service), each strictly matching the networking rules:
    - Each database reachable ONLY by its owning service
    - Session cache reachable ONLY by auth-service
    - Search engine reachable ONLY by catalog-service
    - Event bus reachable ONLY by order, inventory, notification services
    - API Gateway not reachable by any service
    - No direct gateway access to inventory or notification
11. **Secrets**: 5 secrets with correct key lists
12. **Cross-reference integrity**: every serviceRef in envVars points to a service that exists in the config
13. **Secret reference integrity**: every secretName/key pair references an existing secret and key
