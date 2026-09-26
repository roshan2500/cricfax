# 🏏 CricFax: Modern Cricket News & Editorial Platform

A high-performance, responsive cricket news, analysis, and tournament editorial platform built with **React**, **TypeScript**, **Node.js**, **Express**, and **PostgreSQL**.

> **Design Philosophy**: Built purely for cricket news, journalism, and deep editorial reading with zero clutter—no live scores widgets and no mandatory user sign-ins.

---

## 🌟 Key Features

1. **Focused News & Editorial Feed**:
   - ⚡ Real-time **Breaking News Ticker** with automatic cycling across breaking cricket alerts
   - 🌟 Hero Featured Story showcase and secondary editorial highlights
   - 🏷️ Quick format switcher (`ALL`, `IPL`, `TEST`, `T20I`, `ODI`)
   - 📈 Trending cricket topics sidebar and tournament hubs

2. **Article Catalog & Filtering**:
   - Filter by tournament category (*IPL & T20 Leagues*, *Test Cricket & WTC*, *World Cups*, *Tactical Analysis*, *Women's Cricket*)
   - Filter by match format and tags

3. **In-Depth Article Reading Experience**:
   - High-resolution hero imagery with photo credits
   - Editorial byline with author avatar, bio, reading time, view count, and publication date
   - Formatted markdown content with blockquotes, analytical statistics, and lists
   - Social sharing to **Twitter/X**, **WhatsApp**, and one-click link copying
   - Open reader discussion without mandatory accounts or logins

4. **Category Hubs**:
   - Dedicated landing pages for IPL, WTC, World Cups, and Women's Cricket

5. **Instant Search**:
   - Real-time debounced full-text search across article titles, excerpts, content, tags, and authors

6. **Author Profiles**:
   - Detailed journalist bylines with cumulative views and article metrics
   - Chronological archive of stories published by each author

7. **Editorial Desk (`/admin`)**:
   - Live platform metrics (total articles, views, authors, moderation counts)
   - Article Management (publish/unpublish toggle, compose new cricket story, edit, delete)
   - Directly accessible for editorial staff

8. **Zero Barriers**:
   - No login or signup popups—readers can browse, search, and read instantly
   - Clean sports typography and distraction-free dark layout

---

## 🏗️ Architecture & Directory Overview

```
cricket-platform/
├── client/                     # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/         # Reusable UI & Cricket widgets (BreakingNewsBar, ArticleCard, Navbar)
│   │   ├── pages/              # Route pages (Home, Articles, Detail, Category, Author, Search, Admin)
│   │   ├── services/           # API fetch client and endpoints
│   │   ├── types/              # Frontend TypeScript interfaces
│   │   └── App.tsx             # Root router and layout shell
│   └── package.json
│
├── server/                     # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── controllers/        # Express route controllers (Articles, Categories, Search, Admin, Author)
│   │   ├── db/
│   │   │   ├── schema.sql      # Production PostgreSQL DDL with triggers & GIN FTS index
│   │   │   └── store.ts        # Data layer with graceful fallback for local testing
│   │   │   └── mockData.ts     # Authentic cricket editorial articles, categories, and authors
│   │   ├── routes/             # REST API routers (/api/v1/...)
│   │   ├── types/              # Domain models & Express types
│   │   └── server.ts           # Server bootstrap with graceful shutdown
│   └── package.json
│
└── package.json                # Root package orchestration
```

---

## 🚀 Quick Start Guide

### 1. Start the Backend API Server
```bash
cd server
npm run dev
```
The backend will launch at **`http://localhost:5000/api/v1`**.  
*Note: If no `DATABASE_URL` is configured, it automatically runs with a rich in-memory cricket dataset preloaded with stories and authors.*

### 2. Start the Frontend Application
In a separate terminal:
```bash
cd client
npm run dev
```
The React frontend will open at **`http://localhost:3000`**.

---

## 🗄️ PostgreSQL Production Setup

To connect to your own PostgreSQL instance:

1. Copy `.env.example` to `.env` in `server/`:
   ```bash
   cp server/.env.example server/.env
   ```
2. Set your connection string:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/CricFax
   ```
3. Run the schema migrations from `server/src/db/schema.sql`:
   ```bash
   psql -d CricFax -f server/src/db/schema.sql
   ```
