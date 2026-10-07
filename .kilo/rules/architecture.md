# Architecture Rules

- Follow `SEMBURAT_PRD.md` and `docs/ARCHITECTURE.md`.
- Keep domain logic independent from providers.
- Use adapters for external services.
- Do not introduce a new infrastructure platform without approval.
- Prefer the simplest architecture that satisfies measured requirements.
- Avoid premature microservices.
- Preserve clear boundaries between domain, application, infrastructure, and presentation.
- Public APIs require validation and explicit authorization.
- Async jobs require status, retries, idempotency, and observability.
