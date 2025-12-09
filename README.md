# Equinoux

Equinoux is a full‑stack web application that allows users to test their websites using **Lighthouse**, **Puppeteer**, and **Axe‑core**.  
It provides a clean React/Vite frontend with a playful music player, and a Node/Express backend deployed on **Google Cloud Run**.

---

## ✨ Features

- **Frontend (React + Vite)**
  - User interface to enter a website URL and run tests.
  - Displays results from Lighthouse, Puppeteer, and Axe‑core in a friendly grid.
  - Includes a background music player with random song selection, play/pause, next/previous, and seek controls.
  - Deployed on **GitHub Pages**:  
    👉 [Equinoux Frontend](https://nosoyunmarinero.github.io/equinoux/)

- **Backend (Node + Express)**
  - Provides three analysis endpoints:
    - `/analyze` → Lighthouse performance, accessibility, SEO, best practices.
    - `/puppeteer` → Page load time and title.
    - `/axe` → Accessibility violations.
  - Provides a combined endpoint:
    - `/full-analysis` → Runs all three tools and returns a unified JSON response.
  - Deployed on **Google Cloud Run**:  
    👉 [Equinoux Backend](https://backend-341194274972.us-central1.run.app)

---

## 🛠️ Project Structure

