# Cardcaptor Sakura Gesture Card Draw

An interactive Cardcaptor Sakura themed card drawing website. The page uses a soft pink Sakura-style background, animated card flow, local card artwork, gesture-controlled selection, rarity effects, draw sound effects, and background music.

## Theme

The project is designed around a magical girl card draw experience inspired by Cardcaptor Sakura:

- Pink and white Sakura visual style
- Sakura card back design
- Magical circle background
- Star, wing, wand, moon, and petal motifs
- Local card image library for draw results
- Different visual and audio feedback for `R`, `SR`, and `SSR` cards

## Interaction

The website supports camera-based hand interaction through MediaPipe Hands.

- Point with the index finger to control the Sakura-style cursor.
- Hover over a visible card to select it.
- The selected card floats upward and emits white particles.
- Pinch with thumb and index finger to draw the selected card.
- The selected card flips, then reveals a random local card image.
- Release after the card is revealed to let it disperse into particles.
- Swipe left or right when not selecting a card to move the card row.

Mouse and touch fallback is also supported:

- Move the pointer to control the cursor.
- Press/click on a selected card to draw.
- Release after reveal to disperse the card.

## Card Library

The draw result is selected from the local card library:

```text
assets/cards/cards.json
assets/cards/*.jpg
```

Cards are grouped by rarity:

- `SSR`: high-impact cards such as The Light, The Dark, The Time, and The Return
- `SR`: elemental and stronger utility cards such as The Firey, The Watery, The Windy, The Earthy, The Thunder, The Wood, The Shield, and The Sword
- `R`: lighter cards such as The Flower, The Fly, The Jump, The Mirror, The Glow, The Sweet, The Dash, and others

The card images were collected from Cardcaptor Sakura card image references on the Cardcaptor Sakura Wiki/Fandom and converted into local project assets.

## Audio

The project includes local audio assets:

```text
assets/audio/bgm.ogg
assets/audio/sounds.json
assets/audio/*
```

Audio behavior:

- Background music starts after the first user interaction.
- Draw sound effects are selected by rarity.
- `R`, `SR`, and `SSR` cards use different sound pools.

The magic sound effects and background music are stored locally in `assets/audio`.

## Visual Assets

Local visual assets include:

- `sakura-site-bg.png`: main website background
- `sakura-card-back.webp`: card back image
- `assets/cards/*.jpg`: card result images

The site does not depend on remote image loading during normal use.

## Run Locally

Start a local static server from the project directory:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000/
```

Camera permission is required for hand gesture interaction.

## Project Structure

```text
.
├── index.html
├── styles.css
├── app.js
├── sakura-site-bg.png
├── sakura-card-back.webp
└── assets
    ├── audio
    └── cards
```

