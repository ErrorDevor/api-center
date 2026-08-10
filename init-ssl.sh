#!/bin/bash
set -e

DOMAINS=("bestaiprice.com" "www.bestaiprice.com")
# The gateway is served at bestaiprice.com/gateway (see nginx/conf.d),
# not a separate subdomain, so no extra domain is needed here.
EMAIL="" # Add your email here or leave empty for unassigned

echo "=========================================="
echo "Initializing SSL Certificates for Docker"
echo "Domains: ${DOMAINS[*]}"
echo "=========================================="

# Create temporary dummy certificates so Nginx can start
echo "[1/5] Creating temporary SSL certificates..."
docker compose run --rm --entrypoint "\
  sh -c 'mkdir -p /etc/letsencrypt/live/bestaiprice.com && \
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
      -keyout /etc/letsencrypt/live/bestaiprice.com/privkey.pem \
      -out /etc/letsencrypt/live/bestaiprice.com/fullchain.pem \
      -subj /CN=localhost'" certbot

echo "[2/5] Starting Nginx container..."
docker compose up -d nginx

# Nginx has the dummy cert loaded in memory now, so it's safe to remove the
# files from disk. Certbot refuses to issue into a "live" dir it didn't
# create itself (no matching archive/renewal metadata), so it must go first.
echo "[3/5] Removing temporary certificates..."
docker compose run --rm --entrypoint "\
  sh -c 'rm -rf /etc/letsencrypt/live/bestaiprice.com \
    /etc/letsencrypt/archive/bestaiprice.com \
    /etc/letsencrypt/renewal/bestaiprice.com.conf'" certbot

echo "[4/5] Requesting Let's Encrypt certificate..."
DOMAIN_ARGS=""
for d in "${DOMAINS[@]}"; do
  DOMAIN_ARGS="$DOMAIN_ARGS -d $d"
done

EMAIL_ARG="--register-unsafely-without-email"
if [ -n "$EMAIL" ]; then
  EMAIL_ARG="--email $EMAIL"
fi

# Request real certs
docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $EMAIL_ARG \
    $DOMAIN_ARGS \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot

echo "[5/5] Reloading Nginx with real SSL certificates..."
docker compose exec nginx nginx -s reload

echo "=========================================="
echo "SSL Certificates successfully installed!"
echo "=========================================="
