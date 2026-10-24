#!/usr/bin/env bash
# Downloads the device mockups (made with Higgsfield, stored in Doug's account)
# into assets/mockups/, so the deck works offline. Without them the deck still
# loads them from the CDN, and falls back to the flat screenshots if offline.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p assets/mockups
CDN="https://d2ol7oe51mr4n9.cloudfront.net/user_3IvZCcP0Hh0Iw00znaf8bruzl4p"
while read -r name id; do
  [ -z "$name" ] && continue
  curl -fsSL -o "assets/mockups/$name.jpg" "$CDN/$id.jpg" && echo "ok  $name"
done <<'LIST'
naowee-display-workspace 3bd30e97-d373-4978-a9ba-457f4bd63a82
naowee-ipad-review 4c0a210e-8776-4888-b061-ec73ed259505
naowee-macbook-ds 94261b16-3e47-4674-abb4-5ccb9c8f6983
occ-ipad-accounts 4d9815bd-1a1f-4035-b165-f1327d8c66c2
occ-iphone-card 291f0cc7-4639-4e5c-b24d-bf66b9e19763
dc-iphone-voice 79423053-04e3-4eb0-9774-1223ed136c80
dc-display-agenda bcf9c66c-1279-47bd-a081-9caaf9a0b031
dc-macbook-followup b417ddfe-f499-4612-8c75-da729e11c0b2
dc-ipad-permissions 0b5371cc-c515-4b39-af64-663031a20104
LIST
