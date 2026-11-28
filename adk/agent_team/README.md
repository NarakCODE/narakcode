# ADK 2.0 agent team workflow

Standalone ADK 2.0 workflow for running the `narakcode.dev` agent team outside Google Antigravity.

## Topology

```
planner (gemini-4-neon)
  ├── registry_worker (gemini-4-hydrogen)
  ├── content_worker  (gemini-4-hydrogen)
  └── ui_worker       (gemini-4-hydrogen)
        └── JoinNode (join_workers)
              └── verifier (gemini-4-neon, output_schema=VerificationReport)
                    ├── pass -> ship_summary
                    ├── revise (round < 2) -> planner
                    └── revise (round >= 2) -> escalate_to_user
```

## Run locally with `adk web` first

1. Export your API key in your shell (never commit or paste keys in chat):

```bash
export GEMINI_API_KEY="your-key-here"
```

2. Install Google ADK in a Python virtual environment (ask before installing if an agent is running):

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install google-adk pydantic
```

3. Launch the local dev UI from the `adk/` directory:

```bash
cd adk
adk web
```

Open the local URL printed by `adk web`, select `agent_team`, and test a read-only task first before wiring write tools or deploying.
