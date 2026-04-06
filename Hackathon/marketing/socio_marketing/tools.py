from typing import Dict, Any, Optional
from google.adk.tools import ToolContext, FunctionTool

from google.cloud import storage

# ---------------------------------------------------------
# 1️⃣ Fetch Social Data
# ---------------------------------------------------------

def fetch_social_data(
    tool_context: ToolContext,
    file_name: str = "social data.txt"
) -> Dict[str, Any]:
    """
    Retrieves raw social media performance data from the bucket.
    """
    state = tool_context.state
    
    # In a real implementation, this would interface with GCS
    # For now, we simulate the retrieval and update state memory
    state["last_data_fetch"] = file_name
    state["data_available"] = True
    state["last_tool_used"] = "fetch_social_data"

    # We store a snippet or status in state for the Orchestrator to track
    state["current_context"] = "Raw social metrics loaded for SweetTreatsBakery."

    return {
        "status": "success",
        "file": file_name,
        "message": f"Successfully retrieved {file_name} from the storage bucket."
    }


# ---------------------------------------------------------
# 2️⃣ Upload Report
# ---------------------------------------------------------

def upload_report(
    tool_context: ToolContext,
    report_content: str,
    file_name: str = "marketing_performance_report.md"
) -> Dict[str, Any]:
    """
    Saves a compiled Markdown report or text file back to the storage bucket.
    """
    bucket_name = "socialmarketing123"
    state = tool_context.state

    try:
        # --- Physical Upload Logic ---
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(file_name)
        
        # Upload the actual string content provided by the agent
        blob.upload_from_string(report_content, content_type="text/markdown")

        # --- Persist the upload status in state memory ---
        state["last_upload_name"] = file_name
        state["upload_timestamp"] = "2026-04-04" 
        state["report_ready_for_email"] = True
        state["last_tool_used"] = "upload_report"

        # Store the content summary in state so the Orchestrator can draft the email
        state["final_report_summary"] = report_content[:200] + "..."

        return {
            "status": "uploaded",
            "destination": f"gs://{bucket_name}/{file_name}",
            "message": f"File '{file_name}' has been successfully saved to the bucket."
        }

    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to upload to GCS: {str(e)}"
        }


# ---------------------------------------------------------
# 3️⃣ Internal State Reset (Optional Utility)
# ---------------------------------------------------------


def reset_workflow_state(
    tool_context: ToolContext
) -> Dict[str, Any]:
    """
    Resets the internal state of the marketing workflow.
    """
    tool_context.state.clear()
    # Add logic here if you need to clear temp files or variables
    print("Workflow state has been reset.")
    return {"message": "Workflow reset successfully."}



# ---------------------------------------------------------
# 🧰 ADK Tool Registration
# ---------------------------------------------------------

fetch_social_data_tool = FunctionTool(
    fetch_social_data
   
)

upload_report_tool = FunctionTool(
    upload_report
)

reset_workflow_state_tool = FunctionTool(
    reset_workflow_state
   
)