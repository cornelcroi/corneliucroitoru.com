#!/bin/sh
# Share card (1200x630, the size LinkedIn, X, Slack and WhatsApp expect) and icons.
# Rerun when the hero photo, the name or the role changes: sh scripts/make_share_images.sh
set -e
cd "$(dirname "$0")/.."

PHOTO=src/content/photos/honfleur-at-night/01.jpg
SERIF_BOLD="/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SERIF="/System/Library/Fonts/Supplemental/Georgia.ttf"

magick "$PHOTO" -resize 1200x630^ -gravity center -extent 1200x630 \
  \( -size 1200x630 gradient:"rgba(10,12,16,0.05)-rgba(10,12,16,0.85)" \) -composite \
  -gravity southwest -fill white \
  -font "$SERIF_BOLD" -pointsize 64 -annotate +72+150 "Corneliu Croitoru" \
  -font "$SERIF" -pointsize 34 -fill "rgba(255,255,255,0.9)" -annotate +72+96 "AI Architect & Product Builder" \
  -pointsize 24 -fill "rgba(255,255,255,0.7)" -annotate +72+52 "CorneliuCroitoru.com" \
  -strip -quality 85 public/og/default.jpg

# Article covers are 1000x420 (dev.to's shape); link previews crop anything wider than 1.91:1.
# Each cover is fitted whole into 1200x630, the margin filled with the cover's own paper colour.
mkdir -p public/og/writing
for cover in public/covers/*.png; do
  slug=$(basename "$cover" .png)
  paper=$(magick "$cover" -format "%[pixel:p{3,3}]" info:)
  magick "$cover" -resize 1200x630 -background "$paper" -gravity center -extent 1200x630 \
    -strip -quality 88 "public/og/writing/$slug.jpg"
done

magick -background none -density 384 public/favicon.svg -resize 180x180 public/apple-touch-icon.png
magick -background none -density 384 public/favicon.svg -define icon:auto-resize=48,32,16 public/favicon.ico
echo "public/og/default.jpg, public/og/writing/*.jpg, public/apple-touch-icon.png, public/favicon.ico"
