# ScholarBite 🎓

**Your AI-powered daily arXiv research companion** — powered by [nanobot](https://github.com/HKUDS/nanobot).

ScholarBite automatically discovers, summarizes, and delivers relevant research papers from arXiv to your Slack or WhatsApp every morning. Then you can **chat back** to ask follow-up questions about any paper.

## What It Does

- **Daily Morning Reports** — Fetches new arXiv papers matching your research interests, summarizes them, and delivers a nicely formatted digest
- **Code Discovery** — Automatically finds linked GitHub/GitLab repositories for each paper
- **Interactive Chat** — Reply to any report to ask deeper questions about methodology, results, or relevance
- **Relevance Scoring** — Filters and ranks papers based on your configured research topics
- **Multi-Platform** — Slack (Socket Mode) and WhatsApp (gateway bridge)

## Quick Start

### 1. Install nanobot

```bash
uv tool install nanobot-ai
# or
pip install nanobot-ai
```

### 2. Clone and configure

```bash
git clone https://github.com/oroikono/ScholarBite.git
cd ScholarBite

# Copy example config
cp config/config.example.json ~/.nanobot/config.json
cp .env.example .env

# Edit with your API keys and preferences
nano ~/.nanobot/config.json
nano .env
```

### 3. Set up your research profile

Edit `workspace/USER.md` with your research interests, keywords, and preferred arXiv categories.

### 4. Install the skills

```bash
# Copy ScholarBite workspace into nanobot
cp -r workspace/skills/* ~/.nanobot/workspace/skills/
cp workspace/HEARTBEAT.md ~/.nanobot/workspace/HEARTBEAT.md
cp workspace/AGENTS.md ~/.nanobot/workspace/AGENTS.md
```

### 5. Connect your channels

**Slack (recommended):**
1. Create a Slack app at [api.slack.com](https://api.slack.com/apps)
2. Enable Socket Mode
3. Add bot scopes: `chat:write`, `channels:read`, `channels:history`
4. Add your `bot_token` and `app_token` to `~/.nanobot/config.json`

**WhatsApp:**
1. Follow nanobot's [WhatsApp bridge setup](https://github.com/HKUDS/nanobot#whatsapp)
2. Scan the QR code to link your account

### 6. Launch

```bash
# With Docker (recommended)
docker compose up -d

# Or directly
nanobot gateway
```

Your first morning report will arrive at the next scheduled check!

## Configuration

### Research Interests (`workspace/USER.md`)

```markdown
## My Research Areas
- Large Language Models
- Retrieval-Augmented Generation
- Multi-Agent Systems

## Keywords
llm, rag, retrieval augmented, multi-agent, tool-use, reasoning

## arXiv Categories
cs.CL, cs.AI, cs.LG, cs.IR
```

### Report Schedule

The heartbeat runs every 30 minutes. The agent checks the time and sends the daily report at your configured hour (default: 8:00 AM UTC). Edit `workspace/HEARTBEAT.md` to adjust.

## Architecture

```
ScholarBite/
├── config/                    # Example configurations
├── workspace/                 # Nanobot workspace files
│   ├── AGENTS.md              # Agent personality & behavior
│   ├── HEARTBEAT.md           # Scheduled daily trigger
│   ├── USER.md                # Your research preferences
│   └── skills/
│       └── arxiv-researcher/  # Custom nanobot skill
├── scholarbite/               # Core Python library
│   ├── arxiv_fetcher.py       # arXiv API client
│   ├── paper_formatter.py     # Message formatting
│   └── relevance_scorer.py    # Paper ranking
└── docker-compose.yml
```

## How It Works

1. **HEARTBEAT.md** triggers the agent every 30 minutes
2. The agent checks if it's time for the daily report
3. **arxiv-researcher** skill fetches papers from arXiv API using your configured categories and keywords
4. Papers are scored for relevance against your research profile
5. Top papers are summarized with key findings, methodology, and code links
6. The formatted report is delivered to your Slack/WhatsApp channel
7. You can reply to ask questions — the agent remembers the papers it just sent

## Contributing

Contributions are welcome! Feel free to:
- Add new arXiv categories or filtering strategies
- Improve the paper summarization prompts
- Add support for new chat platforms
- Share your custom agent profiles

## License

MIT
