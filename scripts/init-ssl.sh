#!/usr/bin/env bash
# Bootstrap inicial de certificados Let's Encrypt.
# Ejecutar UNA SOLA VEZ en el VPS antes del primer "docker compose up".
#
# Uso:
#   CERTBOT_EMAIL=tu@email.com bash scripts/init-ssl.sh
#
# Requisitos: Docker instalado y puertos 80/443 libres.
set -euo pipefail

EMAIL="${CERTBOT_EMAIL:-admin@norwestds.com}"
DOMAINS=("api.norwestds.com" "crm.norwestds.com")
CERTS_VOLUME="norwestds_certbot-certs"

# Asegurar que el volumen compartido con docker compose exista
docker volume create "$CERTS_VOLUME" >/dev/null 2>&1 || true

echo "==> Emitiendo certificados SSL (standalone)..."
for DOMAIN in "${DOMAINS[@]}"; do
  echo "  → $DOMAIN"
  docker run --rm \
    -p 80:80 \
    -v "${CERTS_VOLUME}:/etc/letsencrypt" \
    certbot/certbot certonly \
      --standalone \
      -d "$DOMAIN" \
      --email "$EMAIL" \
      --agree-tos \
      --non-interactive
done

echo ""
echo "==> Levantando servicios..."
docker compose up -d

echo ""
echo "==> Listo. Accesos:"
echo "    https://api.norwestds.com/health"
echo "    https://crm.norwestds.com"
