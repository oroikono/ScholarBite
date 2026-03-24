"""Tests for the relevance scoring engine."""

from scholarbite.relevance_scorer import rank_papers, score_paper

# --- Fixtures ---

PAPER_RAG = {
    "id": "2403.12345",
    "title": "Scaling Retrieval-Augmented Generation with Multi-Agent LLMs",
    "authors": ["Alice Smith", "Bob Jones"],
    "abstract": (
        "We propose a novel RAG framework using multi-agent systems for "
        "improved retrieval augmented generation with large language models."
    ),
    "categories": ["cs.CL", "cs.AI"],
    "published": "2026-03-24T00:00:00",
    "pdf_url": "https://arxiv.org/pdf/2403.12345",
    "code_url": "https://github.com/example/rag-agents",
}

PAPER_COT = {
    "id": "2403.11111",
    "title": "Chain-of-Thought Reasoning in Tool-Use Agents",
    "authors": ["Frank Miller", "Grace Chen"],
    "abstract": (
        "We study chain-of-thought reasoning patterns in LLM-based "
        "tool-use agents for complex task solving."
    ),
    "categories": ["cs.AI", "cs.CL", "cs.LG"],
    "published": "2026-03-24T00:00:00",
    "pdf_url": "https://arxiv.org/pdf/2403.11111",
    "code_url": None,
}

PAPER_QUANTUM = {
    "id": "2403.67890",
    "title": "Quantum Error Correction via Topological Codes",
    "authors": ["Eve Wilson"],
    "abstract": (
        "A study on topological quantum error correction codes "
        "for fault-tolerant quantum computing."
    ),
    "categories": ["quant-ph"],
    "published": "2026-03-24T00:00:00",
    "pdf_url": "https://arxiv.org/pdf/2403.67890",
    "code_url": None,
}

KEYWORDS = ["llm", "rag", "retrieval augmented", "multi-agent", "tool-use", "reasoning", "chain-of-thought"]
CATEGORIES = ["cs.CL", "cs.AI", "cs.LG"]


# --- Tests ---


class TestScorePaper:
    def test_highly_relevant_paper_scores_high(self):
        score = score_paper(PAPER_RAG, KEYWORDS, CATEGORIES)
        assert score >= 7, f"RAG paper should score >= 7, got {score}"

    def test_irrelevant_paper_scores_zero(self):
        score = score_paper(PAPER_QUANTUM, KEYWORDS, CATEGORIES)
        assert score == 0, f"Quantum paper should score 0, got {score}"

    def test_code_url_gives_bonus(self):
        paper_no_code = {**PAPER_RAG, "code_url": None}
        score_with = score_paper(PAPER_RAG, KEYWORDS, CATEGORIES)
        score_without = score_paper(paper_no_code, KEYWORDS, CATEGORIES)
        assert score_with > score_without, "Paper with code should score higher"

    def test_title_match_worth_more_than_abstract(self):
        # "multi-agent" appears in title of PAPER_RAG
        paper_abstract_only = {
            **PAPER_RAG,
            "title": "A Generic Framework for Systems",
            "abstract": "We use multi-agent and rag approaches.",
        }
        score_title = score_paper(PAPER_RAG, ["multi-agent"], CATEGORIES)
        score_abstract = score_paper(paper_abstract_only, ["multi-agent"], CATEGORIES)
        assert score_title > score_abstract, "Title keyword match should score higher"

    def test_score_capped_at_10(self):
        many_keywords = ["scaling", "retrieval", "augmented", "generation", "multi-agent",
                         "llm", "large", "language", "model", "rag", "framework", "novel"]
        score = score_paper(PAPER_RAG, many_keywords, CATEGORIES)
        assert score <= 10.0, f"Score should be capped at 10, got {score}"

    def test_category_overlap_contributes_to_score(self):
        score_matching = score_paper(PAPER_COT, [], ["cs.AI", "cs.CL", "cs.LG"])
        score_none = score_paper(PAPER_COT, [], ["quant-ph"])
        assert score_matching > score_none

    def test_empty_keywords_and_categories(self):
        score = score_paper(PAPER_RAG, [], [])
        # Only code bonus
        assert score == 1.0, f"Only code bonus expected, got {score}"

    def test_no_code_no_match_is_zero(self):
        score = score_paper(PAPER_QUANTUM, [], [])
        assert score == 0.0


class TestRankPapers:
    def test_returns_sorted_by_relevance(self):
        papers = [PAPER_QUANTUM, PAPER_COT, PAPER_RAG]
        ranked = rank_papers(papers, KEYWORDS, CATEGORIES, top_n=10)
        scores = [p["relevance_score"] for p in ranked]
        assert scores == sorted(scores, reverse=True), "Papers should be sorted by score descending"

    def test_top_n_limits_results(self):
        papers = [PAPER_RAG, PAPER_COT, PAPER_QUANTUM]
        ranked = rank_papers(papers, KEYWORDS, CATEGORIES, top_n=2)
        assert len(ranked) == 2

    def test_most_relevant_paper_first(self):
        papers = [PAPER_QUANTUM, PAPER_COT, PAPER_RAG]
        ranked = rank_papers(papers, KEYWORDS, CATEGORIES, top_n=3)
        # Both RAG and COT score high; irrelevant quantum should not be first
        assert ranked[0]["id"] != PAPER_QUANTUM["id"]

    def test_irrelevant_paper_last(self):
        papers = [PAPER_QUANTUM, PAPER_COT, PAPER_RAG]
        ranked = rank_papers(papers, KEYWORDS, CATEGORIES, top_n=3)
        assert ranked[-1]["id"] == PAPER_QUANTUM["id"]

    def test_adds_relevance_score_field(self):
        papers = [PAPER_RAG]
        ranked = rank_papers(papers, KEYWORDS, CATEGORIES)
        assert "relevance_score" in ranked[0]

    def test_empty_input(self):
        ranked = rank_papers([], KEYWORDS, CATEGORIES)
        assert ranked == []
