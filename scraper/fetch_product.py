import json
import requests

def fetch_product(
    product_id: str
):
    """Fetches product details, downloads, and variant mappings from Applied Motion's

    Salesforce Aura B2B Commerce backend.
    """
    url = "https://www.applied-motion.com/s/sfsites/aura?r=10&aura.ApexActionController.execute=5"

    headers = {
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://www.applied-motion.com",
        "Referer": f"https://www.applied-motion.com/s/product/p/{product_id}",
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0"
            " Safari/537.36"
        ),
    }

    # Construct the internal Aura batch action list
    message_payload = {
        "actions": [
            {
                "id": "154;a",
                "descriptor": (
                    "aura://ApexActionController/ACTION$execute"
                ),
                "callingDescriptor": "UNKNOWN",
                "params": {
                    "namespace": "",
                    "classname": "B2BProductDetailController",
                    "method": "getProductInfo",
                    "params": {
                        "productId": product_id,
                        "effectiveAccountId": "000000000000000",
                    },
                    "cacheable": False,
                    "isContinuation": False,
                },
            },
            {
                "id": "155;a",
                "descriptor": (
                    "aura://ApexActionController/ACTION$execute"
                ),
                "callingDescriptor": "UNKNOWN",
                "params": {
                    "namespace": "",
                    "classname": "B2BProductDetailController",
                    "method": "getProductImagesInfo",
                    "params": {
                        "productId": product_id,
                        "accId": "000000000000000",
                    },
                    "cacheable": False,
                    "isContinuation": False,
                },
            },
            {
                "id": "157;a",
                "descriptor": (
                    "aura://ApexActionController/ACTION$execute"
                ),
                "callingDescriptor": "UNKNOWN",
                "params": {
                    "namespace": "",
                    "classname": "B2BProductDetailController",
                    "method": "getProductTabs",
                    "params": {
                        "productId": product_id,
                        "effectiveAccountId": "000000000000000",
                    },
                    "cacheable": False,
                    "isContinuation": False,
                },
            },
        ]
    }

    # Aura metadata parameters
    aura_context = {
        "mode": "PROD",
        "fwuid": (
            "WUdfaXlIZDNDQ0lZLWNFZDMtVGZ3d2tVMjdnTGFERUU2S3FfSVdrcU92bkExNC4xOTIuODM4ODYwOA"
        ),
        "app": "siteforce:communityApp",
        "loaded": {
            "APPLICATION@markup://siteforce:communityApp": "1712_xZHiuQoc1HHcvGz4vs6mGA"
        },
        "dn": [],
        "globals": {},
        "uad": True,
    }

    # Format data as application/x-www-form-urlencoded
    data = {
        "message": json.dumps(message_payload),
        "aura.context": json.dumps(aura_context),
        "aura.pageURI": f"/s/product/p/{product_id}",
        "aura.token": "null",
    }

    try:
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()

        # Parse JSON response
        response_json = response.json()
    
        return response_json

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None