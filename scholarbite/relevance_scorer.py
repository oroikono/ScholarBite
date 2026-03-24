"""Score papers for relevance against a research profile."""


def score_paper(
    paper: dict,
    keywords: list[str],
    categories: list[str],
) -> float:
    """Score a paper's relevance (0-10) based on keyword and category match.

    Args:
        paper: Paper dict from arxiv_fetcher
        keywords: User's research keywords
        categories: User's preferred arXiv categories

    Returns:
        Relevance score from 0.0 to 10.0
    """
    score = 0.0
    title_lower = paper["title"].lower()
    abstract_lower = paper["abstract"].lower()

    # Keyword matching (up to 6 points)
    keyword_hits = 0
    for kw in keywords:
        kw_lower = kw.lower()
        if kw_lower in title_lower:
            keyword_hits += 2  # Title match worth more
        elif kw_lower in abstract_lower:
            keyword_hits += 1
    score += min(keyword_hits, 6)

    # Category matching (up to 3 points)
    paper_cats = set(paper.get("categories", []))
    user_cats = set(categories)
    overlap = len(paper_cats & user_cats)
    score += min(overlap, 3)

    # Code availability bonus (1 point)
    if paper.get("code_url"):
        score += 1

    return min(score, 10.0)


def rank_papers(
    papers: list[dict],
    keywords: list[str],
    categories: list[str],
    top_n: int = 15,
) -> list[dict]:
    """Rank papers by relevance and return top N.

    Returns papers with an added 'relevance_score' field, sorted descending.
    """
    for paper in papers:
        paper["relevance_score"] = score_paper(paper, keywords, categories)

    ranked = sorted(papers, key=lambda p: p["relevance_score"], reverse=True)
    return ranked[:top_n]
