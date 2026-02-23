import os
import re
import shutil
from datetime import datetime


PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
PUBLISH_DIR = os.path.join(PROJECT_ROOT, "publish")


def reset_publish_dir() -> None:
    """Ensure publish directory exists and is empty."""
    if os.path.isdir(PUBLISH_DIR):
        shutil.rmtree(PUBLISH_DIR)
    os.makedirs(PUBLISH_DIR, exist_ok=True)


def minify_html(content: str) -> str:
    """
    Light HTML minification:
    - remove non-conditional comments
    - trim whitespace
    - collapse multiple spaces/newlines.
    """
    # Remove HTML comments except conditional comments (e.g. <!--[if ...]>)
    content = re.sub(r"<!--(?!\[if).*?-->", "", content, flags=re.DOTALL)
    lines = [line.strip() for line in content.splitlines()]
    # Drop completely empty lines
    lines = [line for line in lines if line]
    # Join with a single space to keep structure reasonably intact
    return " ".join(lines)


def minify_css(content: str) -> str:
    """
    Basic CSS minification:
    - remove comments
    - collapse whitespace
    - remove redundant spaces around common symbols.
    """
    # Remove /* ... */ comments
    content = re.sub(r"/\*.*?\*/", "", content, flags=re.DOTALL)
    # Collapse all whitespace to single spaces
    content = re.sub(r"\s+", " ", content)
    # Remove spaces around common punctuation
    for ch in ["{", "}", ":", ";", ",", ">", "+", "~", "=", "(", ")"]:
        content = re.sub(r"\s*{}\s*".format(re.escape(ch)), ch, content)
    return content.strip()


def minify_js(content: str) -> str:
    """
    Very conservative JS "minification":
    - trim each line
    - remove fully empty lines
    - rejoin using newlines to preserve statement boundaries.

    Note: Joining JavaScript statements onto a single line can change
    semantics when code relies on automatic semicolon insertion. By
    preserving newlines we still cut most indentation/spacing without
    risking subtle breakage.
    """
    lines = [line.strip() for line in content.splitlines()]
    lines = [line for line in lines if line]
    return "\n".join(lines)


def generate_version_stamp() -> str:
    """Return a cache-busting version string based on the current UTC timestamp."""
    return datetime.utcnow().strftime("%Y%m%d%H%M%S")


def apply_version_stamp_to_assets(content: str, version: str) -> str:
    """
    Update stylesheet and script query params to include the provided version.

    This currently targets the main site assets (styles.css and script.js),
    preserving any other attributes or paths.
    """

    # Update <link ... href="styles.css?v=...">
    content = re.sub(
        r'(href="styles\.css)(\?v=[^"]*)?(")',
        rf'\1?v={version}\3',
        content,
    )

    # Update <script ... src="script.js?v=...">
    content = re.sub(
        r'(src="script\.js)(\?v=[^"]*)?(")',
        rf'\1?v={version}\3',
        content,
    )

    return content


def should_skip_dir(dirname: str) -> bool:
    return dirname in {".git", ".cursor", "__pycache__", "node_modules", "publish"}


def publish() -> None:
    reset_publish_dir()

    # Single version stamp for this build, applied to HTML asset links.
    version = generate_version_stamp()

    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Skip unwanted directories
        dirs[:] = [d for d in dirs if not should_skip_dir(d)]

        rel_root = os.path.relpath(root, PROJECT_ROOT)
        if rel_root == ".":
            rel_root = ""

        for filename in files:
            # Skip hidden files except .htaccess (if present)
            if filename.startswith(".") and filename != ".htaccess":
                continue

            src_path = os.path.join(root, filename)

            # Skip this build script itself
            if os.path.abspath(src_path) == os.path.abspath(__file__):
                continue

            rel_path = os.path.join(rel_root, filename) if rel_root else filename
            dest_path = os.path.join(PUBLISH_DIR, rel_path)

            os.makedirs(os.path.dirname(dest_path), exist_ok=True)

            ext = os.path.splitext(filename)[1].lower()
            if ext in {".html", ".htm"}:
                with open(src_path, "r", encoding="utf-8") as f:
                    content = f.read()
                # Apply version stamp to key assets before minifying.
                content = apply_version_stamp_to_assets(content, version)
                minified = minify_html(content)
                with open(dest_path, "w", encoding="utf-8") as f:
                    f.write(minified)
            elif ext == ".css":
                with open(src_path, "r", encoding="utf-8") as f:
                    content = f.read()
                minified = minify_css(content)
                with open(dest_path, "w", encoding="utf-8") as f:
                    f.write(minified)
            elif ext == ".js":
                with open(src_path, "r", encoding="utf-8") as f:
                    content = f.read()
                minified = minify_js(content)
                with open(dest_path, "w", encoding="utf-8") as f:
                    f.write(minified)
            else:
                # Copy other assets (images, etc.) as-is
                shutil.copy2(src_path, dest_path)


if __name__ == "__main__":
    publish()

