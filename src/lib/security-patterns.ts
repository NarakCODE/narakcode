/**
 * Security patterns for detecting common attack attempts
 * These work on the URL/query string level (frontend-detectable attacks)
 */

// SQL Injection patterns
const SQL_INJECTION_PATTERNS = [
  /('|"|;|--|\/\*|\*\/|@@|@)/i,
  /(\s|%20|\+)*(OR|AND)(\s|%20|\+)*('|"|1|true)/i,
  /(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)/i,
  /(\s|%20|\+)*(FROM|INTO|WHERE|HAVING|GROUP BY|ORDER BY)/i,
  /(SLEEP|WAITFOR|DELAY|BENCHMARK)\s*\(/i,
  /CONCAT\s*\(/i,
  /CHAR\s*\(/i,
  /0x[0-9a-fA-F]+/,
];

// XSS patterns
const XSS_PATTERNS = [
  /<script[\s\S]*?>/i,
  /<\/script>/i,
  /javascript:/i,
  /on(load|error|click|mouse|focus|blur|key|submit|change|input)(\s)*=/i,
  /<img[\s\S]*?onerror/i,
  /<svg[\s\S]*?onload/i,
  /<iframe/i,
  /document\.(cookie|location|write)/i,
  /window\.(location|open)/i,
  /eval\s*\(/i,
  /alert\s*\(/i,
  /prompt\s*\(/i,
  /confirm\s*\(/i,
];

// Path traversal patterns
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//,
  /\.\.%2[fF]/,
  /\.\.%5[cC]/,
  /%2e%2e[%2f%5c]/i,
  /etc\/passwd/i,
  /windows\/system32/i,
  /boot\.ini/i,
];

// Common scanner/admin paths that attackers probe
const SCANNER_PATHS = [
  // WordPress
  /^\/wp-admin/i,
  /^\/wp-login/i,
  /^\/wp-content/i,
  /^\/wp-includes/i,
  /^\/wordpress/i,

  // PHP Admin tools
  /^\/phpmyadmin/i,
  /^\/phpMyAdmin/i,
  /^\/pma/i,
  /^\/myadmin/i,
  /^\/mysql/i,
  /^\/adminer/i,

  // Common admin paths
  /^\/admin$/i,
  /^\/administrator/i,
  /^\/manager/i,
  /^\/cpanel/i,
  /^\/plesk/i,

  // Config/sensitive files
  /^\/.env/i,
  /^\/.git/i,
  /^\/.svn/i,
  /^\/.htaccess/i,
  /^\/.htpasswd/i,
  /^\/config\.php/i,
  /^\/configuration\.php/i,
  /^\/wp-config/i,
  /^\/\.aws/i,
  /^\/\.ssh/i,

  // Backup files
  /\.bak$/i,
  /\.backup$/i,
  /\.old$/i,
  /\.orig$/i,
  /\.sql$/i,
  /\.zip$/i,
  /\.tar$/i,
  /\.gz$/i,

  // Shell/exploit paths
  /^\/(shell|c99|r57|wso|b374k)/i,
  /^\/(cmd|command|exec)/i,
  /^\/cgi-bin/i,
];

// Suspicious query parameter names
const SUSPICIOUS_PARAMS = [
  /^(cmd|exec|command|shell|bash|powershell)$/i,
  /^(file|path|dir|folder|document|doc)$/i,
  /^(include|require|load|read|fetch)$/i,
  /^(debug|test|admin|root)$/i,
];

export function detectSqlInjection(input: string): boolean {
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

export function detectXss(input: string): boolean {
  const decoded = decodeURIComponent(input);
  return XSS_PATTERNS.some((pattern) => pattern.test(decoded));
}

export function detectPathTraversal(input: string): boolean {
  const decoded = decodeURIComponent(input);
  return PATH_TRAVERSAL_PATTERNS.some((pattern) => pattern.test(decoded));
}

export function detectScannerPath(pathname: string): boolean {
  return SCANNER_PATHS.some((pattern) => pattern.test(pathname));
}

export function detectSuspiciousParams(params: URLSearchParams): boolean {
  for (const key of params.keys()) {
    if (SUSPICIOUS_PARAMS.some((pattern) => pattern.test(key))) {
      return true;
    }
  }
  return false;
}

export interface AttackDetectionResult {
  isAttack: boolean;
  type?:
    | "sql_injection"
    | "xss"
    | "path_traversal"
    | "scanner"
    | "suspicious_params";
  detail?: string;
}

export function detectAttack(url: URL): AttackDetectionResult {
  const pathname = url.pathname;
  const search = url.search;
  const fullUrl = pathname + search;

  // Check scanner paths first (fastest)
  if (detectScannerPath(pathname)) {
    return { isAttack: true, type: "scanner", detail: pathname };
  }

  // Check path traversal
  if (detectPathTraversal(fullUrl)) {
    return {
      isAttack: true,
      type: "path_traversal",
      detail: "Path traversal detected",
    };
  }

  // Check query parameters
  const params = url.searchParams;

  // Check for suspicious param names
  if (detectSuspiciousParams(params)) {
    return {
      isAttack: true,
      type: "suspicious_params",
      detail: "Suspicious parameter name",
    };
  }

  // Check each parameter value
  for (const [key, value] of params.entries()) {
    if (detectSqlInjection(value)) {
      return {
        isAttack: true,
        type: "sql_injection",
        detail: `SQL injection in ${key}`,
      };
    }
    if (detectXss(value)) {
      return { isAttack: true, type: "xss", detail: `XSS attempt in ${key}` };
    }
    if (detectPathTraversal(value)) {
      return {
        isAttack: true,
        type: "path_traversal",
        detail: `Path traversal in ${key}`,
      };
    }
  }

  return { isAttack: false };
}
