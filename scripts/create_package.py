#!/usr/bin/env python3
import json
import sys
import shutil
from pathlib import Path

def create_package(package_name):
    # Resolve project root assuming script is in root/ or root/scripts/
    script_dir = Path(__file__).resolve().parent
    root_dir = script_dir.parent if script_dir.name == "scripts" else script_dir

    templates_dir = root_dir / "templates" / "package"
    target_package_dir = root_dir / "packages" / package_name

    if not templates_dir.exists():
        print(f"Error: Template directory '{templates_dir}' does not exist.")
        sys.exit(1)

    if target_package_dir.exists():
        print(f"Error: Target package '{target_package_dir}' already exists.")
        sys.exit(1)

    # Exclude the component template folder when copying the base package template
    def ignore_patterns(path, names):
        if Path(path) == templates_dir and "component" in names:
            return ["component"]
        return []

    print(f"Creating package: {target_package_dir}")
    shutil.copytree(templates_dir, target_package_dir, ignore=ignore_patterns)

    # Update package.json name field
    pkg_json_path = target_package_dir / "package.json"
    if pkg_json_path.exists():
        try:
            with open(pkg_json_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            data["name"] = f"@repo/{package_name}"

            with open(pkg_json_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
                f.write("\n")  # Keep trailing newline

            print(f"Updated package.json name to '@repo/{package_name}'")
        except Exception as e:
            print(f"Warning: Failed to update package.json: {e}")
    else:
        print("Warning: package.json not found in template.")


    print(f"Successfully created package '{package_name}'.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python make_package.py <package_name>")
        sys.exit(1)

    create_package(sys.argv[1])