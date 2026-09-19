import json
import os
from pathlib import Path
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
    with urlopen(request, timeout=30) as response:
        return response.read()


def main():
    rules = json.loads(Path(__file__).with_name("redirects.json").read_text(encoding="utf-8"))
    current = json.loads(api("GET"))["EdgeRules"]
    old_redirects = [rule for rule in current if rule["ActionType"] == 1]

    for rule in rules:
        api("POST", "/edgerules/addOrUpdate", rule)

    for rule in old_redirects:
        api("DELETE", f"/edgerules/{rule['Guid']}")

    print(f"Created {len(rules)} redirects; deleted {len(old_redirects)} old redirects.")


if __name__ == "__main__":
    main()
