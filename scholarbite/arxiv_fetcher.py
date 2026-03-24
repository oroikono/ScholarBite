"""arXiv API client for fetching and filtering papers.

The fetcher works metadata-first: it pulls structured metadata (title, authors,
abstract, categories, comments) from the arXiv API. This is cheap, fast, and
gives us everything we need for relevance scoring and initial summaries.

Full PDF content is never fetched during the daily scan — only on demand when
a user asks for deeper analysis of a specific paper.
"""

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


def extract_metadata(result) -> dict:
    """Extract structured metadata from a single arXiv result.

    Returns a flat dict with all the fields we care about. This is the
    central schema — everything downstream (scorer, formatter) works
    with these keys.
    """
    combined = f"{result.title} {result.summary} {result.comment or ''}"

    # Primary category is always first in the list
    all_cats = list(result.categories)
    primary_cat = all_cats[0] if all_cats else None

    return {
        "id": result.entry_id.split("/")[-1],
        "title": result.title.replace("\n", " ").strip(),
        "authors": [a.name for a in result.authors],
        "abstract": result.summary.replace("\n", " ").strip(),
        "categories": all_cats,
        "primary_category": primary_cat,
        "published": result.published.isoformat(),
        "updated": result.updated.isoformat() if result.updated else None,
        "pdf_url": result.pdf_url,
        "html_url": result.entry_id.replace("/abs/", "/html/"),
        "code_url": find_code_url(combined),
        "comment": (result.comment or "").strip() or None,
        "has_code": find_code_url(combined) is not None,
    }


def fetch_papers(
    categories: list[str],
    keywords: list[str] | None = None,
    days: int = 1,
    max_results: int = 50,
) -> list[dict]:
    """Fetch recent papers from arXiv using metadata only.

    This hits the arXiv API and returns structured metadata for each
    matching paper. No PDFs are downloaded — abstracts and comments
    contain enough signal for relevance scoring.

    Args:
        categories: arXiv categories (e.g., ["cs.CL", "cs.AI"])
        keywords: Optional search keywords to filter by
        days: How many days back to look
        max_results: Maximum papers to return

    Returns:
        List of paper metadata dicts.
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
        papers.append(extract_metadata(result))

    return papers
