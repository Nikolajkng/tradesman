#!/bin/bash

echo "Cleaning cache .next folder..."
rm -rf .next
sleep 1

echo "Starting ngrok tunnel in a new window..."
# Launch ngrok first in its own window
gnome-terminal -- ngrok http 3000

echo "Starting localhost server here..."
# Now start the server in this window
npm run dev