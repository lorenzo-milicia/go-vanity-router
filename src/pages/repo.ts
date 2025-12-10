import { GitHubRepo } from '../utils/github';

interface RepoPageProps {
  customDomain: string;
  path: string;
  repoName: string;
  githubUsername: string;
  repoInfo: GitHubRepo | null;
}

export function renderRepoPage({
  customDomain,
  path,
  repoName,
  githubUsername,
  repoInfo,
}: RepoPageProps): string {
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
    
    .breadcrumb {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.15);
      padding: 0.5rem 1rem;
      border-radius: 6px;
      margin-top: 1rem;
      font-size: 0.9rem;
    }
    
    .breadcrumb a {
      color: white;
      text-decoration: none;
      font-weight: 600;
    }
    
    .breadcrumb a:hover {
      text-decoration: underline;
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
    
    .error-message {
      background: #fff5f5;
      border-left: 4px solid #fc8181;
      padding: 1rem;
      border-radius: 4px;
      color: #c53030;
      margin-top: 1rem;
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
      <div class="breadcrumb">
        <a href="/">← Back to all packages</a>
      </div>
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
      ` : `
        <div class="section">
          <div class="error-message">
            ⚠️ Repository not found or not accessible. The repository <strong>${repoName}</strong> may not exist 
            or may be private.
          </div>
        </div>
      `}
      
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
