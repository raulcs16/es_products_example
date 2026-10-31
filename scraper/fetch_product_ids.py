import json
import urllib.parse
import urllib.request


def fetch_product_ids(category_id: str) -> list[str]:
    """Retrieves a list of product IDs for a given Salesforce Commerce category ID.

    :param category_id: Salesforce Category Record ID (e.g., '0ZG5i0000008sUiGAI')
    :return: List of product ID strings
    """
    url = "https://www.applied-motion.com/s/sfsites/aura?r=31&aura.ApexAction.execute=1"

    # Construct the Apex Action message
    message_payload = {
        "actions": [
            {
                "id": "425;a",
                "descriptor": "aura://ApexActionController/ACTION$execute",
                "callingDescriptor": "UNKNOWN",
                "params": {
                    "namespace": "",
                    "classname": "B2BProductListPageController",
                    "method": "getData",
                    "params": {
                        "recordId": category_id,
                        "searchTerm": "",
                        "effectiveAccountId": "000000000000000",
                        "sortParam": "featured",
                        "filtersJson": None,
                        "measurementSystem": "Imperial",
                        "specName": None,
                        "loadSpecColumns": True,
                        "inStock": False,
                        "rfqOnly": False,
                        "preselectFilters": False,
                    },
                    "cacheable": False,
                    "isContinuation": False,
                },
            }
        ]
    }

    # Construct the mandatory Aura framework context
    aura_context = {
        "mode": "PROD",
        "fwuid": "WUdfaXlIZDNDQ0lZLWNFZDMtVGZ3d2tVMjdnTGFERUU2S3FfSVdrcU92bkExNC4xOTIuODM4ODYwOA",
        "app": "siteforce:communityApp",
        "loaded": {
            "APPLICATION@markup://siteforce:communityApp": "1712_xZHiuQoc1HHcvGz4vs6mGA"
        },
        "dn": [],
        "globals": {},
        "uad": True,
    }

    # Encode POST payload parameters
    form_data = urllib.parse.urlencode(
        {
            "message": json.dumps(message_payload),
            "aura.context": json.dumps(aura_context),
            "aura.pageURI": f"/s/category/products/{category_id}",
            "aura.token": "null",
        }
    ).encode("utf-8")

    # Set mandatory headers required by Salesforce Lightning / Aura framework
    headers = {
        "Accept": "*/*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://www.applied-motion.com",
        "Referer": f"https://www.applied-motion.com/s/category/products/{category_id}",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "x-sfdc-lds-endpoints": "ApexActionController.execute:B2BProductListPageController.getData",
    }

    # Dispatch HTTP POST Request
    req = urllib.request.Request(url, data=form_data, headers=headers)

    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            data = json.loads(res_body)

            # Safely navigate the nested JSON structure
            actions = data.get("actions", [])
            if not actions:
                return []

            action_result = actions[0]
            if action_result.get("state") != "SUCCESS":
                raise ValueError(
                    f"Aura action failed: {action_result.get('error')}"
                )

            # Navigate: returnValue -> returnValue -> responseData -> productIds
            return (
                action_result.get("returnValue", {})
                .get("returnValue", {})
                .get("responseData", {})
                .get("productIds", [])
            )

    except Exception as e:
        print(f"Error fetching product IDs: {e}")
        return []


