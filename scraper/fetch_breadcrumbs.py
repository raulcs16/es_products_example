import json
import urllib.parse
import urllib.request

def fetch_breadcrumbs(record_id: str) -> list:
    """Fetches breadcrumb hierarchy for a specific product record from Salesforce Aura B2B API."""
    url = "https://www.applied-motion.com/s/sfsites/aura?r=31&aura.ApexAction.execute=1"

    headers = {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://www.applied-motion.com",
        "Pragma": "no-cache",
        "Referer": f"https://www.applied-motion.com/s/product/detail/{record_id}",
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36"
        ),
    }

    message_payload = {
        "actions": [
            {
                "id": "357;a",
                "descriptor": "aura://ApexActionController/ACTION$execute",
                "callingDescriptor": "UNKNOWN",
                "params": {
                    "namespace": "",
                    "classname": "B2BBreadcrumbsController",
                    "method": "getBreadcrumbs",
                    "params": {"recordId": record_id},
                    "cacheable": False,
                    "isContinuation": False,
                },
            }
        ]
    }

    aura_context = {
        "mode": "PROD",
        "fwuid": "SGRNczhXdnNHNDNKUWhIdXFhdFJlUWtVMjdnTGFERUU2S3FfSVdrcU92bkExNS4zLjE2MDEw",
        "app": "siteforce:communityApp",
        "loaded": {
            "APPLICATION@markup://siteforce:communityApp": "1888_-kKAFK7UHxK1kDSaicKEkw"
        },
        "dn": [],
        "globals": {},
        "uad": True,
    }

    form_data = urllib.parse.urlencode(
        {
            "message": json.dumps(message_payload),
            "aura.context": json.dumps(aura_context),
            "aura.pageURI": f"/s/product/detail/{record_id}",
            "aura.token": "null",
        }
    ).encode("utf-8")

    req = urllib.request.Request(url, data=form_data, headers=headers)

    try:
        with urllib.request.urlopen(req) as response:
            response_data = json.loads(response.read().decode("utf-8"))
            actions = response_data.get("actions", [])
            for action in actions:
                return_val = action.get("returnValue", {}).get("returnValue", {})
                response_data_list = return_val.get("responseData", [])
                if response_data_list:
                    return response_data_list
        return []
    except Exception as e:
        print(f"Error fetching breadcrumbs for {record_id}: {e}")
        return []