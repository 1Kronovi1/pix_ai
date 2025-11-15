const concurrently = require("concurrently");

concurrently([
  { command: "cd backend && venv\\Scripts\\activate && uvicorn main:app --reload", name: "backend" },
  { command: "cd frontend && npm start", name: "frontend" }
]);