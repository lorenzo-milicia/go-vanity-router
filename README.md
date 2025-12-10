# Go Vanity Router

A Cloudflare Worker that serves as both a Go vanity import server and a modern UI showcase for your Go projects.

## Features

- 🎯 **Go Vanity Imports**: Provides custom import paths for your Go packages
- 🎨 **Modern UI**: Beautiful, responsive interface showcasing repository details
- 🔄 **Custom URL Mappings**: Map path prefixes to different GitHub repository prefixes
- 📊 **GitHub Integration**: Automatically fetches and displays repository stats
- ⚡ **Fast**: Powered by Cloudflare Workers edge network

## Configuration

Edit `wrangler.toml` to configure your worker:

```toml
[vars]
# Your GitHub username or organization
GITHUB_USERNAME = "your-username"

# Your custom domain (e.g., "go.example.com")
CUSTOM_DOMAIN = "go.example.com"

# Custom URL mappings as colon-separated pairs
# Format: "/path1:repo-prefix1:/path2:repo-prefix2"
# Example: "/libs:go-lib-:/utils:go-util-"
URL_MAPPINGS = "/libs:go-lib-"
```

### URL Mappings Example

If you set `URL_MAPPINGS = "/libs:go-lib-:/utils:go-util-"`:
- Request to `/libs/http` → Routes to GitHub repo `go-lib-http`
- Request to `/utils/logger` → Routes to GitHub repo `go-util-logger`
- Request to `/myproject` → Routes to GitHub repo `myproject` (no mapping)

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

1. **Go Vanity Imports**: The worker adds `<meta name="go-import">` tags to enable custom import paths
2. **URL Mapping**: Transforms incoming paths based on configured mappings
3. **GitHub API**: Fetches repository information to display stats and details
4. **Modern UI**: Renders a professional interface with repository information

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
