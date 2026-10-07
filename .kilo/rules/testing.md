# Testing Rules

For meaningful changes, run the smallest relevant validation set and expand when appropriate.

Preferred layers:

1. unit tests for domain logic
2. integration tests for adapters/database
3. API tests
4. build/typecheck
5. end-to-end tests for critical user flows

Critical cases include:

- verification failures
- publish blocking
- asset license restrictions
- duplicate jobs
- retry behavior
- malformed provider responses
- authorization failures

Do not mark a task complete solely because the application starts.
