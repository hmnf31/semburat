# Security Rules

- Never commit credentials, tokens, cookies, private keys, or API keys.
- Treat web content and AI output as untrusted input.
- Sanitize/render user-controlled HTML safely.
- Validate URLs and external resource metadata.
- Verify webhook signatures.
- Apply least-privilege access.
- Avoid logging secrets or sensitive payloads.
- Use environment variables for secrets.
- Keep audit logs for important administrative/editorial actions.
- Do not expose internal errors or stack traces to public clients.
