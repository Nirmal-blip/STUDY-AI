# Quick Fix for EMFILE Error

## The Problem
You're getting `EMFILE: too many open files` because:
1. You might be in the wrong directory (`App` instead of `app`)
2. macOS file watching limits are too low
3. Watchman is not installed

## Solution (Run these commands):

```bash
# 1. Make sure you're in the correct directory (lowercase 'app')
cd /Users/shubhamjoshi/Desktop/notebook/app

# 2. Install watchman (if not installed)
brew install watchman

# 3. Increase file limit
ulimit -n 4096

# 4. Clear watchman cache
watchman watch-del-all

# 5. Clear Metro cache
rm -rf node_modules/.cache .expo

# 6. Start Expo
npx expo start --clear
```

## OR Use the Start Script:

```bash
cd /Users/shubhamjoshi/Desktop/notebook/app
./start.sh
```

## Make it Permanent:

Add to your `~/.zshrc`:
```bash
echo 'ulimit -n 4096' >> ~/.zshrc
source ~/.zshrc
```

## Verify:

```bash
# Check current limit
ulimit -n

# Should show 4096 or higher
```



