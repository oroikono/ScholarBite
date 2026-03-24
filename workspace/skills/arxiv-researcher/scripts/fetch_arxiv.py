#!/usr/bin/env python3
"""Fetch recent arXiv papers by category and keywords."""

import argparse
import json
import re
import sys
from datetime import datetime, timedelta, timezone

import arxiv


def find_code_url(text: str) -> str | None:
    """Extract GitHub/GitLab URL from text."""
    patterns = [
        r"https?://github\.com/[\w\-]+/[\w\-]+",
        r"https?://gitlab\.com/[\w\-]+/[\w\-]+",
        r"https?://huggingface\.co/[\w\-]+/[\w\-]+",
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0)
    return None


def fetch_papers(
    categories: list[str],
    keywords: list[str],
    days: int = 1,
    max_results: int = 50,
) -> list[dict]:
    """Fetch recent papers from arXiv matching categories and keywords."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)

    # Build query: categories OR keywords
    cat_query = " OR ".join(f"cat:{cat}" for cat in categories)
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

        combined_text = f"{result.title} {result.summary} {result.comment or ''}"
        code_url = find_code_url(combined_text)

        papers.append(
            {
                "id": result.entry_id.split("/")[-1],
                "title": result.title.replace("\n", " ").strip(),
                "authors": [a.name for a in result.authors[:5]],
                "abstract": result.summary.replace("\n", " ").strip(),
                "categories": [c for c in result.categories],
                "published": result.published.isoformat(),
                "pdf_url": result.pdf_url,
                "html_url": result.entry_id.replace("abs", "html"),
                "code_url": code_url,
            }
        )

    return papers


def main():
    parser = argparse.ArgumentParser(description="Fetch recent arXiv papers")
    parser.add_argument(
        "--categories",
        type=str,
        default="cs.CL,cs.AI,cs.LG",
        help="Comma-separated arXiv categories",
    )
    parser.add_argument(
        "--keywords",
        type=str,
        default="",
        help="Comma-separated search keywords",
    )
    parser.add_argument(
        "--days",
        type=int,
        default=1,
        help="Number of days to look back",
    )
    parser.add_argument(
        "--max-results",
        type=int,
        default=50,
        help="Maximum number of results",
    )

    args = parser.parse_args()

    categories = [c.strip() for c in args.categories.split(",") if c.strip()]
    keywords = [k.strip() for k in args.keywords.split(",") if k.strip()]

    papers = fetch_papers(categories, keywords, args.days, args.max_results)
    json.dump(papers, sys.stdout, indent=2, ensure_ascii=False)
    print()


if __name__ == "__main__":
    main()
