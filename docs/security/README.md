# Security Documentation

This directory contains security-related documentation for the YYC3 Admin System.

## 📄 Documents

### [NODE_FORGE_VULNERABILITY_REPORT.md](./NODE_FORGE_VULNERABILITY_REPORT.md)

Comprehensive report on the node-forge ASN.1 validator vulnerability (CVE-2024-48939).

**Status**: ✅ MITIGATED

**Key Points**:
- Node-forge is not currently used in the project
- Preventive measures have been implemented
- Security scanning and monitoring in place

## 🔒 Security Measures Implemented

### 1. Package.json Overrides

The `package.json` file includes overrides to force safe versions of node-forge if it's ever added:

```json
{
  "overrides": {
    "node-forge": ">=1.3.1"
  }
}
```

### 2. NPM Configuration

The `.npmrc` file is configured with security best practices:
- Audit enabled during install
- Audit level set to moderate
- HTTPS registry enforced
- Strict SSL enabled

### 3. Automated Testing

Security tests are automatically run to detect node-forge:

```bash
# Run security test
npm run test:security:node-forge

# Run vulnerability check script
npm run security:check-node-forge

# Run full security audit
npm run security:audit
```

### 4. CI/CD Integration

The security-scan GitHub workflow includes node-forge vulnerability checks that run:
- On every push to main/develop branches
- On pull requests to main
- Daily at 2 AM (scheduled)

### 5. Monitoring and Scanning

Multiple layers of security scanning:
- **npm audit**: Dependency vulnerability scanning
- **Custom Script**: Node-forge specific checks
- **CodeQL**: Advanced security analysis
- **ESLint**: Security-focused linting rules
- **Semgrep**: Pattern-based security checks

## 🛡️ How to Use

### For Developers

1. **Before committing code**:
   ```bash
   npm run security:audit
   ```

2. **Run security tests**:
   ```bash
   npm run test:security:node-forge
   ```

3. **Check for vulnerabilities**:
   ```bash
   npm audit
   npm run security:check-node-forge
   ```

### For CI/CD

The security checks are automatically run in GitHub Actions. Check the workflow results:

1. Go to the repository's Actions tab
2. Look for "Security Scan" workflow
3. Review the results for any issues

### Adding New Dependencies

When adding new dependencies:

1. Run `npm audit` after installation
2. Check if the dependency introduces node-forge
3. Review security scan results
4. Document any security considerations

## 📊 Security Testing

### Test Coverage

The security test suite covers:

- ✅ Direct dependency check
- ✅ Transitive dependency tree check
- ✅ Package-lock.json verification
- ✅ Override configuration check
- ✅ NPM configuration check
- ✅ Codebase scanning for imports
- ✅ NPM audit for vulnerabilities

### Running Tests

```bash
# Run node-forge security tests
npm run test:security:node-forge

# Run vulnerability check script
npm run security:check-node-forge

# Run full security audit
npm run security:audit
```

## 🚨 What to Do If Node-forge Is Detected

If node-forge is detected in the dependency tree:

1. **Identify the source**:
   ```bash
   npm ls node-forge
   ```

2. **Check the version**:
   - If version >= 1.3.1: Safe version (overrides working)
   - If version < 1.3.1: Vulnerable version (action required)

3. **For vulnerable versions**:
   ```bash
   # Remove the package that depends on node-forge
   npm uninstall <package-name>
   
   # Or update to a version that uses safe node-forge
   npm update <package-name>
   ```

4. **Consider alternatives**:
   - Native Node.js crypto module
   - `@peculiar/asn1-schema`
   - `asn1js`

5. **Update package-lock.json**:
   ```bash
   npm install
   ```

6. **Verify the fix**:
   ```bash
   npm run security:audit
   ```

## 📚 Additional Resources

- [Main Security Policy](../../SECURITY.md)
- [Node-forge Vulnerability Report](./NODE_FORGE_VULNERABILITY_REPORT.md)
- [GitHub Security Advisory](https://github.com/advisories/GHSA-cfm4-qjh2-4765)
- [CVE-2024-48939](https://nvd.nist.gov/vuln/detail/CVE-2024-48939)

## 🔄 Regular Security Maintenance

### Weekly
- Review security scan results from CI/CD
- Check for new security advisories

### Monthly
- Run comprehensive security audit
- Update dependencies with security patches
- Review and update security documentation

### Quarterly
- Full security assessment
- Penetration testing (if applicable)
- Review and update security policies

## 📞 Contact

For security concerns or vulnerability reports:

- **Email**: admin@0379.email
- **Response Time**: Within 48 hours
- **Private Disclosure**: Do not open public issues for security vulnerabilities

---

**Last Updated**: 2025-12-14  
**Maintained By**: YYC³ Security Team
