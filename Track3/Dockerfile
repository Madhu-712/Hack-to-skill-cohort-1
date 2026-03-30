FROM debian:bookworm-slim

WORKDIR /app

COPY mcp-toolbox/toolbox ./toolbox
COPY mcp-toolbox/tools.yaml ./tools.yaml

RUN chmod +x ./toolbox

EXPOSE 7000

ENTRYPOINT ["./toolbox", "--tools-file", "/app/tools.yaml", "--port", "7000"]
