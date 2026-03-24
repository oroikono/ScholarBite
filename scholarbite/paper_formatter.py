"""Format papers into readable messages for Slack/WhatsApp."""

from datetime import datetime, timezone


def format_paper(paper: dict, index: int) -> str:
    """Format a single paper entry."""
    authors = paper["authors"]
    if len(authors) > 3:
        author_str = f"{authors[0]} et al."
    else:
        author_str = ", ".join(authors)

    score = paper.get("relevance_score", 0)
    lines = [
        f"### {index}. [{paper['title']}](https://arxiv.org/abs/{paper['id']})",
        f"**{author_str}** | Relevance: {score:.0f}/10",
    ]

    if paper.get("code_url"):
        lines.append(f"Code: {paper['code_url']}")

    return "\n".join(lines)


def format_daily_report(papers: list[dict], date: datetime | None = None) -> str:
    """Format a full daily digest.

    Args:
        papers: Ranked list of papers (should already be scored and sorted)
        date: Report date (defaults to today)

    Returns:
        Formatted markdown string ready for Slack/WhatsApp
    """
    if date is None:
        date = datetime.now(timezone.utc)

    date_str = date.strftime("%A, %B %d, %Y")
    lines = [
        f"# ScholarBite Daily Digest",
        f"**{date_str}** | {len(papers)} papers\n",
        "---\n",
    ]

    for i, paper in enumerate(papers, 1):
        lines.append(format_paper(paper, i))
        lines.append("")

    # Highlights section for top 3
    if len(papers) >= 3:
        lines.append("---\n")
        lines.append("## Highlights")
        for paper in papers[:3]:
            lines.append(f"- **{paper['title']}** — {paper['abstract'][:150]}...")
        lines.append("")

    lines.append("---")
    lines.append("_Reply to ask questions about any paper above._")

    return "\n".join(lines)
