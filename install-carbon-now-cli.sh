#!/bin/sh

# Define the CLI tool name you want to install
cli_tool_name="carbon-now-cli"

# Check if the CLI tool is already installed globally
if pnpm list --depth 0 | grep -q "$cli_tool_name"; then
  echo "\"$cli_tool_name\" is already installed globally."
else
  # Install the specified CLI tool only if it's not already installed
  pnpm install  "$cli_tool_name"
fi