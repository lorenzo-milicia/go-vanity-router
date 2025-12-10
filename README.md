# Go Vanity Router

A Cloudflare Worker that serves as both a Go vanity import server and a modern UI showcase for your Go projects. Built with [Hono](https://hono.dev/) for clean, maintainable routing.

## Features

- 🎯 **Go Vanity Imports**: Provides custom import paths for your Go packages
- 🎨 **Modern UI**: Beautiful, responsive interface showcasing repository details
- 📚 **Repository Listing**: Automatically displays all your public Go repositories
- 🔄 **Custom URL Mappings**: Map path prefixes to different GitHub repository prefixes
- 📊 **GitHub Integration**: Automatically fetches and displays repository stats
- 💾 **KV Caching**: Caches GitHub API responses for 1 hour to avoid rate limits
- ⚡ **Fast**: Powered by Cloudflare Workers edge network
- 🛠️ **Built with Hono**: Clean, type-safe routing framework

## Configuration

Edit `wrangler.toml` to configure your worker:

```toml
[vars]
# Your GitHub username or organization
GITHUB_USERNAME = "your-username"

# Your custom domain (e.g., "go.example.com")
CUSTOM_DOMAIN = "go.yourdomain.com"

# Custom URL mappings as colon-separated pairs
# Format: "path_prefix:repo_prefix:path_prefix2:repo_prefix2"
# Example: "libs/:go-lib-:/utils:go-util-"
URL_MAPPINGS = ""
```

### GitHub API Token (Optional)

To increase your GitHub API rate limit from 60 to 5000 requests/hour and enable access to private repositories:

**Local Development:**
1. Create a `.dev.vars` file (gitignored) in your project root:
   ```bash
   cp .dev.vars.example .dev.vars
   ```
2. Add your GitHub token:
   ```
   GITHUB_TOKEN=ghp_your_token_here
   ```
3. Generate a token at https://github.com/settings/tokens with `public_repo` scope

**Production Deployment:**
1. Add your token as a Cloudflare secret:
   ```bash
   npx wrangler secret put GITHUB_TOKEN
   ```
2. When prompted, paste your GitHub token (it won't be visible in the terminal)

The token is **optional** — without it, the worker uses unauthenticated GitHub API (60 requests/hour limit).

### URL Mappings Example

If you set `URL_MAPPINGS = "libs/:go-lib-:/utils:go-util-"`:
- Request to `/libs/http` → Routes to GitHub repo `go-lib-http`
- Request to `/utils/logger` → Routes to GitHub repo `go-util-logger`
- Request to `/myproject` → Routes to GitHub repo `myproject` (no mapping)

**Bug Fix**: The URL mapping now properly strips leading slashes to avoid double slashes in repository names (e.g., `/libs/checksum` correctly maps to `go-lib-checksum` instead of `go-lib-/checksum`).

## Usage

### Development

Start the local development server:

```bash
npm run dev
# or
wrangler dev
```

### Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
# or
wrangler deploy
```

## How It Works

1. **Home Page**: Fetches and displays all your public Go repositories from GitHub
2. **Go Vanity Imports**: Each package page adds `<meta name="go-import">` tags to enable custom import paths
3. **URL Mapping**: Transforms incoming paths based on configured mappings (fixed to handle slashes correctly)
4. **GitHub API**: Fetches repository information to display stats and details
5. **Modern UI**: Renders a professional interface with repository information
6. **Hono Framework**: Provides clean routing and middleware support

## Project Structure

```
src/
├── index.ts              # Main application with Hono routing
├── pages/
│   ├── home.ts          # Home page with repository listing
│   └── repo.ts          # Individual repository page
└── utils/
    ├── github.ts        # GitHub API integration with KV caching
    └── urlMappings.ts   # URL transformation logic (includes fix)
```

## GitHub API Caching

To avoid hitting GitHub's rate limits, the worker uses Cloudflare KV to cache API responses:

- **Cache Duration**: 1 hour (3600 seconds)
- **Cache Keys**: 
  - `repo:{username}/{reponame}` for individual repository data
  - `repos:{username}:go` for the list of Go repositories
- **Automatic**: Caching is transparent - first request fetches from GitHub, subsequent requests use cache until TTL expires

You can see cache hits/misses in the console logs when running locally.

## Example

With the domain `go.example.com` and repository `awesome-go-lib`:

```bash
go get go.example.com/awesome-go-lib
```

When users visit `https://go.example.com/awesome-go-lib` in a browser, they see:
- Repository description
- Installation instructions
- Star count, forks, and other stats
- Links to GitHub, issues, and documentation

## License

MIT
