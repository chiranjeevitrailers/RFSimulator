#!/usr/bin/env bash
# deep_check_5glabx.sh
# Run from project root. Outputs human-readable diagnostics to stdout.

echo "==== 5GLabX DEEP CHECK REPORT ===="
echo "Date: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo

# 1) Search for references to 5glabx and simple.html in repo
echo "1) Grep for 5glabx/simple.html references"
grep -RIn --binary-files=without-match "5glabx\|simple.html" . || true
echo "---- end grep ----"
echo

# 2) List public/ and public/5glabx if exists
echo "2) Listing public/ and public/5glabx"
if [ -d "public" ]; then
  ls -la public | sed -n '1,200p'
  echo
  if [ -d "public/5glabx" ]; then
    echo "public/5glabx contents:"
    ls -la public/5glabx
  else
    echo "public/5glabx NOT FOUND"
  fi
else
  echo "public/ directory NOT FOUND"
fi
echo

# 3) Check .next build/static (if you have a previous build)
echo "3) Checking .next (previous build output) for 5glabx"
if [ -d ".next" ]; then
  find .next -type f -name "*5glabx*" -o -name "*simple.html*" 2>/dev/null || echo "no files matching 5glabx/simple.html in .next"
else
  echo ".next directory not present (no local build found)"
fi
echo

# 4) Print next.config.js rewrites/redirects/headers if exists
echo "4) next.config.js content (if present)"
if [ -f "next.config.js" ]; then
  sed -n '1,240p' next.config.js
else
  echo "next.config.js NOT FOUND"
fi
echo

# 5) Netlify / Vercel config checks
echo "5) Netlify/Vercel config files"
[ -f "netlify.toml" ] && echo "netlify.toml exists: (showing content)" && sed -n '1,240p' netlify.toml || echo "no netlify.toml"
[ -f "_redirects" ] && echo "_redirects exists: (showing content)" && sed -n '1,240p' _redirects || echo "no _redirects"
[ -f "vercel.json" ] && echo "vercel.json exists: (showing content)" && sed -n '1,240p' vercel.json || echo "no vercel.json"
echo

# 6) Check for env usage NEXT_PUBLIC_5GLABX_URL in repo
echo "6) Search for NEXT_PUBLIC_5GLABX_URL usage"
grep -RIn --binary-files=without-match "NEXT_PUBLIC_5GLABX_URL" . || true
echo

# 7) Check for components/subscriptions/Subscribed5glabx.* (common location)
echo "7) Check for components/subscriptions/Subscribed5glabx.*"
find . -type f -regex ".*Subscribed5glabx\..*" -print -maxdepth 6 || echo "no Subscribed5glabx file found (by name)"
echo

# 8) Search project for any iframe tags
echo "8) Search for '<iframe' across repo"
grep -RIn --binary-files=without-match "<iframe" . || true
echo

# 9) Check for server headers or CSP in next.config.js or middleware
echo "9) Search for 'Content-Security-Policy' 'X-Frame-Options' or headers in middleware"
grep -RIn --binary-files=without-match "Content-Security-Policy\|X-Frame-Options\|frame-ancestors\|headers" . || true
echo

# 10) Suggest browser checks to do (printed to output)
echo "10) Manual browser checks you should run now (not automated):"
echo " - Open the user dashboard and the 5GLabX tab, open DevTools -> Console/Network."
echo " - Check Network tab for request to /5glabx/simple.html (status code)."
echo " - If request returns 404 -> static missing. If blocked -> check response headers for X-Frame-Options or CSP frame-ancestors."
echo " - Check console for CORS/CSP/Refused to display error."
echo

# 11) Show package.json scripts for build/deploy
echo "11) package.json scripts (build/dev)"
if [ -f "package.json" ]; then
  node -e "console.log(require('./package.json').scripts || {})"
else
  echo "package.json not found"
fi
echo

# 12) Show permission issues for public/5glabx if exists
if [ -d "public/5glabx" ]; then
  echo "12) File permissions for public/5glabx:"
  ls -la public/5glabx
else
  echo "12) Skipped: public/5glabx does not exist"
fi
echo

echo "==== END OF REPORT ===="