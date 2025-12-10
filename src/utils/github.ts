export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  license: { name: string } | null;
  default_branch: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch repository information from GitHub API (with KV cache)
 */
export async function fetchRepoInfo(
  githubUsername: string,
  repoName: string,
  cache?: KVNamespace,
  token?: string
): Promise<GitHubRepo | null> {
  const cacheKey = `repo:${githubUsername}/${repoName}`;
  
  // Try to get from cache first
  if (cache) {
    try {
      const cached = await cache.get(cacheKey, 'json');
      if (cached) {
        console.log(`[gh] fetchRepoInfo: cache HIT for ${cacheKey}`);
        return cached as GitHubRepo;
      }
      console.log(`[gh] fetchRepoInfo: cache MISS for ${cacheKey}`);
    } catch (error) {
      console.warn(`[gh] fetchRepoInfo: cache read error:`, error);
    }
  }

  try {
    const url = `https://api.github.com/repos/${githubUsername}/${repoName}`;
    console.log(`[gh] fetchRepoInfo: requesting ${url}`);
    const headers: Record<string, string> = {
      'User-Agent': 'Cloudflare-Worker-Go-Vanity',
      'Accept': 'application/vnd.github.v3+json',
    };
    if (token) {
      headers['Authorization'] = `token ${token}`;
      console.log(`[gh] fetchRepoInfo: using GitHub token`);
    }
    const response = await fetch(url, { headers });

    console.log(`[gh] fetchRepoInfo: ${url} -> ${response.status}`);

    if (!response.ok) {
      console.warn(`[gh] fetchRepoInfo: non-ok response for ${url}: ${response.status}`);
      return null;
    }

    const data = (await response.json()) as GitHubRepo;
    console.log(`[gh] fetchRepoInfo: received repo ${githubUsername}/${repoName}`);
    
    // Store in cache with 1 hour TTL
    if (cache) {
      try {
        await cache.put(cacheKey, JSON.stringify(data), { expirationTtl: 3600 });
        console.log(`[gh] fetchRepoInfo: cached ${cacheKey} (TTL: 1h)`);
      } catch (error) {
        console.warn(`[gh] fetchRepoInfo: cache write error:`, error);
      }
    }
    
    return data;
  } catch (error) {
    console.error(`[gh] fetchRepoInfo: error fetching ${githubUsername}/${repoName}:`, error);
    return null;
  }
}

/**
 * Fetch all public Go repositories for a GitHub user (with KV cache)
 */
export async function fetchGoRepos(githubUsername: string, cache?: KVNamespace, token?: string): Promise<GitHubRepo[]> {
  const cacheKey = `repos:${githubUsername}:go`;
  
  // Try to get from cache first
  if (cache) {
    try {
      const cached = await cache.get(cacheKey, 'json');
      if (cached) {
        console.log(`[gh] fetchGoRepos: cache HIT for ${cacheKey}`);
        return cached as GitHubRepo[];
      }
      console.log(`[gh] fetchGoRepos: cache MISS for ${cacheKey}`);
    } catch (error) {
      console.warn(`[gh] fetchGoRepos: cache read error:`, error);
    }
  }

  try {
    // Fetch all public repositories
    const url = `https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`;
    console.log(`[gh] fetchGoRepos: requesting ${url}`);
    const headers: Record<string, string> = {
      'User-Agent': 'Cloudflare-Worker-Go-Vanity',
      'Accept': 'application/vnd.github.v3+json',
    };
    if (token) {
      headers['Authorization'] = `token ${token}`;
      console.log(`[gh] fetchGoRepos: using GitHub token`);
    }
    const response = await fetch(url, { headers });

    console.log(`[gh] fetchGoRepos: ${url} -> ${response.status}`);

    if (!response.ok) {
      console.warn(`[gh] fetchGoRepos: non-ok response for ${url}: ${response.status}`);
      return [];
    }

    const repos = (await response.json()) as GitHubRepo[];
    console.log(`[gh] fetchGoRepos: fetched ${repos.length} repos for ${githubUsername}`);
    
    // Filter for Go repositories (language is Go)
    const goRepos = repos.filter((repo) => repo.language === 'Go');
    console.log(`[gh] fetchGoRepos: ${goRepos.length} Go repos after filtering`);
    
    // Store in cache with 1 hour TTL
    if (cache) {
      try {
        await cache.put(cacheKey, JSON.stringify(goRepos), { expirationTtl: 3600 });
        console.log(`[gh] fetchGoRepos: cached ${cacheKey} (TTL: 1h)`);
      } catch (error) {
        console.warn(`[gh] fetchGoRepos: cache write error:`, error);
      }
    }
    
    return goRepos;
  } catch (error) {
    console.error(`[gh] fetchGoRepos: error fetching repos for ${githubUsername}:`, error);
    return [];
  }
}
