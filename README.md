# Arbeiters

Arbeiters is a tool that centralizes AI/LLM work opportunities from multiple platforms into a single dashboard, notifying the user in real-time and guiding them with an intelligent profile screening system — without ever blocking access to any type of work.

This repository is a monorepo containing all the services and applications that compose the Arbeiters ecosystem.

## Documentation

*   **Product Requirements Document (PRD)**: [`docs/PRD.md`](./docs/PRD.md)
*   **System Design Document**: [`docs/SYSTEM_DESIGN.md`](./docs/SYSTEM_DESIGN.md)
*   **Business Rules**: [`docs/BUSINESS_RULES.md`](./docs/BUSINESS_RULES.md)
*   **Contributing Guidelines**: [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md)
*   **Development Sprints**: [`docs/SPRINTS.md`](./docs/SPRINTS.md)

## Getting Started

Please refer to the `CONTRIBUTING.md` file for detailed instructions on how to set up your development environment and contribute to the project.

## Project Structure

This monorepo is organized using NPM Workspaces:

*   `apps/backend/`: The core API and orchestration layer (Node.js/Express/Prisma).
*   `apps/frontend/`: The main user dashboard application (TypeScript/React).
*   `apps/landing-page/`: The public-facing landing page (Angular).
*   `apps/scraper-fleet/`: The distributed workers responsible for extracting opportunities from various platforms (BullMQ/Playwright).
*   `docs/`: All project documentation, including PRD, System Design, Business Rules, and Contribution Guidelines.

## Contributing

We welcome contributions! Please read our [`CONTRIBUTING.md`](./docs/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
