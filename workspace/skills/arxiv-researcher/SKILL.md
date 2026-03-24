---
name: arxiv-researcher
description: >
  Search and analyze arXiv papers. Use this skill when the user asks about
  recent papers, wants a daily research digest, or needs to find papers
  on a specific topic. Triggers on: daily report, paper search, arxiv,
  research summary, new papers, literature review.
---

# arXiv Researcher Skill

You have access to the arXiv research paper database through the `fetch_arxiv.py` script.

## Available Scripts

### `fetch_arxiv.py`

Fetches recent papers from arXiv based on categories and keywords.

**Usage:**
```bash
python scripts/fetch_arxiv.py --categories "cs.CL,cs.AI,cs.LG" --keywords "llm,retrieval" --days 1 --max-results 50
```

**Output:** JSON array of papers with fields:
- `id`: arXiv paper ID
- `title`: Paper title
- `authors`: List of authors
- `abstract`: Full abstract
- `categories`: arXiv categories
- `published`: Publication date
- `pdf_url`: Link to PDF
- `html_url`: Link to HTML version (if available)
- `code_url`: GitHub/GitLab link (if found in abstract or comments)

## How to Use

1. Read the user's research profile from `USER.md`
2. Run `fetch_arxiv.py` with the user's categories and keywords
3. Parse the JSON output
4. Score each paper's relevance (0-10) based on:
   - Keyword matches in title and abstract
   - Category alignment with user's interests
   - Presence of code/reproducibility artifacts
5. Sort by relevance score, take top N papers
6. Format into a readable digest

## Formatting the Report

For each paper include:

```
### [Paper Title](https://arxiv.org/abs/XXXX.XXXXX)
**Authors:** First Author et al. | **Relevance:** 8/10
> One-line summary of key contribution

🔗 Code: [github.com/author/repo](url) (if available)
```

## Follow-up Questions

When users ask about a specific paper from the report:
- Fetch the full abstract using the paper ID
- Use `web_search` to find related code repos, blog posts, or discussions
- Compare with similar recent papers if asked
