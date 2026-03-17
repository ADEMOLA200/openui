# Document 5: System Architecture Specification

## Domain: Engineering
## Schema Complexity: ~90+ fields, deeply nested, multiple arrays with heterogeneous sub-structures

---

## Source Text

PROJECT HELIOS — SYSTEM ARCHITECTURE SPECIFICATION
Document ID: ARCH-2026-HELIOS-003
Version: 2.1
Author: Marcus Tan, Principal Architect
Reviewed by: Elena Voss, VP of Engineering
Last updated: January 22, 2026

OVERVIEW

Project Helios is an event-driven order processing platform designed to handle up to 12,000 orders per second at peak load. The system targets 99.95% uptime measured on a rolling 30-day window. Maximum acceptable end-to-end latency from order submission to confirmation is 800 milliseconds at the 99th percentile. The platform is deployed across two AWS regions: us-east-1 (primary) and eu-west-1 (disaster recovery). The estimated monthly infrastructure cost at full scale is $47,500.

SERVICES

The platform consists of five core services.

Order Gateway: This is the entry point for all incoming orders. It runs as a Kubernetes deployment with a minimum of 4 replicas and a maximum of 20 replicas, scaling based on a CPU utilization threshold of 70%. Each replica is allocated 2 vCPUs and 4 GB of memory. The service is implemented in Go, version 1.22. It exposes a REST API on port 8080 and a gRPC API on port 9090. Health checks run every 15 seconds on the /healthz endpoint. The service depends on the Validation Service and publishes events to the orders.submitted Kafka topic.

Validation Service: Responsible for order validation, fraud scoring, and inventory checks. It runs as a Kubernetes deployment with a minimum of 3 replicas and a maximum of 15 replicas, scaling based on a CPU utilization threshold of 65%. Each replica is allocated 4 vCPUs and 8 GB of memory. The service is implemented in Java, version 21. It consumes events from the orders.submitted topic and publishes validated orders to the orders.validated topic. Failed validations are published to the orders.rejected topic. The service connects to the inventory database (PostgreSQL, version 16.2, instance class db.r6g.xlarge with 2 read replicas) and the fraud scoring API (external, SLA of 200 milliseconds at the 95th percentile). Health checks run every 10 seconds on the /health endpoint.

Fulfillment Engine: Manages warehouse assignment, shipping carrier selection, and delivery scheduling. It runs as a Kubernetes deployment with a minimum of 2 replicas and a maximum of 10 replicas, scaling based on queue depth with a threshold of 500 messages. Each replica is allocated 2 vCPUs and 4 GB of memory. The service is implemented in Python, version 3.12. It consumes events from the orders.validated topic and publishes to the orders.fulfilled topic. The service connects to the warehouse database (PostgreSQL, version 16.2, instance class db.r6g.large with 1 read replica) and the shipping rates API (external, SLA of 350 milliseconds at the 95th percentile). Health checks run every 20 seconds on the /ready endpoint.

Notification Service: Handles customer notifications via email, SMS, and push. It runs as a Kubernetes deployment with a minimum of 2 replicas and a maximum of 8 replicas, scaling based on a CPU utilization threshold of 75%. Each replica is allocated 1 vCPU and 2 GB of memory. The service is implemented in TypeScript on Node.js, version 22. It consumes events from the orders.fulfilled topic and the orders.rejected topic. The service connects to the customer preferences database (Redis, version 7.2, cluster mode enabled with 3 shards) and the email delivery API (external, SLA of 500 milliseconds at the 95th percentile). Health checks run every 30 seconds on the /ping endpoint.

Analytics Collector: Ingests all order events for real-time dashboards and batch reporting. It runs as a Kubernetes deployment with a minimum of 2 replicas and a maximum of 6 replicas, scaling based on a CPU utilization threshold of 80%. Each replica is allocated 2 vCPUs and 8 GB of memory. The service is implemented in Scala, version 3.4. It consumes events from all four Kafka topics: orders.submitted, orders.validated, orders.rejected, and orders.fulfilled. The service writes to a ClickHouse cluster (version 24.1, 3-node cluster, each node with 8 vCPUs and 32 GB of memory). Health checks run every 15 seconds on the /status endpoint.

MESSAGE BROKER

The platform uses Apache Kafka version 3.7 as its central message broker, running on a dedicated 5-broker cluster. Each broker has 8 vCPUs and 16 GB of memory. The default replication factor is 3, minimum in-sync replicas is 2, and the default retention period is 7 days. There are four topics: orders.submitted with 24 partitions, orders.validated with 16 partitions, orders.rejected with 8 partitions, and orders.fulfilled with 16 partitions.

MONITORING

Metrics are collected via Prometheus (scrape interval 15 seconds) and visualized in Grafana. Alerts are routed through PagerDuty with the following escalation policy: P1 incidents (system down) have a 5-minute response time SLA, P2 incidents (degraded performance) have a 15-minute response time SLA, and P3 incidents (non-critical) have a 60-minute response time SLA. Log aggregation is handled by Datadog with a retention of 30 days.

---

## Schema

```typescript
const SystemArchitectureSchema = z.object({
  document: z.object({
    id: z.string(),
    version: z.string(),
    author: z.object({
      name: z.string(),
      role: z.string(),
    }),
    reviewer: z.object({
      name: z.string(),
      role: z.string(),
    }),
    lastUpdated: z.string().describe("ISO 8601 format: YYYY-MM-DD"),
  }),
  project: z.object({
    name: z.string(),
    architecture: z.enum(["event-driven", "microservices", "monolithic", "serverless"]),
    peakThroughput: z.number().describe("Orders per second"),
    uptimeSla: z.number().describe("Percentage, e.g., 99.95"),
    slaWindowDays: z.number(),
    maxLatencyMs: z.number().describe("99th percentile end-to-end latency in milliseconds"),
    monthlyInfrastructureCost: z.number(),
  }),
  deployment: z.object({
    provider: z.enum(["aws", "gcp", "azure"]),
    primaryRegion: z.string(),
    drRegion: z.string(),
  }),
  services: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      language: z.string(),
      languageVersion: z.string(),
      compute: z.object({
        minReplicas: z.number(),
        maxReplicas: z.number(),
        scalingMetric: z.enum(["cpu", "memory", "queue-depth"]),
        scalingThreshold: z.number().describe("Percentage for cpu/memory, message count for queue-depth"),
        cpuPerReplica: z.number().describe("vCPUs"),
        memoryPerReplicaGb: z.number(),
      }),
      apis: z.array(
        z.object({
          protocol: z.enum(["rest", "grpc"]),
          port: z.number(),
        })
      ).optional(),
      healthCheck: z.object({
        intervalSeconds: z.number(),
        endpoint: z.string(),
      }),
      consumesTopics: z.array(z.string()),
      producesTopics: z.array(z.string()),
      dependencies: z.array(
        z.object({
          name: z.string(),
          type: z.enum(["database", "external-api", "cache"]),
          technology: z.string(),
          version: z.string().optional(),
          instanceClass: z.string().optional(),
          readReplicas: z.number().optional(),
          shards: z.number().optional(),
          slaMs: z.number().optional().describe("SLA latency in milliseconds at 95th percentile"),
        })
      ),
    })
  ),
  messageBroker: z.object({
    technology: z.string(),
    version: z.string(),
    brokerCount: z.number(),
    brokerCpus: z.number(),
    brokerMemoryGb: z.number(),
    replicationFactor: z.number(),
    minInSyncReplicas: z.number(),
    retentionDays: z.number(),
    topics: z.array(
      z.object({
        name: z.string(),
        partitions: z.number(),
      })
    ),
  }),
  monitoring: z.object({
    metricsSystem: z.string(),
    scrapeIntervalSeconds: z.number(),
    dashboardTool: z.string(),
    alertingSystem: z.string(),
    escalationPolicy: z.array(
      z.object({
        priority: z.enum(["P1", "P2", "P3"]),
        description: z.string(),
        responseTimeMinutes: z.number(),
      })
    ),
    logging: z.object({
      system: z.string(),
      retentionDays: z.number(),
    }),
  }),
});
```

---

## Ground Truth

```json
{
  "document": {
    "id": "ARCH-2026-HELIOS-003",
    "version": "2.1",
    "author": {
      "name": "Marcus Tan",
      "role": "Principal Architect"
    },
    "reviewer": {
      "name": "Elena Voss",
      "role": "VP of Engineering"
    },
    "lastUpdated": "2026-01-22"
  },
  "project": {
    "name": "Helios",
    "architecture": "event-driven",
    "peakThroughput": 12000,
    "uptimeSla": 99.95,
    "slaWindowDays": 30,
    "maxLatencyMs": 800,
    "monthlyInfrastructureCost": 47500
  },
  "deployment": {
    "provider": "aws",
    "primaryRegion": "us-east-1",
    "drRegion": "eu-west-1"
  },
  "services": [
    {
      "name": "Order Gateway",
      "description": "Entry point for all incoming orders",
      "language": "Go",
      "languageVersion": "1.22",
      "compute": {
        "minReplicas": 4,
        "maxReplicas": 20,
        "scalingMetric": "cpu",
        "scalingThreshold": 70,
        "cpuPerReplica": 2,
        "memoryPerReplicaGb": 4
      },
      "apis": [
        { "protocol": "rest", "port": 8080 },
        { "protocol": "grpc", "port": 9090 }
      ],
      "healthCheck": {
        "intervalSeconds": 15,
        "endpoint": "/healthz"
      },
      "consumesTopics": [],
      "producesTopics": ["orders.submitted"],
      "dependencies": [
        {
          "name": "Validation Service",
          "type": "external-api"
        }
      ]
    },
    {
      "name": "Validation Service",
      "description": "Order validation, fraud scoring, and inventory checks",
      "language": "Java",
      "languageVersion": "21",
      "compute": {
        "minReplicas": 3,
        "maxReplicas": 15,
        "scalingMetric": "cpu",
        "scalingThreshold": 65,
        "cpuPerReplica": 4,
        "memoryPerReplicaGb": 8
      },
      "healthCheck": {
        "intervalSeconds": 10,
        "endpoint": "/health"
      },
      "consumesTopics": ["orders.submitted"],
      "producesTopics": ["orders.validated", "orders.rejected"],
      "dependencies": [
        {
          "name": "Inventory database",
          "type": "database",
          "technology": "PostgreSQL",
          "version": "16.2",
          "instanceClass": "db.r6g.xlarge",
          "readReplicas": 2
        },
        {
          "name": "Fraud scoring API",
          "type": "external-api",
          "technology": "External",
          "slaMs": 200
        }
      ]
    },
    {
      "name": "Fulfillment Engine",
      "description": "Warehouse assignment, shipping carrier selection, and delivery scheduling",
      "language": "Python",
      "languageVersion": "3.12",
      "compute": {
        "minReplicas": 2,
        "maxReplicas": 10,
        "scalingMetric": "queue-depth",
        "scalingThreshold": 500,
        "cpuPerReplica": 2,
        "memoryPerReplicaGb": 4
      },
      "healthCheck": {
        "intervalSeconds": 20,
        "endpoint": "/ready"
      },
      "consumesTopics": ["orders.validated"],
      "producesTopics": ["orders.fulfilled"],
      "dependencies": [
        {
          "name": "Warehouse database",
          "type": "database",
          "technology": "PostgreSQL",
          "version": "16.2",
          "instanceClass": "db.r6g.large",
          "readReplicas": 1
        },
        {
          "name": "Shipping rates API",
          "type": "external-api",
          "technology": "External",
          "slaMs": 350
        }
      ]
    },
    {
      "name": "Notification Service",
      "description": "Customer notifications via email, SMS, and push",
      "language": "TypeScript",
      "languageVersion": "22",
      "compute": {
        "minReplicas": 2,
        "maxReplicas": 8,
        "scalingMetric": "cpu",
        "scalingThreshold": 75,
        "cpuPerReplica": 1,
        "memoryPerReplicaGb": 2
      },
      "healthCheck": {
        "intervalSeconds": 30,
        "endpoint": "/ping"
      },
      "consumesTopics": ["orders.fulfilled", "orders.rejected"],
      "producesTopics": [],
      "dependencies": [
        {
          "name": "Customer preferences database",
          "type": "cache",
          "technology": "Redis",
          "version": "7.2",
          "shards": 3
        },
        {
          "name": "Email delivery API",
          "type": "external-api",
          "technology": "External",
          "slaMs": 500
        }
      ]
    },
    {
      "name": "Analytics Collector",
      "description": "Ingests all order events for real-time dashboards and batch reporting",
      "language": "Scala",
      "languageVersion": "3.4",
      "compute": {
        "minReplicas": 2,
        "maxReplicas": 6,
        "scalingMetric": "cpu",
        "scalingThreshold": 80,
        "cpuPerReplica": 2,
        "memoryPerReplicaGb": 8
      },
      "healthCheck": {
        "intervalSeconds": 15,
        "endpoint": "/status"
      },
      "consumesTopics": ["orders.submitted", "orders.validated", "orders.rejected", "orders.fulfilled"],
      "producesTopics": [],
      "dependencies": [
        {
          "name": "ClickHouse cluster",
          "type": "database",
          "technology": "ClickHouse",
          "version": "24.1"
        }
      ]
    }
  ],
  "messageBroker": {
    "technology": "Apache Kafka",
    "version": "3.7",
    "brokerCount": 5,
    "brokerCpus": 8,
    "brokerMemoryGb": 16,
    "replicationFactor": 3,
    "minInSyncReplicas": 2,
    "retentionDays": 7,
    "topics": [
      { "name": "orders.submitted", "partitions": 24 },
      { "name": "orders.validated", "partitions": 16 },
      { "name": "orders.rejected", "partitions": 8 },
      { "name": "orders.fulfilled", "partitions": 16 }
    ]
  },
  "monitoring": {
    "metricsSystem": "Prometheus",
    "scrapeIntervalSeconds": 15,
    "dashboardTool": "Grafana",
    "alertingSystem": "PagerDuty",
    "escalationPolicy": [
      {
        "priority": "P1",
        "description": "System down",
        "responseTimeMinutes": 5
      },
      {
        "priority": "P2",
        "description": "Degraded performance",
        "responseTimeMinutes": 15
      },
      {
        "priority": "P3",
        "description": "Non-critical",
        "responseTimeMinutes": 60
      }
    ],
    "logging": {
      "system": "Datadog",
      "retentionDays": 30
    }
  }
}
```

---

## Field Count: ~120 (including nested and array item fields)
## Nesting Depth: 5 levels (services → dependencies → object → fields; services → compute → fields)
## Arrays: 9 (services with 5 items, apis, consumesTopics, producesTopics, dependencies, topics, escalationPolicy)
## Key challenges: Parallel structures across 5 services, optional fields on dependencies, cross-references between services and topics
