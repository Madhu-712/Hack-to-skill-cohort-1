


import os
from toolbox_core import ToolboxSyncClient
from google.adk.agents import Agent

TOOLBOX_URL = os.getenv("TOOLBOX_URL", "http://127.0.0.1:5000")
bigquery_toolbox = ToolboxSyncClient(TOOLBOX_URL)
bigquery_toolset = bigquery_toolbox.load_toolset()

root_agent = Agent(
   model="gemini-2.5-flash",
   name="bigquery_agent",
   description=(
       "Agent that answers questions about BigQuery data by executing SQL queries"
   ),
   instruction=""" You are a data analysis agent with access to several BigQuery tools. Make use of those tools to answer the user's questions.
   """,
   tools=bigquery_toolset
)