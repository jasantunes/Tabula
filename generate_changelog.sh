#!/bin/bash
set -e

VERSION=$1

git tag --force $VERSION
github_changelog_generator -u jasantunes -p tabula
git add CHANGELOG.md
git commit -m "Update CHANGELOG.md"
HEAD=`git rev-parse HEAD`
git tag --force $VERSION $HEAD
