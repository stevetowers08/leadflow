# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### 1. **DO NOT** create a public GitHub issue

Security vulnerabilities should be reported privately to prevent exploitation.

### 2. Email Security Team

Send an email to: **security@4twenty.com.au**

Include the following information:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested fixes or mitigations

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Within 30 days (depending on complexity)

### 4. Recognition

We appreciate security researchers who responsibly disclose vulnerabilities. Contributors will be recognized in our security acknowledgments.

## Security Measures

### Authentication & Authorization

- JWT-based authentication with Supabase Auth
- Row Level Security (RLS) policies on all database tables
- Role-based access control (Owner, Admin, User)
- Secure session management

### Data Protection

- All sensitive data encrypted in transit (HTTPS)
- Database encryption at rest via Supabase
- Input validation and sanitization
- SQL injection prevention through parameterized queries

### API Security

- Rate limiting on API endpoints
- CORS configuration for cross-origin requests
- Environment variable protection
- Secure API key management

### Infrastructure Security

- Regular dependency updates
- Docker container security
- Environment isolation (development/staging/production)
- Secure deployment pipelines

## Security Best Practices

### For Developers

- Never commit API keys or secrets to version control
- Use environment variables for sensitive configuration
- Implement proper input validation
- Follow the principle of least privilege
- Regular security audits of dependencies

### For Users

- Use strong, unique passwords
- Enable two-factor authentication when available
- Report suspicious activity immediately
- Keep your browser and devices updated

## Security Updates

Security updates will be released as patch versions (e.g., 1.0.1, 1.0.2) and will be:

- Automatically applied to hosted instances
- Available for self-hosted deployments
- Documented in the CHANGELOG.md

## Contact

For security-related questions or concerns:

- **Email**: security@4twenty.com.au
- **Response Time**: Within 24-48 hours

---

_This security policy is effective as of January 27, 2025_
