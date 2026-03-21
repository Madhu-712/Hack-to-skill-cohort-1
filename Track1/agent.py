import os
import logging
import google.cloud.logging
from dotenv import load_dotenv
# --- Setup Logging and Environment ---

cloud_logging_client = google.cloud.logging.Client()
cloud_logging_client.setup_logging()

load_dotenv()

model_name = os.getenv("MODEL")



# agent.py
from google.adk.agents import Agent

from google.adk.tools import google_search
from tools import (
    classify_customer_message_tool,
    request_screenshot_tool,
    analyze_screenshot_tool,
    create_support_ticket_tool,
    research_tool
)

root_agent = Agent(
    name="customer_support_agent",
    model="gemini-2.5-flash",
    instruction="""
You are a customer support agent.

Rules:
- Classify messages into EXACTLY ONE category:
  BILLING, TECHNICAL, ACCOUNT, GENERAL
- Ask user if they want help
- If yes, request screenshot and details
- Analyze screenshot and give step by step resolution to solve the issue.
- Create a support ticket and provide ticket number and complete details of ticket.
-Use google search tool to resolve the issue step by step and give guidance to user.

Always use tools to update state.
""",
    tools=[
        classify_customer_message_tool,
        request_screenshot_tool,
        analyze_screenshot_tool,
        create_support_ticket_tool,
        research_tool
    ],
)
