export interface Env {
  GITHUB_USERNAME: string;
  CUSTOM_DOMAIN: string;
  URL_MAPPINGS: string;
}

interface URLMapping {
  pathPrefix: string;
  repoPrefix: string;
}

/**
 * Parse URL mappings from environment variable
 * Format: "/libs:go-lib-:/utils:go-util-"
 */
function parseURLMappings(mappingsStr: string): URLMapping[] {
  if (!mappingsStr || mappingsStr.trim() === '') {
    return [];
  }

  const parts = mappingsStr.split(':');
  const mappings: URLMapping[] = [];

  for (let i = 0; i < parts.length; i += 2) {
    if (i + 1 < parts.length) {
      mappings.push({
        pathPrefix: parts[i],
        repoPrefix: parts[i + 1],
      });
    }
  }

  return mappings;
}

/**
 * Apply URL mappings to transform path to repo name
 */
function applyURLMappings(path: string, mappings: URLMapping[]): string {
  for (const mapping of mappings) {
    if (path.startsWith(mapping.pathPrefix)) {
      // Remove the path prefix and add repo prefix
      const remainder = path.substring(mapping.pathPrefix.length);
      return mapping.repoPrefix + remainder;
    }
  }
  // No mapping found, return path as-is (without leading slash)
  return path.startsWith('/') ? path.substring(1) : path;
}

/**
 * Fetch repository information from GitHub API
 */
async function fetchRepoInfo(githubUsername: string, repoName: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}`, {
      headers: {
        'User-Agent': 'Cloudflare-Worker-Go-Vanity',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

/**
 * Generate HTML page for Go vanity import and UI showcase
 */
function generateHTML(
  customDomain: string,
  path: string,
  repoName: string,
  githubUsername: string,
  repoInfo: any
): string {
  const importPath = `${customDomain}${path}`;
  const repoURL = `https://github.com/${githubUsername}/${repoName}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="go-import" content="${importPath} git ${repoURL}">
  <meta name="go-source" content="${importPath} ${repoURL} ${repoURL}/tree/main{/dir} ${repoURL}/blob/main{/dir}/{file}#L{line}">
  <title>${repoName} - Go Package</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 2rem;
      text-align: center;
    }
    
    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }
    
    .header p {
      font-size: 1.1rem;
      opacity: 0.95;
    }
    
    .content {
      padding: 2rem;
    }
    
    .section {
      margin-bottom: 2rem;
    }
    
    .section h2 {
      color: #667eea;
      margin-bottom: 1rem;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .section h2::before {
      content: '▶';
      font-size: 0.8rem;
    }
    
    .code-block {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9rem;
      overflow-x: auto;
      position: relative;
    }
    
    .code-block code {
      color: #2d3748;
    }
    
    .copy-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.4rem 0.8rem;
      cursor: pointer;
      font-size: 0.8rem;
      transition: background 0.2s;
    }
    
    .copy-btn:hover {
      background: #5568d3;
    }
    
    .copy-btn:active {
      background: #4c51bf;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .stat-card {
      background: #f7fafc;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    
    .stat-card .value {
      font-size: 1.8rem;
      font-weight: bold;
      color: #667eea;
    }
    
    .stat-card .label {
      font-size: 0.9rem;
      color: #718096;
      margin-top: 0.25rem;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
    }
    
    .info-item .label {
      font-size: 0.85rem;
      color: #718096;
      margin-bottom: 0.25rem;
    }
    
    .info-item .value {
      font-weight: 600;
      color: #2d3748;
    }
    
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.2s;
      box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
    }
    
    .btn:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
    }
    
    .btn-secondary {
      background: #48bb78;
      box-shadow: 0 4px 6px rgba(72, 187, 120, 0.3);
    }
    
    .btn-secondary:hover {
      background: #38a169;
      box-shadow: 0 6px 12px rgba(72, 187, 120, 0.4);
    }
    
    .description {
      background: #f7fafc;
      border-left: 4px solid #667eea;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
      font-style: italic;
      color: #4a5568;
    }
    
    .footer {
      background: #f7fafc;
      padding: 1.5rem 2rem;
      text-align: center;
      color: #718096;
      font-size: 0.9rem;
      border-top: 1px solid #e2e8f0;
    }
    
    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }
      
      .header h1 {
        font-size: 2rem;
      }
      
      .content {
        padding: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 ${repoName}</h1>
      <p>Go Package by @${githubUsername}</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2>Installation</h2>
        <div class="code-block">
          <button class="copy-btn" onclick="copyToClipboard('go get ${importPath}')">Copy</button>
          <code>go get ${importPath}</code>
        </div>
      </div>
      
      ${repoInfo ? `
      ${repoInfo.description ? `
      <div class="section">
        <h2>About</h2>
        <div class="description">
          ${repoInfo.description}
        </div>
      </div>
      ` : ''}
      
      <div class="section">
        <h2>Repository Stats</h2>
        <div class="stats">
          <div class="stat-card">
            <div class="value">⭐ ${repoInfo.stargazers_count || 0}</div>
            <div class="label">Stars</div>
          </div>
          <div class="stat-card">
            <div class="value">🔀 ${repoInfo.forks_count || 0}</div>
            <div class="label">Forks</div>
          </div>
          <div class="stat-card">
            <div class="value">👁️ ${repoInfo.watchers_count || 0}</div>
            <div class="label">Watchers</div>
          </div>
          ${repoInfo.open_issues_count !== undefined ? `
          <div class="stat-card">
            <div class="value">🐛 ${repoInfo.open_issues_count}</div>
            <div class="label">Open Issues</div>
          </div>
          ` : ''}
        </div>
      </div>
      
      <div class="section">
        <h2>Repository Details</h2>
        <div class="info-grid">
          ${repoInfo.language ? `
          <div class="info-item">
            <div class="label">Primary Language</div>
            <div class="value">${repoInfo.language}</div>
          </div>
          ` : ''}
          ${repoInfo.license ? `
          <div class="info-item">
            <div class="label">License</div>
            <div class="value">${repoInfo.license.name}</div>
          </div>
          ` : ''}
          ${repoInfo.default_branch ? `
          <div class="info-item">
            <div class="label">Default Branch</div>
            <div class="value">${repoInfo.default_branch}</div>
          </div>
          ` : ''}
          ${repoInfo.created_at ? `
          <div class="info-item">
            <div class="label">Created</div>
            <div class="value">${new Date(repoInfo.created_at).toLocaleDateString()}</div>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      <div class="section">
        <h2>Quick Links</h2>
        <div class="links">
          <a href="${repoURL}" class="btn" target="_blank">
            📦 View on GitHub
          </a>
          <a href="${repoURL}/issues" class="btn btn-secondary" target="_blank">
            🐛 Report Issue
          </a>
          <a href="https://pkg.go.dev/${importPath}" class="btn btn-secondary" target="_blank">
            📚 Documentation
          </a>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Powered by Cloudflare Workers • Go Vanity Router</p>
    </div>
  </div>
  
  <script>
    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      });
    }
  </script>
</body>
</html>`;
}

/**
 * Main worker handler
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Root path - show index/landing page
    if (path === '/' || path === '') {
      return new Response(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Go Packages - ${env.GITHUB_USERNAME}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .container {
      max-width: 800px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 3rem;
      text-align: center;
    }
    
    h1 {
      font-size: 3rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
    }
    
    .subtitle {
      font-size: 1.3rem;
      color: #718096;
      margin-bottom: 2rem;
    }
    
    .description {
      font-size: 1.1rem;
      color: #4a5568;
      margin-bottom: 2rem;
      line-height: 1.8;
    }
    
    .code-example {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 1rem;
      text-align: left;
      margin: 2rem 0;
    }
    
    .github-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.2s;
      box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
      margin-top: 1rem;
    }
    
    .github-link:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎯 Go Packages</h1>
    <div class="subtitle">by @${env.GITHUB_USERNAME}</div>
    <div class="description">
      Welcome! This is a Go vanity import server. Browse packages by navigating to their import paths,
      or visit the GitHub profile to see all available repositories.
    </div>
    <div class="code-example">
      <div style="color: #718096; margin-bottom: 0.5rem;">Example usage:</div>
      <code style="color: #2d3748;">go get ${env.CUSTOM_DOMAIN}/your-package-name</code>
    </div>
    <a href="https://github.com/${env.GITHUB_USERNAME}" class="github-link" target="_blank">
      📦 View GitHub Profile
    </a>
  </div>
</body>
</html>`,
        {
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
          },
        }
      );
    }

    // Parse URL mappings from environment
    const mappings = parseURLMappings(env.URL_MAPPINGS);

    // Apply URL mappings to get the actual repository name
    const repoName = applyURLMappings(path, mappings);

    // Fetch repository information from GitHub
    const repoInfo = await fetchRepoInfo(env.GITHUB_USERNAME, repoName);

    // Generate and return HTML response
    const html = generateHTML(env.CUSTOM_DOMAIN, path, repoName, env.GITHUB_USERNAME, repoInfo);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    });
  },
};
