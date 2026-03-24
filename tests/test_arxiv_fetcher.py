"""Tests for the arXiv fetcher — unit tests with mocked API."""

import importlib
from unittest.mock import MagicMock, patch
from datetime import datetime, timezone

import pytest

# find_code_url is pure python, import it directly from the script
import re
import sys
from pathlib import Path

# Import find_code_url without needing the arxiv package
_fetcher_src = Path(__file__).parent.parent / "scholarbite" / "arxiv_fetcher.py"
_code = _fetcher_src.read_text()
_ns = {"re": re, "__builtins__": __builtins__}
# Only exec the find_code_url function
_func_code = _code[_code.index("def find_code_url"):_code.index("\ndef fetch_papers")]
exec(_func_code, _ns)
find_code_url = _ns["find_code_url"]

arxiv_available = importlib.util.find_spec("arxiv") is not None


class TestFindCodeUrl:
    def test_finds_github_url(self):
        text = "Code available at https://github.com/user/repo for reproduction."
        assert find_code_url(text) == "https://github.com/user/repo"

    def test_finds_gitlab_url(self):
        text = "See https://gitlab.com/org/project for details."
        assert find_code_url(text) == "https://gitlab.com/org/project"

    def test_finds_huggingface_url(self):
        text = "Model at https://huggingface.co/org/model-name"
        assert find_code_url(text) == "https://huggingface.co/org/model-name"

    def test_returns_none_when_no_url(self):
        assert find_code_url("No code links here.") is None

    def test_finds_first_match(self):
        text = "https://github.com/a/b and https://gitlab.com/c/d"
        assert find_code_url(text) == "https://github.com/a/b"

    def test_handles_empty_string(self):
        assert find_code_url("") is None


@pytest.mark.skipif(not arxiv_available, reason="arxiv package not installed")
class TestFetchPapers:
    @patch("scholarbite.arxiv_fetcher.arxiv.Client")
    def test_returns_papers_as_dicts(self, mock_client_cls):
        from scholarbite.arxiv_fetcher import fetch_papers

        mock_result = MagicMock()
        mock_result.entry_id = "http://arxiv.org/abs/2403.12345"
        mock_result.title = "Test Paper\nWith Newline"
        mock_result.authors = [MagicMock(name="Alice Smith")]
        mock_result.summary = "An abstract\nwith newlines."
        mock_result.categories = ["cs.CL", "cs.AI"]
        mock_result.published = datetime(2026, 3, 24, tzinfo=timezone.utc)
        mock_result.pdf_url = "https://arxiv.org/pdf/2403.12345"
        mock_result.comment = "Code: https://github.com/test/repo"

        mock_client = MagicMock()
        mock_client.results.return_value = [mock_result]
        mock_client_cls.return_value = mock_client

        papers = fetch_papers(["cs.CL"], days=2)

        assert len(papers) == 1
        paper = papers[0]
        assert paper["id"] == "2403.12345"
        assert "\n" not in paper["title"]
        assert "\n" not in paper["abstract"]
        assert paper["code_url"] == "https://github.com/test/repo"
        assert paper["categories"] == ["cs.CL", "cs.AI"]

    @patch("scholarbite.arxiv_fetcher.arxiv.Client")
    def test_filters_old_papers(self, mock_client_cls):
        from scholarbite.arxiv_fetcher import fetch_papers

        old_result = MagicMock()
        old_result.entry_id = "http://arxiv.org/abs/2020.99999"
        old_result.published = datetime(2020, 1, 1, tzinfo=timezone.utc)

        mock_client = MagicMock()
        mock_client.results.return_value = [old_result]
        mock_client_cls.return_value = mock_client

        papers = fetch_papers(["cs.CL"], days=1)
        assert len(papers) == 0

    @patch("scholarbite.arxiv_fetcher.arxiv.Client")
    def test_no_code_url_when_absent(self, mock_client_cls):
        from scholarbite.arxiv_fetcher import fetch_papers

        mock_result = MagicMock()
        mock_result.entry_id = "http://arxiv.org/abs/2403.11111"
        mock_result.title = "No Code Paper"
        mock_result.authors = []
        mock_result.summary = "Just theory."
        mock_result.categories = ["cs.AI"]
        mock_result.published = datetime(2026, 3, 24, tzinfo=timezone.utc)
        mock_result.pdf_url = "https://arxiv.org/pdf/2403.11111"
        mock_result.comment = None

        mock_client = MagicMock()
        mock_client.results.return_value = [mock_result]
        mock_client_cls.return_value = mock_client

        papers = fetch_papers(["cs.AI"], days=2)
        assert papers[0]["code_url"] is None

    @patch("scholarbite.arxiv_fetcher.arxiv.Client")
    def test_keywords_included_in_query(self, mock_client_cls):
        from scholarbite.arxiv_fetcher import fetch_papers

        mock_client = MagicMock()
        mock_client.results.return_value = []
        mock_client_cls.return_value = mock_client

        fetch_papers(["cs.CL"], keywords=["llm", "rag"], days=1)
        mock_client.results.assert_called_once()
