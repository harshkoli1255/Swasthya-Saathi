#!/usr/bin/env python3
import sys
import json
import subprocess

TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkN1Z1RrY3JBRytHQ0VTWDciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2ZqZWR6bmRoc2t5b2VrbGNsbGliLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI3MGU3OWYyMC1kOTZjLTQzZmItYjA1Ny1kMWZlZDI1NmYxZjkiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzg5MTcxMDA2LCJpYXQiOjE3ODkxNjc0MDYsImVtYWlsIjoiaGFyc2hrb2xpY29vbEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6Imdvb2dsZSIsInByb3ZpZGVycyI6WyJnb29nbGUiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0xsc3JIaVlxOFQ1QXdPSDJzeEN3YTZWY2pwUlQtZFBFdE85OXpSNUhtRWdVWllOQT1zOTYtYyIsImVtYWlsIjoiaGFyc2hrb2xpY29vbEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiSGFyc2ggS29saSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJIYXJzaCBLb2xpIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTGxzckhpWXE4VDVBd09IMnN4Q3dhNlZjanBSVC1kUEV0Tzk5elI1SG1FZ1VaWU5BPXM5Ni1jIiwicHJvdmlkZXJfaWQiOiIxMTA0MDM0MTcxMDM5MDEyNDc3MDkiLCJzdWIiOiIxMTA0MDM0MTcxMDM5MDEyNDc3MDkifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvYXV0aCIsInRpbWVzdGFtcCI6MTc4OTE2NzQwNn1dLCJzZXNzaW9uX2lkIjoiMTU4NmFmNzYtMzU3Yy00OGM3LWFmZDUtMzg3ZDNiOWQyMzk2IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.SZYqYYspLXf0Qj58ab0qK9vX8Y21J3D7954xDGf8iHE"
ENDPOINT = "https://api.flowstep.ai/mcp"

def call_tool(name: str, arguments: dict):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/call",
        "params": {
            "name": name,
            "arguments": arguments
        }
    }
    cmd = [
        "/usr/bin/curl", "-s", "-X", "POST", ENDPOINT,
        "-H", f"Authorization: Bearer {TOKEN}",
        "-H", "Content-Type: application/json",
        "-H", "Accept: application/json, text/event-stream",
        "-d", json.dumps(payload)
    ]
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if proc.returncode != 0:
        print(f"Error executing curl: {proc.stderr}", file=sys.stderr)
        return None

    for line in proc.stdout.splitlines():
        if line.startswith("data:"):
            return json.loads(line[5:].strip())
    return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: flowstep_call.py <tool_name> '<json_arguments>'")
        sys.exit(1)
    tool = sys.argv[1]
    args = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
    res = call_tool(tool, args)
    print(json.dumps(res, indent=2))
