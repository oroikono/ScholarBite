"""arXiv API client for fetching and filtering papers."""

import re
from datetime import datetime, timedelta, timezone

import arxiv


def find_code_url(text: str) -> str | None:
    """Extract GitHub/GitLab/HuggingFace URL from text."""
    for pattern in [
        r"https?://github\.com/[\w\-]+/[\w\-]+",
        r"https?://gitlab\.com/[\w\-]+/[\w\-]+",
        r"https?://huggingface\.co/[\w\-]+/[\w\-]+",
    ]:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None


def fetch_papers(
    categories: list[str],
    keywords: list[str] | None = None,
    days: int = 1,
    max_results: int = 50,
) -> list[dict]:
    """Fetch recent papers from arXiv.

    Args:
        categories: arXiv categories (e.g., ["cs.CL", "cs.AI"])
        keywords: Optional search keywords to filter by
        days: How many days back to look
        max_results: Maximum papers to return

    Returns:
        List of paper dicts with id, title, authors, abstract, etc.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    cat_query = " OR ".join(f"cat:{c}" for c in categories)
    query = f"({cat_query})"

    if keywords:
        kw_query = " OR ".join(f'all:"{kw}"' for kw in keywords)
        query = f"{query} AND ({kw_query})"

    client = arxiv.Client()
    search = arxiv.Search(
        query=query,
        max_results=max_results,
        sort_by=arxiv.SortCriterion.SubmittedDate,
        sort_order=arxiv.SortOrder.Descending,
    )

    papers = []
    for result in client.results(search):
        if result.published.replace(tzinfo=timezone.utc) < cutoff:
            continue

        combined = f"{result.title} {result.summary} {result.comment or ''}"
        papers.append(
            {
                "id": result.entry_id.split("/")[-1],
                "title": result.title.replace("\n", " ").strip(),
                "authors": [a.name for a in result.authors],
                "abstract": result.summary.replace("\n", " ").strip(),
                "categories": list(result.categories),
                "published": result.published.isoformat(),
                "pdf_url": result.pdf_url,
                "code_url": find_code_url(combined),
            }
        )

    return papers
