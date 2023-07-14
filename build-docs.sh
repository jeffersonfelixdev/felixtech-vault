#!/bin/bash
npm i -g @redocly/cli
redocly build-docs -o public/api-docs/index.html --config redocly.yaml ./docs/swagger.yaml
