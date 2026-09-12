#!/usr/bin/env node
const { execFileSync } = require('child_process');
const fs = require('fs');

const TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkN1Z1RrY3JBRytHQ0VTWDciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2ZqZWR6bmRoc2t5b2VrbGNsbGliLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIyYjYxZjMyMC01NGNmLTRjM2UtOWM4Ni00OTlkNDFmNjA2ZjkiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzg5MTc0NjI3LCJpYXQiOjE3ODkxNzEwMjcsImVtYWlsIjoiaGFyc2hrb2xpLm1zb3RAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJnb29nbGUiLCJwcm92aWRlcnMiOlsiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMendsVHhfcjREYThtSFRhRmJoMktRaGlHdmM0eXU3Vm9sUjdQLXRoVjRyamZaZ0E9czk2LWMiLCJlbWFpbCI6ImhhcnNoa29saS5tc290QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJIYXJzaCBLb2xpIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tIiwibmFtZSI6IkhhcnNoIEtvbGkiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMendsVHhfcjREYThtSFRhRmJoMktRaGlHdmM0eXU3Vm9sUjdQLXRoVjRyamZaZ0E9czk2LWMiLCJwcm92aWRlcl9pZCI6IjExNzcyMzk2ODE0OTY5NTg5NTM2NSIsInN1YiI6IjExNzcyMzk2ODE0OTY5NTg5NTM2NSJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im9hdXRoIiwidGltZXN0YW1wIjoxNzg5MTcxMDI3fV0sInNlc3Npb25faWQiOiI4OGQ1YjRmOC0xODkwLTQ2ZjAtYWE0MC03YTU5N2RkNDliZjIiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.HOXBG4g9xeshImmEFB-aAl6p9RE4TfkbPyDPLIZ2Prw";
const ENDPOINT = "https://api.flowstep.ai/mcp";

function callTool(name, args) {
  const payload = JSON.stringify({
    jsonrpc: "2.0",
    id: Date.now(),
    method: "tools/call",
    params: { name, arguments: args }
  });

  const res = execFileSync("/usr/bin/curl", [
    "-s", "-X", "POST", ENDPOINT,
    "-H", `Authorization: Bearer ${TOKEN}`,
    "-H", "Content-Type: application/json",
    "-H", "Accept: application/json, text/event-stream",
    "-d", payload
  ], { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });

  for (const line of res.split("\n")) {
    if (line.startsWith("data:")) {
      return JSON.parse(line.slice(5).trim());
    }
  }
  return null;
}

const tool = process.argv[2];
const args = process.argv[3] ? JSON.parse(process.argv[3]) : {};

if (!tool) {
  console.log("Usage: node scripts/flowstep_call.js <tool> '<json_args>'");
  process.exit(1);
}

const result = callTool(tool, args);
console.log(JSON.stringify(result, null, 2));
