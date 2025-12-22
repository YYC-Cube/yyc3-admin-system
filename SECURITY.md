# Security Policy

## Supported Versions

The following versions of YYC3 Admin System are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Known Vulnerabilities and Mitigations

### ✅ Recently Fixed Vulnerabilities

#### Storybook Environment Variable Exposure (GHSA-8452-54wp-rmv6)

**Status**: ✅ Fixed (2025-12-22)

**Description**: 
Storybook manager bundle may expose environment variables during build, leading to potential information disclosure.

**Impact**: 
HIGH (CVSS 7.3) - Could expose sensitive configuration data, API keys, and secrets

**Fix**:
- ✅ Upgraded storybook from 10.0.0-10.1.9 to 10.1.10
- ✅ Applied via `npm audit fix`
- ✅ Verified with comprehensive testing (440 tests passed)
- ✅ Current status: 0 vulnerabilities

**Affected Versions**:
- storybook 10.0.0 - 10.1.9

**Fixed Version**:
- storybook >= 10.1.10

**References**:
- GitHub Advisory: https://github.com/advisories/GHSA-8452-54wp-rmv6
- Detailed Report: [docs/security/STORYBOOK_VULNERABILITY_FIX.md](docs/security/STORYBOOK_VULNERABILITY_FIX.md)

---

### Node-forge ASN.1 Validator Vulnerability (CVE-2024-48939)

**Status**: ✅ Mitigated (Preventive measures in place)

**Description**: 
The node-forge library has a critical vulnerability in its ASN.1 validator that allows for non-synchronous interpretation conflicts, potentially leading to:
- Prototype pollution attacks
- Denial of service through malformed ASN.1 data
- Bypass of certificate validation
- Arbitrary code execution

**Impact**: 
HIGH - Could compromise cryptographic operations and certificate validation

**Mitigation**:
1. ✅ Node-forge is **not currently used** as a direct or transitive dependency
2. ✅ Added package.json `overrides` to force node-forge >= 1.3.1 if it gets added
3. ✅ Configured .npmrc with audit settings to catch vulnerable dependencies
4. ✅ Security scanning workflow monitors for node-forge vulnerabilities
5. ✅ Regular dependency audits via GitHub Actions

**Affected Versions**:
- node-forge < 1.3.1

**Safe Versions**:
- node-forge >= 1.3.1

**Recommended Alternatives**:
If cryptographic or ASN.1 functionality is needed, consider:
- `@peculiar/asn1-schema` - Modern ASN.1 parser
- `asn1js` - Pure JavaScript ASN.1 library
- Native Node.js crypto module

**References**:
- GitHub Advisory: https://github.com/advisories/GHSA-cfm4-qjh2-4765
- CVE-2024-48939: https://nvd.nist.gov/vuln/detail/CVE-2024-48939
- node-forge Repository: https://github.com/digitalbazaar/forge

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please follow these steps:

1. **Do not** open a public issue
2. Email security details to: admin@0379.email
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

**Response Timeline**:
- **Initial Response**: Within 48 hours
- **Status Update**: Weekly updates on investigation progress
- **Fix Timeline**: Critical issues within 7 days, High within 14 days, Medium within 30 days

**What to Expect**:
- **Accepted**: We will work on a fix and credit you in the security advisory
- **Declined**: We will provide reasoning if the issue is not considered a vulnerability

## Security Best Practices

### For Developers
1. Run `npm audit` before committing changes
2. Keep dependencies updated regularly
3. Review security scan results in CI/CD pipeline
4. Use environment variables for sensitive data
5. Follow secure coding practices outlined in CONTRIBUTING.md

### For Deployments
1. Use HTTPS for all communications
2. Enable rate limiting on API endpoints
3. Implement proper authentication and authorization
4. Regular security audits and penetration testing
5. Monitor logs for suspicious activities

## Security Scanning

This project uses multiple security scanning tools:
- **npm audit**: Dependency vulnerability scanning
- **ESLint Security Plugin**: Static code analysis
- **CodeQL**: Advanced security analysis
- **Semgrep**: Pattern-based security checks
- **Trivy**: Container scanning (when applicable)

See `.github/workflows/security-scan.yml` for details.
