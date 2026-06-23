# API Keys & Secrets

This project never stores secret **values** in the repo. Only the **names** of
the environment variables it reads live here. This file is the canonical list
so any session (web, desktop, or a fresh clone) knows what to configure.

## Where the values live

| Context | Where keys come from | Persistent? |
| --- | --- | --- |
| **Claude Code on the web** | The environment's **Environment variables** field (web UI) | ✅ across sessions |
| **Local machine** | A gitignored `.env` file at the repo root | ✅ on that machine |
| **CI / other tools** | A secrets manager (Doppler / Infisical / 1Password) injecting env vars | ✅ |

> ⚠️ Never commit a `.env` with real values, and never paste keys into source
> files. `.env` is already in `.gitignore`. Keys committed to git must be
> rotated — git history is permanent.

## Configure on Claude Code for the web (recommended for "any AI session")

1. Click the **environment name** (cloud icon) at the top → open the selector.
2. Hover your environment → click the **gear / settings** icon.
3. Paste keys into **Environment variables** in `.env` format — one
   `KEY=value` per line, **no quotes** (quotes are stored literally).
4. Save. Every new session in that environment gets them as `os.environ`.

> Network note: setting a key is not enough to *call* an API from a web
> session. The environment's network-access level / allowlist must permit the
> API host (e.g. `api.pexels.com`, `api.elevenlabs.io`, `fal.run`,
> `api.x.ai`, `huggingface.co`). `generativelanguage.googleapis.com` (Google)
> is typically reachable by default. Raise the network level or add a custom
> allowlist in the same environment settings if calls return `403 Host not in
> allowlist`.

## Configure locally

```bash
cp .env.example .env   # then edit .env and fill in your keys
```

## Canonical variable list

Free-tier friendly (good starting set):

| Variable | Service | Unlocks | Get a key |
| --- | --- | --- | --- |
| `GOOGLE_API_KEY` | Google AI / Gemini | image gen + TTS + LLM | https://aistudio.google.com/apikey |
| `PEXELS_API_KEY` | Pexels | stock video/photo | https://www.pexels.com/api/ |
| `PIXABAY_API_KEY` | Pixabay | stock video/photo | https://pixabay.com/api/docs/ |
| `UNSPLASH_ACCESS_KEY` | Unsplash | stock images | https://unsplash.com/developers |
| `ELEVENLABS_API_KEY` | ElevenLabs | TTS / music / SFX | https://elevenlabs.io/sign-up |
| `HF_TOKEN` | HuggingFace | diarization / inference | https://huggingface.co/settings/tokens |

Paid / card required:

| Variable | Service | Unlocks |
| --- | --- | --- |
| `FAL_KEY` | fal.ai | FLUX / Veo / Kling (free credits, then paid) |
| `XAI_API_KEY` | xAI / Grok | image + video gen (free credits, then paid) |
| `OPENAI_API_KEY` | OpenAI | TTS / DALL-E |
| `RUNWAY_API_KEY` | Runway | Gen-4 video |
| `HEYGEN_API_KEY` | HeyGen | avatar video |
| `SUNO_API_KEY` | Suno | music (no official API; reseller keys only) |

Provider-specific notes:

- **Google**: use *Gemini 2.5 Flash Image* for free image gen — **Imagen is paid-only**.
- **HuggingFace**: accept the license on each gated `pyannote` repo or the token errors out.
- **Unsplash**: new apps start in Demo mode (50 req/hr); apply for Production (5,000 req/hr) in the app dashboard. Only the **Access Key** is needed — the Secret Key is for OAuth and should stay private.

## Verify what's configured

```bash
python scripts/check_keys.py          # ✅/❌ presence table (prints no values)
python scripts/check_keys.py --live   # also probes reachability (HTTP codes)
```
