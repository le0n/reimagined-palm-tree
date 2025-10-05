# Map Suggester

Map Suggester is an experiential planning assistant that auto-generates curated date itineraries for couples. The project ingests location data, learns relationship preferences, and surfaces thoughtful suggestions that feel personal instead of generic search results.

## Why it exists
- **Decision fatigue is real**: Picking new places to go can feel like a chore when options are endless.
- **Generic lists fall short**: Random recommendation lists rarely match a couple’s mood, budget, or schedule.
- **Context matters**: Magical evenings come from balancing energy levels, travel time, and atmospheric fit.

Map Suggester aims to solve this with a recommendation workflow that feels more like a trusted friend than a raw data feed.

## Core ideas
- **Shared preference modeling**: Blend each partner’s likes, constraints, and accessibility needs into a shared profile.
- **Dynamic mood boards**: Capture where the couple is emotionally (relaxed, adventurous, spontaneous) to personalize itinerary tone.
- **Geo-context awareness**: Understand distance, transit options, and neighborhood vibe so the plan flows naturally.
- **Smart sequencing**: Order suggestions so transitions make sense—coffee near a park, a walk to a gallery, dinner nearby.

## Current status
This repository is the starting point for implementation. The high-level goals below anchor the first milestone:
1. Define the domain model for couples, places, and itineraries.
2. Stand up a data pipeline that aggregates location info and filters for couple-friendly experiences.
3. Prototype a lightweight recommendation engine with explainable scores.
4. Ship a minimal interface that surfaces a top-three suggestion list and the rationale behind each pick.

## Getting started
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-org>/reimagined-palm-tree.git
   cd reimagined-palm-tree
   ```
2. Create a Python (or JavaScript) virtual environment—language choice depends on the backend you land on.
3. Install dependencies once the package manifest is defined (e.g., `pip install -r requirements.txt` or `npm install`).
4. Copy `.env.example` to `.env` when environment variables are introduced.

> ❗️ The codebase is still empty; use this README as the north star while you sketch the first iteration.

## Suggested architecture
- **Data ingestion**: Use third-party APIs (Google Places, Yelp, Foursquare, local tourism boards) and blend them with manual curation for hidden gems.
- **Recommendation engine**: Start with rule-based filtering + scoring; evolve toward a hybrid model mixing collaborative filtering and contextual bandits.
- **Interface**: A lightweight web front end (React/Vue/Svelte) or a conversational interface; whichever is fastest to iterate.
- **Infrastructure**: Containerize services (Docker), orchestrate with a minimal cloud setup (Render, Fly, Railway) before scaling.

## Roadmap
- [ ] Lock in product requirements and key metrics (retention, delight score, planning time saved).
- [ ] Ship v0: questionnaire, top suggestions list, export/share feature.
- [ ] Layer on “pair personalities” and date-night templates.
- [ ] Add real-time signals (weather, events) to adjust suggestions.
- [ ] Launch feedback loops to learn from what couples actually choose.

## Contributing
1. Open an issue describing the feature or fix.
2. Fork the repo and create a descriptive branch name (`feature/mood-profiles`).
3. Open a PR early for feedback; include screenshots, data samples, or acceptance criteria.
4. Request a review from the core team and iterate until the PR is ready.

## License
No license has been selected yet. If you plan to share the project, choose one (MIT, Apache 2.0, etc.) so others know how they can use the code.

---

Questions, ideas, or feedback? Open an issue—this project grows faster with collaborative imagination.
