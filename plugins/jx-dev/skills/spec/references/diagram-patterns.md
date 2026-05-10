# Mermaid Diagram Patterns

Reference library for TECH_SPEC diagram generation. All diagrams use Mermaid syntax.

## C4 Context Diagram

Show system boundaries, actors, and external dependencies.

```mermaid
graph TD
    User[End User] --> System[Your System]
    Admin[Admin User] --> System
    System --> Database[(Database)]
    System --> ExternalAPI[External API]
    System --> MessageQueue[Message Queue]
    
    style System fill:#bbf,stroke:#333,stroke-width:2px
```

## C4 Container Diagram

Show internal components and their relationships.

```mermaid
graph TD
    subgraph System
        WebApp[Web Application]
        API[API Service]
        Worker[Background Worker]
        DB[(Database)]
        Cache[(Cache)]
    end
    
    WebApp --> API
    API --> DB
    API --> Cache
    Worker --> DB
    Worker --> MessageQueue[Message Queue]
    
    style API fill:#bbf,stroke:#333,stroke-width:2px
```

## Sequence Diagram

Show interactions between components over time.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant DB
    participant External
    
    User->>Frontend: Action
    Frontend->>API: Request
    API->>DB: Query
    DB-->>API: Result
    API->>External: Webhook
    External-->>API: Acknowledgement
    API-->>Frontend: Response
    Frontend-->>User: Render
```

## Entity-Relationship Diagram (ERD)

Show data model relationships.

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER {
        uuid id PK
        string email UK
        string name
        timestamp created_at
    }
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER {
        uuid id PK
        uuid user_id FK
        decimal total
        enum status
        timestamp created_at
    }
    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        decimal price
    }
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
    PRODUCT {
        uuid id PK
        string name
        decimal price
        int stock
    }
```

## State Machine Diagram

Show state transitions for entities with lifecycle.

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Pending: submit
    Pending --> Approved: approve
    Pending --> Rejected: reject
    Rejected --> Draft: revise
    Approved --> Active: activate
    Active --> Completed: complete
    Active --> Cancelled: cancel
    Completed --> [*]
    Cancelled --> [*]
```

## Flowchart (Decision Logic)

Show branching logic and decision points.

```mermaid
flowchart TD
    A[Start] --> B{Authenticated?}
    B -->|Yes| C{Has Permission?}
    B -->|No| D[Redirect to Login]
    C -->|Yes| E[Process Request]
    C -->|No| F[Return 403]
    E --> G{Success?}
    G -->|Yes| H[Return 200]
    G -->|No| I[Return 500]
```

## Deployment / Infrastructure

Show deployment topology.

```mermaid
graph LR
    subgraph Cloud
        LB[Load Balancer]
        subgraph App Tier
            App1[Instance 1]
            App2[Instance 2]
        end
        subgraph Data Tier
            Primary[(Primary DB)]
            Replica[(Read Replica)]
        end
        Cache[(Redis)]
    end
    
    Client --> LB
    LB --> App1
    LB --> App2
    App1 --> Primary
    App2 --> Replica
    App1 --> Cache
    App2 --> Cache
```

## Usage Notes

- Pick the diagram type that best communicates the architectural decision
- Keep diagrams focused — one concept per diagram
- Use notes/comments in Mermaid for non-obvious relationships
- C4 Context for high-level system boundaries
- Sequence for request/response flows
- ERD for data models
- State machines for entities with lifecycle
- Flowcharts for complex decision logic
