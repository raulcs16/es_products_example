from collections import defaultdict
import json
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

from fetch_product import fetch_product
from fetch_product_ids import fetch_product_ids
from fetch_spec import fetch_product_specifications
from fetch_breadcrumbs import fetch_breadcrumbs

OUTPUT_DIR = "output"
DATA_DIR = "data"

MAX_CATEGORY_WORKERS = 4
parent_categories = [
    {
        "id": "0ZG5i0000008sLzGAI",
        "name": "Accessories",
        "parent_category_id": "",
        "parent_category_name": "",
    },
    {
        "id": "0ZG5i0000008sUZGAY",
        "name": "StepSERVO Products",
        "parent_category_id": "",
        "parent_category_name": "",
    },
    {
        "id": "0ZG5i0000008sUaGAI",
        "name": "Stepper Products",
        "parent_category_id": "",
        "parent_category_name": "",
    },
    {
        "id": "0ZG5i0000008sUbGAI",
        "name": "Servo Products",
        "parent_category_id": "",
        "parent_category_name": "",
    },
    {
        "id": "0ZG5i0000008sUcGAI",
        "name": "Gearheads",
        "parent_category_id": "",
        "parent_category_name": "",
    },
    {
        "id": "0ZG5i0000008sUdGAI",
        "name": "Power Supplies",
        "parent_category_id": "",
        "parent_category_name": "",
    },
    {
        "id": "0ZG5i00000094ifGAA",
        "name": "Gearmotors",
        "parent_category_id": "",
        "parent_category_name": "",
    },
]  


def sanitize_filename(name: str) -> str:
    """Removes invalid characters for safe file paths."""
    return re.sub(r"[^\w\-]", "_", name)


def process_category(
    cat: dict, position: int, overwrite: bool = True
) -> tuple[str, int, str]:
    """Processes a single category synchronously (one product at a time)
    and saves results to its own JSON file. Skips if file exists and overwrite=False.
    """
    category_id = cat["id"]
    category_name = cat["name"]

    safe_name = sanitize_filename(f"{category_name}_{category_id}")
    filename = os.path.join(OUTPUT_DIR, f"{safe_name}.json")

    # Skip if file already exists and overwrite is disabled
    if not overwrite and os.path.exists(filename):
        return category_name, 0, filename

    # 1. Fetch Product IDs for this category
    product_ids = fetch_product_ids(category_id)
    active_product_ids =  product_ids

    products_dict = {}

    # 2. Fetch product details synchronously (1 at a time) with per-category progress bar
    pbar_label = f"[{category_name[:18]:<18}]"
    with tqdm(
        total=len(active_product_ids),
        desc=pbar_label,
        position=position,
        leave=False,
    ) as pbar:
        for pid in active_product_ids:
            # Synchronous fetch
            product_data = fetch_product(pid)
            spec_data = fetch_product_specifications(pid)
            breadcrumbs = fetch_breadcrumbs(pid)

            # Nest specs inside product object
            if isinstance(product_data, dict):
                product_data["specifications"] = spec_data
                product_data["breadcrumbs"] = breadcrumbs

            products_dict[pid] = product_data

            time.sleep(0.1)  # Mild rate-limiting pause
            pbar.update(1)


    with open(filename, "w", encoding="utf-8") as f:
        json.dump(products_dict, f, indent=2)

    return category_name, len(products_dict), filename


def main(overwrite: bool = True,test_mode:bool=False):
    """Pipeline runner: Multithreads categories while processing products sequentially within each thread."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("Fetching category hierarchy...")
    categories = parent_categories[:1] if  test_mode else parent_categories
    print(f"Found {len(categories)} categories. Starting extraction...\n")

    # Main category progress bar at position 0
    with tqdm(
        total=len(categories), desc="Overall Categories", position=0
    ) as main_pbar:
        with ThreadPoolExecutor(
            max_workers=MAX_CATEGORY_WORKERS
        ) as category_executor:
            # Map futures to track category execution
            futures = {
                category_executor.submit(
                    process_category, cat, idx + 1, overwrite
                ): cat
                for idx, cat in enumerate(categories)
            }

            for future in as_completed(futures):
                try:
                    cat_name, count, file_path = future.result()
                    if count == 0:
                        tqdm.write(f"⊙ Skipped (already exists): '{cat_name}' -> {file_path}")
                    else:
                        tqdm.write(
                            f"✓ Saved {count} products for '{cat_name}' -> {file_path}"
                        )
                except Exception as e:
                    tqdm.write(f"✗ Category processing failed: {e}")
                finally:
                    main_pbar.update(1)

    print("\nExtraction complete! All files saved in './output/'")


def parse_category(data: dict) -> dict:
    return {
        'category.id': data.get('id'),
        'category.name': data.get('name'),
        'category.parent_name': data.get('parent_category_name')
    }


def parse_specs(data: dict):
     spec_categories = set()
     spec_names = set()
     specs_map = defaultdict(list)

     specs = []
     actions = data.get('actions', [])
     for action in actions:
        id = action.get('id')
        state = action.get('state')
        if state != 'SUCCESS':
            continue
        top_value = action.get('returnValue')
        inner_value = top_value.get('returnValue')
        response = inner_value.get('responseData')
        if id == '180;a':
           spec_groups = response.get('specCategoryGroups', []) 
           for group in spec_groups:
                category_name = group.get("category")
                if not category_name: continue
                spec_categories.add(category_name)

                category = {
                    "category": category_name,
                    "sequence": group.get("sequence")
                }

                fields = group.get("specFields", [])
                for field in fields:
                    field_name = field.get("name")
                    if not field_name:
                        continue
                    spec_names.add(field_name)
                    raw_val = str(field.get("value", "")).strip()
                    suffix = field.get("suffix")
                    formatted_val = f"{raw_val} {suffix}".strip() if suffix else raw_val

                    if formatted_val and formatted_val not in specs_map[field_name]:
                        specs_map[field_name].append(formatted_val)

                    spec = {
                        **category,
                        **field
                    }
                    specs.append(spec)

     return {
        "specCategories": sorted(list(spec_categories)),
        "specNames": sorted(list(spec_names)),
        "specsMap": dict(specs_map), 
        "specs": specs
    }
            
def parse_breadcrumbs(breadcrumbs: list) -> dict:
    """Parses breadcrumbs into ordered category objects with correct parent IDs 
    and flat names for filtering.
    """
    categories = []
    category_names = []
    breads=[]
    previous_id = "NULL"
    for bc in breadcrumbs:
        if bc.get("type") == "Category" and bc.get("id") != "Home":
            cat_id = bc.get("id")
            cat_name = bc.get("label")
            if cat_name == "Products":
                continue
            categories.append({
                "id": cat_id,
                "name": cat_name,
                "parentId": previous_id  # Store the actual parent's ID
            })
            category_names.append(cat_name)
            breads.append(cat_id+"."+cat_name+"."+previous_id)
            previous_id = cat_id

    return {
        "categories": categories,          # Ordered list with proper ID tracking
        "categoryNames": category_names,    # Flat array for Elasticsearch keyword queries
        "breadcrumbs":breads,
    }
def parse_attributes(product_attributes: list) -> dict: 
    attribute_names = []
    attribute_options_map = {}
    attributes = []

    for item in product_attributes:
        label = item.get("label")
        if not label:
            continue

        attribute_names.append(label)

        raw_options = item.get("options", [])
        values = list(dict.fromkeys(
            opt.get("value") for opt in raw_options if opt.get("value")
        ))

        attribute_options_map[label] = values

        attributes.append({
            "apiName": item.get("apiName"),
            "label": label,
            "sequence": item.get("sequence") or item.get("suquence"),  
            "options": values
        })

    return {
        "attributeNames": attribute_names,         
        "attributeOptionsMap": attribute_options_map, 
        "attributes": attributes                   
    }


def parse_product(data: dict):
    actions = data.get('actions', [])
    product_info = {}
    product_img = {}
    attr_data = {}
    canonical_list = []
    recommended_products = []
    recommended_accessories = []
    links =[]
    flags = []
    for action in actions:
        id = action.get('id')
        state = action.get('state')
        if state != 'SUCCESS':
            continue
        
        top_value = action.get('returnValue') or {}
        if top_value == {}: 
            continue
        inner_value = top_value.get('returnValue') or {}
        response = inner_value.get('responseData') or {}
        if id == '154;a' and len(response.keys())>0:
            link_obj = response.pop('additionalInfoLinks', None)
            for key in link_obj.keys():
                arr = link_obj.get(key, [])
                for obj in arr:
                    links.append({
                        "link.type": key,
                        **obj
                    })

            keys_to_remove = []

            for key, val in response.items():
                if key.startswith('is'):
                    if val is True:
                        flags.append(key) 
                    keys_to_remove.append(key)

            for key in keys_to_remove:
                del response[key]

            raw_attrs = response.pop('productAttributes', []) or []
            attr_data = parse_attributes(raw_attrs)

            raw_canonical_map = response.pop('attributesCanonicalKeyToProductId', {}) or {}

            canonical_list = [
                {
                    "canonicalkey": key,
                    "productId": prod_id
                }
                for key, prod_id in raw_canonical_map.items()
            ]
            raw_products_map = response.pop('recommendedProducts', {}) or {}
            recommended_products = [
                {
                    "label": key,
                    "productId": prod_id
                }
                for key, prod_id in raw_products_map.items()
            ]
            raw_access_list = response.pop('recommendedAccessories', []) or []
            for item in raw_access_list:
                recommended_accessories.append({
                    "label": item.get("sku"),
                    "productId": item.get("id")

                })
            product_info = response 
        if id == '155;a':
            product_img = response
    spec_data = parse_specs(data.get('specifications'))
    category_data = parse_breadcrumbs(data.get('breadcrumbs'))
    product = {
        **product_info,
        **category_data,
        'flags': flags,
        'links': links,
        'images': product_img,
        **spec_data, 
        **attr_data,
        "attributesCanonicalKeyToProductId": canonical_list,
        "recommendedProducts": recommended_products,
        "recommendedAccessories": recommended_accessories,
    }
    return product


def parse_raw_files():
    products = []
    for filename in os.listdir(OUTPUT_DIR):
        full_path = os.path.join(OUTPUT_DIR, filename)
        with open(full_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for prod in data.values():
                product = {
                 **parse_product(prod)
                }
                products.append(product)
    return products            


def parse_products():
    products = parse_raw_files()
    os.makedirs(DATA_DIR, exist_ok=True)
    output_filepath = os.path.join(DATA_DIR, 'products.json')
    with open(output_filepath, 'w', encoding='utf-8') as f:
        for product in products:
           f.write(json.dumps(product, ensure_ascii=False) + '\n')


def analyse_products():
    path = os.path.join(DATA_DIR, 'products.json')
    key_dic = defaultdict(set)
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            product = json.loads(line)
            for key, val in product.items():
                match val:
                    case dict() as d:
                     for k, v in d.items():
                        k_type = type(k).__name__
                        v_type = type(v).__name__
                        key_dic[key].add(f"[{k_type}, {v_type}]")
                    case list() as l:
                        if not l:
                            key_dic[key].add("empty_list")
                        else:
                            for item in l:
                                if isinstance(item, dict):
                                    key_dic[key].update(item.keys())
                                else:
                                    key_dic[key].add(type(item).__name__)
                    case _:
                        key_dic[key].add(type(val).__name__)
            
    final_schema = {k: sorted(v) for k, v in key_dic.items()}
    print(json.dumps(final_schema, indent=4))


if __name__ == "__main__":
     #main(overwrite=False,test_mode=False)
     parse_products()
     analyse_products()