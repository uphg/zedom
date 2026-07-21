# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in zedom, please do not open a public issue.

Instead, report it via [GitHub Security Advisories](https://github.com/xypur/zedom/security/advisories/new).

We will respond as quickly as possible and keep you updated throughout the process.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.x     | Yes       |

## XSS Considerations

Some utility functions (e.g., `toElement`) accept raw HTML strings. Always sanitize user input before passing it to these functions.
