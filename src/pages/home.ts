import { GitHubRepo } from '../utils/github';
import { URLMapping, reverseApplyURLMappings } from '../utils/urlMappings';

interface HomePageProps {
  githubUsername: string;
  customDomain: string;
  repositories: GitHubRepo[];
  mappings?: URLMapping[];
}

export function renderHomePage({ githubUsername, customDomain, repositories, mappings }: HomePageProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Go Packages - ${githubUsername}</title>
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
      max-width: 1200px;
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
    
    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }
    
    .subtitle {
      font-size: 1.3rem;
      opacity: 0.95;
      margin-bottom: 1.5rem;
    }
    
    .description {
      font-size: 1.1rem;
      opacity: 0.9;
      max-width: 700px;
      margin: 0 auto 2rem;
      line-height: 1.7;
    }
    
    .code-example {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      padding: 1rem 1.5rem;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.95rem;
      text-align: left;
      max-width: 600px;
      margin: 0 auto;
      backdrop-filter: blur(10px);
    }
    
    .code-example code {
      color: white;
    }
    
    .content {
      padding: 2rem;
    }
    
    .section-title {
      font-size: 2rem;
      color: #667eea;
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: 700;
    }
    
    .repos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .repo-card {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      transition: all 0.3s;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
    }
    
    .repo-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
      border-color: #667eea;
    }
    
    .repo-name {
      font-size: 1.3rem;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 0.5rem;
      word-break: break-word;
    }
    
    .repo-description {
      color: #718096;
      font-size: 0.95rem;
      margin-bottom: 1rem;
      flex-grow: 1;
      line-height: 1.5;
    }
    
    .repo-stats {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #718096;
      flex-wrap: wrap;
    }
    
    .stat {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
    
    .repo-links {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    
    .repo-link {
      flex: 1;
      min-width: 100px;
      text-align: center;
      padding: 0.6rem 1rem;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
      display: inline-block;
    }
    
    .repo-link:hover {
      background: #5568d3;
      transform: translateY(-1px);
    }
    
    .repo-link.secondary {
      background: #48bb78;
    }
    
    .repo-link.secondary:hover {
      background: #38a169;
    }
    
    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      color: #718096;
    }
    
    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #4a5568;
    }
    
    .github-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: white;
      color: #667eea;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 1.1rem;
      transition: all 0.2s;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin-top: 1rem;
    }
    
    .github-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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
      
      h1 {
        font-size: 2rem;
      }
      
      .header {
        padding: 2rem 1.5rem;
      }
      
      .content {
        padding: 1.5rem;
      }
      
      .repos-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Go Packages</h1>
      <div class="subtitle">by @${githubUsername}</div>
      <div class="description">
        Welcome! This is a Go vanity import server. Browse available packages below
        or use the custom import paths to get started with any package.
      </div>
      <div class="code-example">
        <div style="opacity: 0.8; margin-bottom: 0.5rem;">Example usage:</div>
        <code>go get ${customDomain}/package-name</code>
      </div>
      <a href="https://github.com/${githubUsername}" class="github-link" target="_blank">
        📦 View GitHub Profile
      </a>
    </div>
    
    <div class="content">
      ${repositories.length > 0 ? `
        <h2 class="section-title">📚 Available Go Packages (${repositories.length})</h2>
        <div class="repos-grid">
          ${repositories.map(repo => {
            const pkgPath = mappings && mappings.length ? reverseApplyURLMappings(repo.name, mappings) : `/${repo.name}`;
            return `
              <div class="repo-card">
                <div class="repo-name">${repo.name}</div>
                ${repo.description ? `
                  <div class="repo-description">${repo.description}</div>
                ` : ''}
                <div class="repo-stats">
                  <span class="stat">⭐ ${repo.stargazers_count}</span>
                  <span class="stat">🔀 ${repo.forks_count}</span>
                  ${repo.license ? `<span class="stat">📜 ${repo.license.name}</span>` : ''}
                </div>
                <div class="repo-links">
                  <a href="${pkgPath}" class="repo-link">View Package</a>
                  <a href="${repo.html_url}" class="repo-link secondary" target="_blank">GitHub</a>
                </div>
              </div>
            `
          }).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <h3>No Go Repositories Found</h3>
          <p>There are currently no public Go repositories available.</p>
          <a href="https://github.com/${githubUsername}" class="github-link" target="_blank">
            Visit GitHub Profile
          </a>
        </div>
      `}
    </div>
    
    <div class="footer">
      <p>Powered by Cloudflare Workers • Go Vanity Router</p>
    </div>
  </div>
</body>
</html>`;
}
