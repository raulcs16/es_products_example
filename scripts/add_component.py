#!/usr/bin/env python3
import sys
import shutil
from pathlib import Path

def add_component(package_name, component_name):
    # Resolve project root assuming script is in root/ or root/scripts/
    script_dir = Path(__file__).resolve().parent
    root_dir = script_dir.parent if script_dir.name == "scripts" else script_dir

    template_comp_dir = root_dir / "templates" / "component"
    package_dir = root_dir / "packages" / package_name / "src"
    target_comp_dir = package_dir / component_name

    if not template_comp_dir.exists():
        print(f"Error: Component template directory '{template_comp_dir}' does not exist.")
        sys.exit(1)

    if not package_dir.exists():
        print(f"Error: Target package '{package_dir}' does not exist.")
        sys.exit(1)

    if target_comp_dir.exists():
        print(f"Error: Component '{target_comp_dir}' already exists in package '{package_name}'.")
        sys.exit(1)

    print(f"Adding component '{component_name}' to package '{package_name}'...")
    shutil.copytree(template_comp_dir, target_comp_dir)
    print(f"Successfully added component '{component_name}'.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python add_component.py <existing_package> <new_component>")
        sys.exit(1)

    add_component(sys.argv[1], sys.argv[2])