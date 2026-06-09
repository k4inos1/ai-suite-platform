# AGENTS.md — ai-suite-platform guidance

Purpose
-------
Concise, actionable guidance for AI coding agents working in this repo.

Project layout
--------------
- Frontend (Next.js): frontend/
- Backend (FastAPI): backend/

Key entry points
----------------
- README: ../README.md
- Copilot setup: ../COPILOT_SETUP.md
- FastAPI app: ../backend/main.py
- Next.js app: ../frontend/app/

Common commands (verify README before running)
---------------------------------------------
- Frontend dev: npm run dev
- Frontend build: npm run build
- Backend tests: npm run test:backend

Testing notes
-------------
- Pytest tests live under ../backend/tests/

Environment notes
-----------------
- Backend expects OPENAI_API_KEY for non-demo mode.
- ALLOWED_ORIGINS controls CORS for the API.
