from __future__ import annotations
from typing import Dict, Any, List
import re

ERROR_PATTERNS = [
    (re.compile(r"T\d+ timeout", re.I), "timer_timeout"),
    (re.compile(r"auth(entication)? fail", re.I), "auth_failure"),
    (re.compile(r"rrc\s*reconfig", re.I), "rrc_reconfig"),
    (re.compile(r"pdcp|rlc|mac error", re.I), "layer_error"),
]

KEY_CODES = {
    "ATTACH_REJECT": "attach_reject",
    "REGISTRATION_REJECT": "registration_reject",
    "AUTH_FAILURE": "auth_failure",
}


def extract_features(events: List[Dict[str, Any]]) -> Dict[str, Any]:
    features: Dict[str, Any] = {
        "num_events": len(events),
        "num_errors": 0,
        "num_warnings": 0,
        "has_auth_failure": 0,
        "has_timer_timeout": 0,
        "has_rrc_reconfig": 0,
        "first_error_code": "none",
    }

    for ev in events:
        level = (ev.get("level") or "").lower()
        code = ev.get("code") or ""
        message = ev.get("message") or ""

        if level == "error":
            features["num_errors"] += 1
        elif level == "warn" or level == "warning":
            features["num_warnings"] += 1

        if code in KEY_CODES:
            if code == "AUTH_FAILURE":
                features["has_auth_failure"] = 1
            if features["first_error_code"] == "none" and level == "error":
                features["first_error_code"] = KEY_CODES[code]

        for pattern, tag in ERROR_PATTERNS:
            if pattern.search(message):
                if tag == "timer_timeout":
                    features["has_timer_timeout"] = 1
                elif tag == "auth_failure":
                    features["has_auth_failure"] = 1
                elif tag == "rrc_reconfig":
                    features["has_rrc_reconfig"] = 1

    return features

