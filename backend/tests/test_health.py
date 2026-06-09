from fastapi.testclient import TestClient

import main


def test_health_endpoint_returns_status_and_mode():
    client = TestClient(main.app)
    response = client.get("/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert "demo_mode" in payload


def test_chunk_text_splits_content():
    chunks = list(main.chunk_text("one two three four", chunk_size=8))
    assert chunks
