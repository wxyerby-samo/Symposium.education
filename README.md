# PWA Chat Agent Interface

This project provides a small mobile-friendly chat interface for an AI agent backed by OpenAI tool calling.

## Setup

```bash
npm install
```

Then set your API key:

```bash
export OPENAI_API_KEY="your-key-here"
```

## Run locally

```bash
npm start
```

Then open http://localhost:3000 in a browser.

The chat UI posts to `/agent-endpoint` and the server can call the `send_email_summary` tool when the model decides a task requires it.
