# How ScholarBite Works

**A short technical overview for people who want to understand what's under the hood.**

---

## The Problem

If you do research, you know the drill. Every morning you open arXiv, scroll through dozens of new papers, skim titles, maybe read a few abstracts, and try to figure out which ones actually matter for your work. It takes 30-60 minutes on a good day. On a bad day you skip it entirely and miss something important.

ScholarBite automates that entire process and delivers the results to your Slack or WhatsApp.

## The Stack

ScholarBite is built on top of [nanobot](https://github.com/HKUDS/nanobot), a lightweight AI agent framework (~4,000 lines of code). We chose nanobot over heavier alternatives because:

- It natively supports Slack, WhatsApp, Telegram, Discord — no custom webhook code needed
- It has a built-in scheduler (heartbeat) for recurring tasks
- It maintains persistent memory, so the agent can remember past conversations
- The whole thing runs in a single Docker container under 1GB of RAM

## Metadata-First Architecture

This is a key design decision. We **don't** download or parse PDFs during the daily scan.

Instead, we work entirely with arXiv metadata:

| Metadata field | What we use it for |
|---|---|
| **Title** | Keyword matching (weighted 2x vs abstract) |
| **Abstract** | Keyword matching, summary generation |
| **Categories** | Filtering by research area (cs.CL, cs.AI, etc.) |
| **Comments** | Extracting code links (GitHub, GitLab, HuggingFace) |
| **Authors** | Display, and eventually author-based preferences |
| **Published date** | Filtering to last 24h |

Why metadata-first?

1. **Speed** — Fetching metadata for 50 papers takes seconds. Downloading 50 PDFs takes minutes.
2. **Cost** — An abstract is ~200 tokens. A full paper is ~15,000 tokens. That's a 75x difference in LLM costs.
3. **Accuracy** — Abstracts are written to convey the core contribution. The LLM doesn't need to dig through 12 pages of related work to find the point.

Full PDF analysis only happens on demand — when you reply "tell me more about paper #3" in the chat.

## The Pipeline

Here's what happens every morning:

```
arXiv API  →  Metadata extraction  →  Relevance scoring  →  LLM summarization  →  Slack/WhatsApp
```

### Step 1: Fetch

The `arxiv-researcher` skill queries the arXiv API with your configured categories and keywords. The arXiv API returns structured XML with all the metadata we need. We convert that into a clean list of paper dicts.

### Step 2: Score

Each paper gets a relevance score from 0-10 based on:

- **Keywords in title** — +2 per match (capped at 6). Title matches are strong signals because authors put their key terms there.
- **Keywords in abstract** — +1 per match (capped at 6 total with title). Broader matching.
- **Category overlap** — +1 per matching category (capped at 3). A paper in cs.CL and cs.AI that matches your cs.CL + cs.AI interests gets +2.
- **Code available** — +1 bonus. Papers with code are more immediately useful.

This scoring is deliberately simple. It runs in microseconds with no LLM calls, so we can score hundreds of papers before the LLM even wakes up.

### Step 3: Summarize

The top 10-15 papers (by score) get passed to the LLM agent. The agent writes a one-line summary for each and formats everything into a readable digest. This is the only step that uses the LLM, keeping costs low.

### Step 4: Deliver

The formatted report goes to your Slack channel or WhatsApp chat via nanobot's built-in channel system. Slack uses Socket Mode (WebSocket connection, no public URL required). WhatsApp uses a bridge.

## Interactive Follow-ups

After the report lands, you can reply directly:

- "Tell me more about paper #5" → The agent fetches more details, possibly reading the full abstract or searching for related work
- "Does paper #3 have a PyTorch implementation?" → Checks the code repo
- "Compare the approach in #2 with yesterday's paper on RAG" → Uses persistent memory to recall previous reports

The agent stores conversations in local files (`~/.nanobot/workspace/memory/`). Over time it builds up context about your preferences — which topics you engage with, which you skip, what kind of follow-up questions you ask. This context carries across sessions.

## What We Don't Do

- **No PDF scraping in the daily pipeline** — too slow, too expensive, usually unnecessary
- **No fine-tuning** — we rely on in-context learning from your conversation history
- **No cloud storage of your data** — everything stays in `~/.nanobot/` on your machine
- **No complex NLP preprocessing** — keyword matching is substring-based, not embeddings. It's fast and predictable. If you want semantic search, the LLM handles that during the chat phase.

## Cost

With the metadata-first approach, a daily report costs roughly:

- **Local LLM (Ollama):** Free
- **OpenRouter / DeepSeek:** ~$0.01-0.03 per report
- **Claude Sonnet / GPT-4o:** ~$0.05-0.15 per report

Interactive follow-ups cost extra per question, but individual questions are cheap since you're only sending one abstract + your question.

## Limitations

Let's be honest about what this can't do:

- **Keyword scoring isn't semantic** — if a paper uses different terminology for the same concept, it might score low. The LLM compensates during summarization, but the initial filter is literal.
- **arXiv only** — we don't cover conference proceedings, journals behind paywalls, or preprints on other platforms.
- **Heartbeat granularity** — nanobot checks every 30 minutes, so the report delivery time isn't exact. It's "around 8 AM", not "at 8:00:00 AM".
- **Code detection is regex-based** — we look for GitHub/GitLab/HuggingFace URLs in the abstract and comments. If the code link is only in the PDF body, we'll miss it during the daily scan.

## Future Ideas

- **Semantic scoring** with lightweight embeddings for better matching
- **Author tracking** — "alert me when Hinton or Bengio publish anything"
- **Citation graph** — "show me papers that cite [specific paper]"
- **Weekly digest mode** for less active research areas
- **Team mode** — multiple researchers sharing one instance with different profiles
