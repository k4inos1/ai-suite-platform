from fastapi.testclient import TestClient

import main


def test_health_endpoint_returns_status_and_mode():
    client = TestClient(main.app)
    response = client.get("/health")

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert "demo_mode" in payload

