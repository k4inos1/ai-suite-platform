from fastapi.testclient import TestClient

import main


def test_list_agents():
    client = TestClient(main.app)
    response = client.get("/agents")

    assert response.status_code == 200
    data = response.json()
    agent_ids = {agent["id"] for agent in data["agents"]}
    assert data["default_agent_id"] in agent_ids

def test_health_uses_ai_suite_platform_branding():
    client = TestClient(main.app)
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["service"] == "AI Suite Platform"
