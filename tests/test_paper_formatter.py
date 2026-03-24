"""Tests for the paper formatter."""

from datetime import datetime, timezone

from scholarbite.paper_formatter import format_daily_report, format_paper


SAMPLE_PAPER = {
    "id": "2403.12345",
    "title": "Scaling RAG with Multi-Agent LLMs",
    "authors": ["Alice Smith", "Bob Jones", "Carol Lee", "Dave Kim"],
    "abstract": "We propose a novel RAG framework for improved retrieval.",
    "categories": ["cs.CL", "cs.AI"],
    "published": "2026-03-24T00:00:00",
    "pdf_url": "https://arxiv.org/pdf/2403.12345",
    "code_url": "https://github.com/example/rag-agents",
    "relevance_score": 9,
}

SAMPLE_PAPER_NO_CODE = {
    "id": "2403.67890",
    "title": "Chain-of-Thought Reasoning in Agents",
    "authors": ["Frank Miller", "Grace Chen"],
    "abstract": "We study chain-of-thought reasoning patterns.",
    "categories": ["cs.AI"],
    "published": "2026-03-24T00:00:00",
    "pdf_url": "https://arxiv.org/pdf/2403.67890",
    "code_url": None,
    "relevance_score": 7,
}


class TestFormatPaper:
    def test_contains_arxiv_link(self):
        result = format_paper(SAMPLE_PAPER, 1)
        assert "https://arxiv.org/abs/2403.12345" in result

    def test_contains_title(self):
        result = format_paper(SAMPLE_PAPER, 1)
        assert "Scaling RAG with Multi-Agent LLMs" in result

    def test_truncates_authors_with_et_al(self):
        result = format_paper(SAMPLE_PAPER, 1)
        assert "Alice Smith et al." in result

    def test_shows_all_authors_when_three_or_fewer(self):
        result = format_paper(SAMPLE_PAPER_NO_CODE, 1)
        assert "Frank Miller, Grace Chen" in result

    def test_shows_code_url_when_present(self):
        result = format_paper(SAMPLE_PAPER, 1)
        assert "github.com/example/rag-agents" in result

    def test_no_code_line_when_absent(self):
        result = format_paper(SAMPLE_PAPER_NO_CODE, 1)
        assert "Code:" not in result

    def test_shows_relevance_score(self):
        result = format_paper(SAMPLE_PAPER, 1)
        assert "9/10" in result

    def test_index_number(self):
        result = format_paper(SAMPLE_PAPER, 5)
        assert "5." in result


class TestFormatDailyReport:
    def test_contains_header(self):
        report = format_daily_report([SAMPLE_PAPER])
        assert "ScholarBite Daily Digest" in report

    def test_contains_date(self):
        date = datetime(2026, 3, 24, tzinfo=timezone.utc)
        report = format_daily_report([SAMPLE_PAPER], date=date)
        assert "March 24, 2026" in report

    def test_contains_paper_count(self):
        papers = [SAMPLE_PAPER, SAMPLE_PAPER_NO_CODE]
        report = format_daily_report(papers)
        assert "2 papers" in report

    def test_highlights_section_with_3_papers(self):
        papers = [SAMPLE_PAPER, SAMPLE_PAPER_NO_CODE, SAMPLE_PAPER]
        report = format_daily_report(papers)
        assert "Highlights" in report

    def test_no_highlights_with_fewer_than_3(self):
        report = format_daily_report([SAMPLE_PAPER])
        assert "Highlights" not in report

    def test_reply_prompt_at_end(self):
        report = format_daily_report([SAMPLE_PAPER])
        assert "Reply to ask questions" in report

    def test_empty_papers_list(self):
        report = format_daily_report([])
        assert "0 papers" in report
