/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  // Conditionally enable static export for GitHub Pages
  ...(isGitHubPages && { output: 'export' }),
  
  // Base path for GitHub Pages (repo name)
  basePath: isGitHubPages ? '/community-allotment' : '',
  
  // Asset prefix for GitHub Pages
  assetPrefix: isGitHubPages ? '/community-allotment/' : '',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Trailing slash for better compatibility with static hosting
  trailingSlash: true,
  
  // Exclude API routes from static export build
  ...(isGitHubPages && {
    experimental: {
      // Skip typechecking and linting API routes in static export
    }
  }),
};

module.exports = nextConfig;
