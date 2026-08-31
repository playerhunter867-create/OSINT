from pathlib import Path
import json
import sys
from functools import lru_cache
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

ROOT = Path(__file__).resolve().parents[1]
SHERLOCK = ROOT / "sherlock-engine"
FRAMEWORK = ROOT / "osint-framework"
sys.path.insert(0, str(SHERLOCK))

from sherlock_project.sites import SitesInformation  # noqa: E402
from sherlock_project.sherlock import sherlock  # noqa: E402
from sherlock_project.notify import QueryNotifyPrint  # noqa: E402

app = FastAPI(title="OSINT Hub API", version="0.2.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False,
                   allow_methods=["GET"], allow_headers=["*"])

@lru_cache(maxsize=1)
def catalog():
    with (FRAMEWORK / "public" / "arf.json").open("r", encoding="utf-8") as f:
        return json.load(f)

def flatten(node, path=None):
    path = path or []
    children = node.get("children") or []
    if not children:
        item = dict(node)
        item["category"] = path[-1] if path else "Other"
        item["categories"] = path
        return [item]
    out = []
    name = node.get("name")
    next_path = path + ([name] if name else [])
    for child in children:
        out.extend(flatten(child, next_path))
    return out

@app.get("/api/health")
def health():
    return {"ok": True, "service": "osint-hub", "version": app.version}

@app.get("/api/catalog")
def get_catalog():
    tree = catalog()
    resources = flatten(tree)
    categories = sorted({c for item in resources for c in item["categories"] if c}, key=str.casefold)
    return {"name": tree.get("name", "OSINT Framework"), "resources": resources,
            "resource_count": len(resources), "category_count": len(categories),
            "categories": categories}

@app.get("/api/username/{username}")
def username_search(username: str):
    if not username or len(username) > 64:
        raise HTTPException(status_code=400, detail="Invalid username")
    if any(ch.isspace() for ch in username):
        raise HTTPException(status_code=400, detail="Username must not contain whitespace")
    data_file = SHERLOCK / "sherlock_project" / "resources" / "data.json"
    with data_file.open("r", encoding="utf-8") as f:
        site_data = json.load(f)
    sites = SitesInformation(site_data)
    notifier = QueryNotifyPrint(show_all=False, print_color=False)
    results = sherlock(username, sites.sites, notifier, timeout=15)
    normalized = []
    for site, data in results.items():
        result = data.get("status")
        normalized.append({"site": site, "status": getattr(result, "name", str(result)),
                           "url": data.get("url_user", "")})
    normalized.sort(key=lambda x: x["site"].lower())
    found = [x for x in normalized if x["status"] == "CLAIMED"]
    return {"username": username, "checked": len(normalized), "found": len(found), "results": normalized}
