#!/bin/bash

# Kill any process already listening on port 3000, namely an earlier slideshow
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Start a new slideshow
cd /Users/jan/Source/montage
/usr/local/bin/node node_modules/@graphorigami/origami/src/cli/cli.js "serve graphVirtual(src), 3000"
