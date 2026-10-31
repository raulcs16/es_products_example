import json
import requests


def fetch_product_specifications(
    product_id="01tfu000002SD67AAG",
    tab_name="Specifications",
    measurement="Imperial System",
):
    """Executes the Salesforce Aura ApexAction to fetch product tab details."""
    url = "https://www.applied-motion.com/s/sfsites/aura?r=18&aura.ApexAction.execute=1"

    headers = {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "origin": "https://www.applied-motion.com",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "sec-ch-ua": '"Chromium";v="154", "Google Chrome";v="154", "Not A(Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36",
        "x-b3-sampled": "1",
        "x-b3-spanid": "fe009e5f3d0aa464",
        "x-b3-traceid": "5ca871ecf0654d0a",
        "x-sfdc-lds-endpoints": "ApexActionController.execute:B2BProductDetailController.getProductTabDetailsByStoreConfig",
        "x-sfdc-page-scope-id": "7ddffb2e-de95-454b-b847-1ee88f94f246",
        "x-sfdc-request-id": "12979000000f520c1d",
    }

    cookies = {
        "renderCtx": '{"pageId":"5097848e-f1f4-42cc-94af-e8eda6b0348d","schema":"Published","viewType":"Published","brandingSetId":"80aa1169-4afa-4894-873d-08ea8f43e9ae","audienceIds":"6Aufu0000003Dn7,6Au5i000000sfZN"}',
        "_ga": "GA1.1.1157393824.1734651269",
        "vv_visitor_id": "zBvXEC25l2MY6RolWNUHnYvRzYKMmEt",
        "_zitok": "24b4a19c38589e5d90ce1734651270",
        "CookieConsentPolicy": "1:1",
        "LSKey-c$CookieConsentPolicy": "1:1",
        "pctrk": "0171c19e-a713-4d0a-bbef-beba8c88b185",
        "LSKey-c$sfUserSessionId": "1790809851627_k6see9k0s",
        "_gcl_gs": "2.1.k1$i1790809850$u266318687",
        "_gcl_au": "1.1.587519402.1790809852",
        "LSKey-c$cookiesRejected": "true",
        "CookieConsent": "232.1|230.1.0|2026-09-30T23:10:53.319Z|1000|false",
        "_gcl_aw": "GCL.1790810084.Cj0KCQjw5vLVBhCiARIsAD56SFLfezQtVtb7rkIclqFnfij2nuGejOCf-fEByxYZTFOX_LyZkGMGc2saAvn2EALw_wcB",
        "_clck": "hgccm7^2^g9x^0^2464",
        "_clsk": "h4z46s^1790814184916^19^1^l.clarity.ms/collect",
        "_ga_FLHYD7Q28L": "GS2.1.s1790809851$o16$g1$t1790814186$j34$l0$h0",
    }

    message_payload = {
        "actions": [
            {
                "id": "180;a",
                "descriptor": "aura://ApexActionController/ACTION$execute",
                "callingDescriptor": "UNKNOWN",
                "params": {
                    "namespace": "",
                    "classname": "B2BProductDetailController",
                    "method": "getProductTabDetailsByStoreConfig",
                    "params": {
                        "productId": product_id,
                        "tabName": tab_name,
                        "effectiveAccountId": "000000000000000",
                        "measurement": measurement,
                    },
                    "cacheable": False,
                    "isContinuation": False,
                },
            }
        ]
    }

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

    data = {
        "message": json.dumps(message_payload),
        "aura.context": json.dumps(aura_context),
        "aura.token": "null",
    }

    response = requests.post(url, headers=headers, cookies=cookies, data=data)
    response.raise_for_status()
    return response.json()

