# Fix EMFILE Error (Too Many Open Files)

This error occurs when macOS hits the file watching limit. Here are solutions:

## Quick Fix

1. **Install Watchman** (Recommended):
```bash
brew install watchman
```

2. **Clear Metro cache and restart**:
```bash
cd app
rm -rf node_modules/.cache
npx expo start --clear
```

3. **If still having issues, increase file descriptor limit**:
```bash
# Temporary (current session only)
ulimit -n 4096

# Permanent (add to ~/.zshrc)
echo 'ulimit -n 4096' >> ~/.zshrc
source ~/.zshrc
```

## Alternative: Use Watchman

Watchman is Facebook's file watching service that's much more efficient:

```bash
# Install watchman
brew install watchman

# Clear watchman cache
watchman watch-del-all

# Restart Expo
cd app
npx expo start --clear
```

## Check Current Limit

```bash
ulimit -n
```

If it shows a low number (like 256), increase it using the commands above.

## Note

The `.watchmanconfig` and `metro.config.js` files have been added to help reduce file watching overhead.



