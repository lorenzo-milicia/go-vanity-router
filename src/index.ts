import { Hono } from 'hono';
import { renderHomePage } from './pages/home';
import { renderRepoPage } from './pages/repo';
import { parseURLMappings, applyURLMappings } from './utils/urlMappings';
import { fetchRepoInfo, fetchGoRepos } from './utils/github';

export interface Env {
  GITHUB_USERNAME: string;
  CUSTOM_DOMAIN: string;
  URL_MAPPINGS: string;
  GITHUB_CACHE: KVNamespace;
  GITHUB_TOKEN?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Static assets - return 404 to avoid querying GitHub API
app.get('/favicon.ico', (c) => c.notFound());
app.get('/robots.txt', (c) => c.notFound());
app.get('/.well-known/*', (c) => c.notFound());

// Home page - list all Go repositories
app.get('/', async (c) => {
  const env = c.env;
  const goRepos = await fetchGoRepos(env.GITHUB_USERNAME, env.GITHUB_CACHE, env.GITHUB_TOKEN);
  
  const html = renderHomePage({
    githubUsername: env.GITHUB_USERNAME,
    customDomain: env.CUSTOM_DOMAIN,
    repositories: goRepos,
  });
  
  return c.html(html);
});

// Package page - show specific repository
app.get('/*', async (c) => {
  const env = c.env;
  const path = c.req.path;
  
  // Parse URL mappings from environment
  const mappings = parseURLMappings(env.URL_MAPPINGS);
  
  // Apply URL mappings to get the actual repository name
  const repoName = applyURLMappings(path, mappings);
  
  // Fetch repository information from GitHub
  const repoInfo = await fetchRepoInfo(env.GITHUB_USERNAME, repoName, env.GITHUB_CACHE, env.GITHUB_TOKEN);
  
  // Generate and return HTML response
  const html = renderRepoPage({
    customDomain: env.CUSTOM_DOMAIN,
    path,
    repoName,
    githubUsername: env.GITHUB_USERNAME,
    repoInfo,
  });
  
  return c.html(html);
});

export default app;
