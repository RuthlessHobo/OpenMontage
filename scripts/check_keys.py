#!/usr/bin/env python3
"""
check_keys.py — verify which OpenMontage API keys are configured.

Safe to commit and safe to run in any session: it reads os.environ and prints
ONLY whether each key is present and its length. It never prints key values.

Keys are expected to come from the cloud environment's "Environment variables"
(Claude Code on the web) or a local, gitignored .env file. See docs/SECRETS.md.

Usage:
    python scripts/check_keys.py          # presence table
    python scripts/check_keys.py --live   # also probe reachability (may 403 on
                                          # restricted-network environments)
"""
from __future__ import annotations

import os
import sys

# Try to load a local .env if python-dotenv is available (no-op in cloud envs
# where the vars are already exported).
try:
    from dotenv import load_dotenv

    load_dotenv()
except Exception:
    pass

# (env var, human label, free tier?, what it unlocks)
KEYS = [
    ("GOOGLE_API_KEY",      "Google AI / Gemini",  True,  "image gen + TTS + LLM"),
    ("PEXELS_API_KEY",      "Pexels",              True,  "stock video/photo"),
    ("PIXABAY_API_KEY",     "Pixabay",             True,  "stock video/photo"),
    ("UNSPLASH_ACCESS_KEY", "Unsplash",            True,  "stock images"),
    ("ELEVENLABS_API_KEY",  "ElevenLabs",          True,  "TTS / music / SFX"),
    ("HF_TOKEN",            "HuggingFace",         True,  "diarization / inference"),
    ("FAL_KEY",             "fal.ai",              False, "FLUX / Veo / Kling"),
    ("XAI_API_KEY",         "xAI / Grok",          False, "image + video gen"),
    ("OPENAI_API_KEY",      "OpenAI",              False, "TTS / DALL-E"),
    ("RUNWAY_API_KEY",      "Runway",              False, "Gen-4 video"),
    ("HEYGEN_API_KEY",      "HeyGen",              False, "avatar video"),
    ("SUNO_API_KEY",        "Suno",                False, "music (reseller only)"),
]

# Lightweight, free reachability probes for --live. (host, url, header_fn)
# header_fn returns dict of headers given the key value.
LIVE_PROBES = {
    "GOOGLE_API_KEY":      lambda k: ("GET",  f"https://generativelanguage.googleapis.com/v1beta/models?key={k}", {}),
    "PEXELS_API_KEY":      lambda k: ("GET",  "https://api.pexels.com/v1/search?query=test&per_page=1", {"Authorization": k}),
    "UNSPLASH_ACCESS_KEY": lambda k: ("GET",  "https://api.unsplash.com/photos?per_page=1", {"Authorization": f"Client-ID {k}"}),
    "ELEVENLABS_API_KEY":  lambda k: ("GET",  "https://api.elevenlabs.io/v1/user", {"xi-api-key": k}),
    "HF_TOKEN":            lambda k: ("GET",  "https://huggingface.co/api/whoami-v2", {"Authorization": f"Bearer {k}"}),
    "XAI_API_KEY":         lambda k: ("GET",  "https://api.x.ai/v1/models", {"Authorization": f"Bearer {k}"}),
    "PIXABAY_API_KEY":     lambda k: ("GET",  f"https://pixabay.com/api/?key={k}&q=test&per_page=3", {}),
}


def presence_table() -> int:
    set_count = 0
    print(f"{'STATUS':<8} {'KEY':<22} {'SERVICE':<22} {'FREE':<5} INFO")
    print("-" * 78)
    for env, label, free, info in KEYS:
        val = os.environ.get(env, "")
        if val:
            set_count += 1
            status, detail = "  SET", f"len={len(val)}"
        else:
            status, detail = "  --", "not configured"
        free_s = "yes" if free else "paid"
        print(f"{status:<8} {env:<22} {label:<22} {free_s:<5} {info} ({detail})")
    print("-" * 78)
    print(f"{set_count}/{len(KEYS)} keys configured")
    return set_count


def live_probe() -> None:
    import urllib.error
    import urllib.request

    print("\nReachability (HTTP code; 200=ok, 401/403=auth/blocked):")
    print("-" * 78)
    for env, label, *_ in KEYS:
        if env not in LIVE_PROBES:
            continue
        val = os.environ.get(env, "")
        if not val:
            print(f"  --   {label:<22} (no key)")
            continue
        method, url, headers = LIVE_PROBES[env](val)
        req = urllib.request.Request(url, method=method, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                code = r.status
        except urllib.error.HTTPError as e:
            code = e.code
        except Exception as e:  # network blocked, DNS, proxy, etc.
            print(f"  ???  {label:<22} unreachable: {type(e).__name__}")
            continue
        print(f"  {code}  {label:<22} {url.split('?')[0]}")


def main() -> int:
    count = presence_table()
    if "--live" in sys.argv:
        live_probe()
    # Exit non-zero only if nothing is configured, so CI/setup can gate on it.
    return 0 if count else 1


if __name__ == "__main__":
    raise SystemExit(main())
