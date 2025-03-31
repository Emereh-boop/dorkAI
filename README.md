# DorkAI - Advanced Google Dorking Tool

DorkAI is a specialized search tool designed to enhance Google Dorking capabilities for cybersecurity professionals, ethical hackers, and researchers. Built with **SvelteKit (frontend)** and **Node.js + Express + MongoDB (backend)**, it provides a structured, user-friendly interface for executing complex search queries efficiently.

## Features

### 🖥️ **Frontend (SvelteKit + ShadCN + TailwindCSS)**
- **Minimalist UI**: Clean, search-engine-style interface.
- **Predefined Dork Categories**: One-click dorking for common queries.
- **Customizable Search Queries**: Users can create and modify dorks.
- **Human-Friendly Dork Builder**: UI-based filters instead of raw queries.
- **Auto-Suggested Dorks**: Intelligent autocomplete feature.
- **Safe Mode & Red Flag Alerts**: Warnings for risky queries.
- **Instant Execution**: "Open in Google" button for quick searches.

### 🖧 **Backend (Node.js + Express + MongoDB + Ollama AI)**
- **RESTful API**: Handles dork execution, logging, and analytics.
- **MongoDB Database**: Stores predefined dorks and user history.
- **Ollama AI Integration**: Enhances query suggestions and optimizations.
- **Secure Query Handling**: Prevents abuse and logs activity.
- **Environment Adaptability**: Results tailored to user settings or locations.

## Installation & Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+)
- **MongoDB**
- **Ollama AI** (for AI-driven query suggestions)
- **pnpm/yarn/npm**

### Clone the Repository
```sh
 git clone https://github.com/your-repo/dorkAI.git
 cd dorkAI
```

### Install Dependencies
#### Backend
```sh
 cd backend
 npm install
```
#### Frontend
```sh
 cd ../frontend
 npm install
```

### Environment Variables
Create a `.env` file in both `backend/` and `frontend/` directories:
#### Backend `.env`
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/dorkai
OLLAMA_API_KEY=your-api-key
```
#### Frontend `.env`
```
VITE_API_URL=http://localhost:5000
```

### Running the Project
#### Start Backend
```sh
 cd backend
 npm start
```
#### Start Frontend
```sh
 cd frontend
 npm run dev
```
Visit `http://localhost:5173` to access the DorkAI interface.

## API Endpoints
### `POST /api/dork/search`
Executes a Google Dork search.
- **Request Body**:
```json
{
  "query": "site:example.com filetype:pdf"
}
```
- **Response**:
```json
{
  "results": [
    { "title": "Example PDF", "link": "https://example.com/file.pdf" }
  ]
}
```

### `GET /api/dork/categories`
Fetches predefined dorking categories.

### `POST /api/dork/custom`
Saves a user-defined dork query.

## Contributing
We welcome contributions! Feel free to submit PRs or open issues.

## License
MIT License. See `LICENSE` for details.

