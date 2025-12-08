#!/bin/bash

set -e

CURRENT_DIR=$(pwd)
PARENT_DIR=$(dirname "$CURRENT_DIR")
CURRENT_FOLDER_NAME=$(basename "$CURRENT_DIR")

echo "Current folder: $CURRENT_FOLDER_NAME"
echo "Current directory: $CURRENT_DIR"
echo ""

read -p "Enter new folder/repo name: " NEW_NAME

if [ -z "$NEW_NAME" ]; then
  echo "Error: Folder/repo name cannot be empty"
  exit 1
fi

NEW_FOLDER_PATH="$PARENT_DIR/$NEW_NAME"

if [ -d "$NEW_FOLDER_PATH" ]; then
  echo "Error: Folder '$NEW_FOLDER_PATH' already exists"
  exit 1
fi

echo ""
echo "This will:"
echo "  1. Duplicate folder to: $NEW_FOLDER_PATH"
echo "  2. Remove git history"
echo "  3. Initialize fresh git repo"
echo "  4. Create GitHub repo: github.com/jajablinky/$NEW_NAME"
echo "  5. Push code to GitHub"
echo ""
read -p "Continue? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
  echo "Cancelled."
  exit 0
fi

echo ""
echo "Step 1/5: Duplicating folder..."
cp -r "$CURRENT_DIR" "$NEW_FOLDER_PATH"
echo "✓ Folder duplicated"

echo ""
echo "Step 2/5: Removing git history..."
cd "$NEW_FOLDER_PATH"
rm -rf .git
echo "✓ Git history removed"

echo ""
echo "Step 3/5: Initializing fresh git repo..."
git init
git branch -M main
echo "✓ Git initialized"

echo ""
echo "Step 4/5: Creating GitHub repository..."
gh repo create "jajablinky/$NEW_NAME" --public --source=. --remote=origin --push=false
echo "✓ GitHub repository created"

echo ""
echo "Step 5/5: Staging, committing, and pushing..."
git add .
git commit -m "Initial commit"
git push -u origin main
echo "✓ Code pushed to GitHub"

echo ""
echo "✓ Done! Repository available at: https://github.com/jajablinky/$NEW_NAME"
echo "✓ New folder location: $NEW_FOLDER_PATH"

