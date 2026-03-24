<p align="center">
  <img src="assets/logo.svg" alt="ScholarBite Logo" width="400"/>
</p>

<p align="center"><strong>Your AI-powered daily arXiv research companion</strong> — powered by <a href="https://github.com/HKUDS/nanobot">nanobot</a></p>

<p align="center">
  <a href="#quick-start">Quick Start</a> &bull;
  <a href="#choose-your-llm-provider">LLM Providers</a> &bull;
  <a href="#chat-with-your-papers">Interactive Chat</a> &bull;
  <a href="#contributing">Contributing</a>
</p>

---

ScholarBite automatically discovers, summarizes, and delivers relevant research papers from arXiv to your Slack or WhatsApp every morning. Then you can **chat back** to ask follow-up questions about any paper.

## What It Does

- **Daily Morning Reports** — Fetches new arXiv papers matching your research interests, summarizes them, and delivers a nicely formatted digest
- **Code Discovery** — Automatically finds linked GitHub/GitLab repositories for each paper
- **Interactive Chat** — Reply to any report to ask deeper questions about methodology, results, or relevance
- **Relevance Scoring** — Filters and ranks papers based on your configured research topics
- **Multi-Platform** — Slack (Socket Mode) and WhatsApp (gateway bridge)
- **Learns From You** — The agent remembers your feedback and conversations, improving recommendations over time

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

Edit `workspace/USER.md` with your research interests, keywords, and preferred arXiv categories. This is the only file most users need to touch.

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

---

## Choose Your LLM Provider

ScholarBite works with any LLM provider supported by nanobot. Pick what works for you:

### OpenRouter (recommended — access to many models)

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-your-key"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-sonnet-4-20250514",
      "provider": "openrouter"
    }
  }
}
```

Get your key at [openrouter.ai](https://openrouter.ai). Gives access to Claude, GPT-4, Gemini, DeepSeek, and more through a single API key. Good budget options available (DeepSeek, Llama).

### Anthropic (Claude API directly)

```json
{
  "providers": {
    "anthropic": {
      "apiKey": "sk-ant-your-key"
    }
  },
  "agents": {
    "defaults": {
      "model": "claude-sonnet-4-20250514",
      "provider": "anthropic"
    }
  }
}
```

Get your key at [console.anthropic.com](https://console.anthropic.com). Best for high-quality paper analysis and nuanced research summaries.

### OpenAI (ChatGPT / GPT-4)

```json
{
  "providers": {
    "openai": {
      "apiKey": "sk-your-key"
    }
  },
  "agents": {
    "defaults": {
      "model": "gpt-4o",
      "provider": "openai"
    }
  }
}
```

Get your key at [platform.openai.com](https://platform.openai.com). Works well with GPT-4o for fast, cost-effective summaries.

### Local LLMs (Ollama — free, private, no API key)

Run everything locally with zero cost and full privacy:

```bash
# 1. Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull a model (pick one)
ollama pull llama3.1        # Good balance of speed & quality
ollama pull deepseek-r1     # Strong reasoning for paper analysis
ollama pull mistral          # Fast and lightweight
ollama pull qwen2.5          # Good multilingual support
```

Then configure nanobot to use it:

```json
{
  "providers": {
    "ollama": {
      "baseURL": "http://localhost:11434/v1"
    }
  },
  "agents": {
    "defaults": {
      "model": "llama3.1",
      "provider": "ollama"
    }
  }
}
```

> **Tip:** For best paper summarization quality with local models, use at least a 7B parameter model. 13B+ is recommended if your machine can handle it.

### Provider Comparison

Cost estimates are based on a typical daily report: ~15 paper abstracts (~200 tokens each) summarized into a digest (~800 tokens output). Roughly 4K input + 1K output tokens per report. Costs vary with model choice.

| Provider | Est. Cost / Report | Privacy | Setup |
|----------|-------------------|---------|-------|
| **Ollama (local)** | Free | Full privacy | Install Ollama + pull model |
| **OpenRouter** | $0.01–0.10 | Cloud | Get API key |
| **Anthropic** | $0.05–0.15 | Cloud | Get API key |
| **OpenAI** | $0.03–0.10 | Cloud | Get API key |

> Costs scale linearly with the number of follow-up questions you ask. Each question adds roughly one abstract worth of tokens.

---

## Chat With Your Papers

ScholarBite isn't just a notification bot — it's a research companion you can talk to.

### How it works

After receiving your morning report, just reply in Slack or WhatsApp:

```
You: "Tell me more about the third paper"
Bot: [Detailed summary with methodology, key findings, and related work]

You: "Does it have a PyTorch implementation?"
Bot: [Checks the code repo and confirms framework, dependencies, etc.]

You: "Find similar papers from this week"
Bot: [Searches arXiv for related recent work]

You: "How does this compare to the RAG approach from yesterday?"
Bot: [Compares methodologies across papers from memory]
```

### The agent learns from your feedback

Nanobot maintains persistent memory across sessions. This means:

- **It remembers your preferences** — If you consistently ask about certain topics or dismiss others, the agent adapts
- **Conversation history is preserved** — You can reference papers from days ago
- **Your research profile evolves** — The more you interact, the more relevant the daily reports become

Memory is stored locally in `~/.nanobot/workspace/memory/` — your data stays on your machine.

---

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
├── tests/                     # Test suite
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

## Running Tests

```bash
pip install -e ".[dev]"
pytest tests/ -v
```

## Contributing

Contributions are welcome! Feel free to:
- Add new arXiv categories or filtering strategies
- Improve the paper summarization prompts
- Add support for new chat platforms
- Share your custom agent profiles

## License

MIT
