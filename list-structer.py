import os

def print_structure(startpath, indent=""):
    """Recursively prints the folder structure."""
    items = sorted(os.listdir(startpath))
    for idx, item in enumerate(items):
        path = os.path.join(startpath, item)
        is_last = idx == len(items) - 1
        branch = "└── " if is_last else "├── "
        print(indent + branch + item)

        if os.path.isdir(path):
            extension = "    " if is_last else "│   "
            print_structure(path, indent + extension)


if __name__ == "__main__":
    # Change this path to your React components folder
    folder_to_scan = "./ringo-frontend/src/components/sidebar"

    if os.path.exists(folder_to_scan):
        print(f"Folder structure of: {folder_to_scan}\n")
        print_structure(folder_to_scan)
    else:
        print(f"Path does not exist: {folder_to_scan}")
