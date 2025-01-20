# Technical Documentation for retube

## Architecture Overview

retube is built on a microservice architecture, with each service responsible for a specific functionality. The core components include:

* **Front-end:** Developed using React.js, provides a simplified and minimal interface for users to watch videos and interact with others.
* **API server:** Built with NestJS, handles user authentication, video upload and management, and communication with other services.
* **Multimodal embeddings service:** Utilizes Vertex AI to generate and store multimodal embeddings for all uploaded videos based on visual, audio, semantic, and color palette features.
* **Search engine:** Leverages Elasticsearch to provide efficient semantic similarity search across different content vectors.
* **Collaboration service:** Uses Liveblocks to create collaborative viewing rooms, allowing users to watch content together and interact in real-time.

## Technical Requirements

* **Front-end:** Javascript, React.js, HTML, CSS
* **Back-end:** Node.js, NestJS, PostgreSQL, Redis
* **Infrastructure:** Google Cloud Platform (GCP)
* **Machine Learning:** Vertex AI for multimodal embeddings generation
* **Search:** Elasticsearch
* **Collaboration:** Liveblocks

## Implementation Details

### Front-end

* React.js with Material UI for UI components and interactions.
* Seamless integration with Vertex AI and Elasticsearch APIs for search and filtering.
* Real-time updates and collaboration through Liveblocks integration.

### Back-end

* NestJS for API development and RESTful API design.
* PostgreSQL for user data and video metadata storage.
* Redis for caching frequently accessed data.
* Integration with Vertex AI for multimodal embeddings generation.
* Elasticsearch integration for semantic similarity search.
* Liveblocks implementation for collaborative viewing rooms.

### Multimodal Embeddings

* Vertex AI is used to train models that generate embeddings based on video content, including visual, audio, semantic, and color palette features.
* These embeddings are stored in a database for efficient retrieval and comparison.

### Search Engine

* Elasticsearch provides a robust and scalable search engine for finding videos based on semantic similarity.
* Users can search videos based on keywords, color palettes, or other relevant criteria.

### Collaboration Service

* Liveblocks enables real-time collaboration in viewing rooms.
* Users can watch videos together, chat, and interact with each other in a seamless manner.

## API Documentation

A comprehensive API documentation will be developed to provide developers with detailed information on how to interact with the retube API. This documentation will include:

* API endpoints and their functionalities
* Data models and structures
* Authentication and authorization procedures
* Error handling and troubleshooting guide

## Development Setup

*  Install necessary dependencies for front-end (React.js) and back-end (Node.js) development.
*  Set up GCP environment with required services (Vertex AI, Elasticsearch, Cloud SQL, etc.).
*  Configure API keys and access credentials for all services.
*  Follow development guidelines and best practices for building microservices architectures.
*  Implement unit and integration tests for all components.

