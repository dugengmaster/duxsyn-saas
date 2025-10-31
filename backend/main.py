# duxsyn/backend/main.py
from pathlib import Path
import argparse

IGNORE_PATTERNS = {
    "node_modules", "dist", "coverage", ".nx", ".angular",
    ".git", ".idea", ".vscode", "__pycache__", "venv"
}

def print_tree(path: Path, prefix: str = "", depth: int = 5):
    if depth < 0 or not path.is_dir():
        return
    entries = sorted(p for p in path.iterdir() if p.name not in IGNORE_PATTERNS)
    for i, entry in enumerate(entries):
        connector = "└── " if i == len(entries) - 1 else "├── "
        print(prefix + connector + entry.name)
        if entry.is_dir():
            print_tree(entry, prefix + ("    " if i == len(entries) - 1 else "│   "), depth - 1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate clean folder structure tree.")
    parser.add_argument("--path", type=str, default=".", help="Target directory path.")
    parser.add_argument("--output", type=str, default=None, help="Output file path (optional).")
    parser.add_argument("--depth", type=int, default=5, help="Depth limit for recursion.")
    args = parser.parse_args()

    target = Path(args.path).resolve()
    output = Path(args.output).resolve() if args.output else None

    # Capture print output if writing to file
    from io import StringIO
    import sys
    buffer = StringIO()
    sys.stdout = buffer
    print(f"# Folder structure for {target}\n")
    print_tree(target, depth=args.depth)
    sys.stdout = sys.__stdout__

    result = buffer.getvalue()
    if output:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(result, encoding="utf-8")
        print(f"✅ Folder structure written to {output}")
    else:
        print(result)
