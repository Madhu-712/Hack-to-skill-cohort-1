import os
import sys

# Add the current directory to sys.path to resolve relative imports
sys.path.append(os.path.dirname(__file__))

from . import agent as root_agent

__all__ = ["root_agent"]