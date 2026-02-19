#!/bin/sh
set -e

# Generate config.js with current environment variables or defaults
echo "Generating runtime config.js..."
cat <<EOF > /usr/share/nginx/html/config.js
window.env = {
  VITE_API_URL: "${VITE_API_URL:-https://aimall-backend-743928421487.asia-south1.run.app/api}",
  VITE_BASE_URL: "${VITE_BASE_URL:-https://aimall-743928421487.asia-south1.run.app}"
};
EOF

exec "$@"
