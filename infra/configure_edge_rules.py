import json
import os
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen


def api(method, path="", rule=None):
    request = Request(
        f"https://api.bunny.net/pullzone/{os.environ['CDN_PULL_ZONE_ID']}{path}",
        method=method,
        data=json.dumps(rule).encode("utf-8") if rule is not None else None,
        headers={
            "AccessKey": os.environ["BUNNYNET_API_KEY"],
            "Content-Type": "application/json",
        },
    )
    try:
        with urlopen(request, timeout=30) as response:
            return response.read()
    except HTTPError as error:
        with error:
            detail = error.read().decode("utf-8", errors="replace").strip()
        detail = detail.replace(os.environ["BUNNYNET_API_KEY"], "[REDACTED]")
        name = f" for rule {rule['Description']!r}" if rule is not None else ""
        raise RuntimeError(
            f"Bunny API {method} {path or '/'}{name}: HTTP {error.code} "
            f"{error.reason}. Response: {detail or '(empty response body)'}"
        ) from None


def main():
    current_rules = json.loads(api("GET"))["EdgeRules"]
    max_order = max((rule["OrderIndex"] for rule in current_rules), default=0)
    order_offset = (max_order // 100 + 1) * 100

    new_rules = json.loads(Path(__file__).with_name("edge_rules.json").read_text(encoding="utf-8"))

    for rule in new_rules:
        rule["OrderIndex"] += order_offset
        api("POST", "/edgerules/addOrUpdate", rule)

    for rule in current_rules:
        api("DELETE", f"/edgerules/{rule['Guid']}")

    print(f"Created {len(new_rules)} edge rules; deleted {len(current_rules)} old edge rules.")


if __name__ == "__main__":
    main()
