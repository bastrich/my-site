import json
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
import sys

TIMEOUT = 20
WORKERS = 8

def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "bastrich-cache-warmer"})
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
            response.read()
            return response.status
    except urllib.error.HTTPError as error:
        return error.code
    except Exception as error:
        return str(error)


def handler(event, context):
    site = event["site"]
    paths = event["paths"]

    with ThreadPoolExecutor(WORKERS) as pool:
        statuses = list(pool.map(lambda path: fetch(f"https://{site}{path}"), paths))

    warmed = sum(1 for status in statuses if status == 200)
    problems = {path: status for path, status in zip(paths, statuses) if status != 200}
    return {"site": site, "requested": len(paths), "warmed": warmed, "problems": problems}


if __name__ == "__main__":
    print(json.dumps(handler(json.loads(sys.argv[1]), None), indent=2))
