import requests

response = requests.post(
    "https://bigquery-agent-v32-h2fgvrniba-uc.a.run.app/run",
    json={
        "app_name": "bq",
        "user_id": "user1",
        "session_id": "session1",
        "new_message": {
            "role": "user",
            "parts": [{"text": "What datasets are available?"}]
        }
    }
)
print(response.json())