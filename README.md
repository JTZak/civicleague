# Civic League of Gulfport, Mississippi

The official website for the Civic League of Gulfport — serving special needs children and adults along the Mississippi Gulf Coast since 1947.

## Pages

- `index.html` — Home
- `about.html` — Our story, history, officers, charter members
- `projects.html` — Community projects and welfare work
- `scholarship.html` — Scholarship program info and how to apply
- `christmas-tour.html` — Annual Christmas Tour of Homes (with snowfall and live countdown)
- `silent-auction.html` — Silent Auction preview and donation calls

## Stack

Plain HTML, CSS, and JavaScript — no build step. The site uses:

- Custom green-and-gold theme inspired by the League's official colors and gold chrysanthemum
- SVG logo (`assets/logo.svg`) — a hand-built chrysanthemum
- Google Fonts: Cormorant Garamond + Inter
- Scroll-reveal animations, animated stat counters, countdown timer, and a canvas snowfall effect on the Christmas page

## Deployment

A GitHub Actions workflow (`.github/workflows/pages.yml`) deploys the repo root to GitHub Pages on every push to `main`. To enable:

1. Push the `main` branch.
2. In repo settings → **Pages**, set the source to **GitHub Actions**.
3. The site will be live at `https://<owner>.github.io/<repo>/`.

## Local preview

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Contact

civicleagueofgulfport@gmail.com
