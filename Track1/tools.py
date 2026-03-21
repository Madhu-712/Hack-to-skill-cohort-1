from typing import Dict, Any
from google.adk.tools import ToolContext, FunctionTool

# ---------------------------------------------------------
# 1️⃣ Classify customer message
# ---------------------------------------------------------

def classify_customer_message(
    tool_context: ToolContext,
    message: str
) -> Dict[str, Any]:
    state = tool_context.state

    message_lower = message.lower()

    if any(k in message_lower for k in ["payment", "refund", "invoice", "charged"]):
        category = "BILLING"
    elif any(k in message_lower for k in ["error", "bug", "crash", "slow"]):
        category = "TECHNICAL"
    elif any(k in message_lower for k in ["login", "password", "account"]):
        category = "ACCOUNT"
    else:
        category = "GENERAL"

    # Persist state
    state["category"] = category
    state["awaiting_user_confirmation"] = True
    state["last_tool_used"] = "classify_customer_message"

    return {
        "category": category,
        "message": (
            f"I’ve classified your issue as {category}. "
            "Would you like help resolving this?"
        )
    }


# ---------------------------------------------------------
# 2️⃣ Request screenshot and details
# ---------------------------------------------------------

def request_screenshot(
    tool_context: ToolContext
) -> Dict[str, Any]:
    state = tool_context.state

    state["awaiting_screenshot"] = True
    state["last_tool_used"] = "request_screenshot"

    return {
        "message": (
            "Please upload a screenshot of the issue and "
            "share more details so I can help you better."
        )
    }


# ---------------------------------------------------------
# 3️⃣ Analyze screenshot / user-provided details
# ---------------------------------------------------------

def analyze_screenshot(
    tool_context: ToolContext,
    description: str
) -> Dict[str, Any]:
    state = tool_context.state

    state["screenshot_analyzed"] = True
    state["analysis_summary"] = description
    state["last_tool_used"] = "analyze_screenshot"

    return {
        "analysis": "Screenshot and details analyzed successfully.",
        "summary": description
    }


# ---------------------------------------------------------
# 4️⃣ Create support ticket
# ---------------------------------------------------------

def create_support_ticket(
    tool_context: ToolContext
) -> Dict[str, Any]:
    state = tool_context.state

    ticket = {
        "category": state.get("category", "UNKNOWN"),
        "summary": state.get("analysis_summary", "No details provided"),
    }

    state["ticket_created"] = True
    state["ticket"] = ticket
    state["last_tool_used"] = "create_support_ticket"

    return {
        "status": "created",
        "ticket": ticket
    }

def perform_research(
    tool_context: ToolContext,
    description: str
) -> Dict[str, Any]:
    state = tool_context.state
    state["google_search"] = True
    state["google_search_summary"] = description
    state["last_tool_used"] = "research"

    return {
        "message": "Researching resolution steps for the user's issue..."
    }







# ---------------------------------------------------------
# 🧰 ADK Tool Registration
# ---------------------------------------------------------

classify_customer_message_tool = FunctionTool(
    classify_customer_message
)

request_screenshot_tool = FunctionTool(
    request_screenshot
)

analyze_screenshot_tool = FunctionTool(
    analyze_screenshot
)

create_support_ticket_tool = FunctionTool(
    create_support_ticket
)

research_tool = FunctionTool(
    perform_research
)







