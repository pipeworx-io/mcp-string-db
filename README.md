# @pipeworx/string-db

[STRING](https://string-db.org) MCP — protein-protein interaction networks across ~12 000 organisms. Keyless REST.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `resolve(identifiers, species?, limit?)` — map free-text gene names → STRING identifiers
- `interactions(identifiers, species?, required_score?, limit?, network_type?)` — interaction partners
- `network(identifiers, species?, required_score?, network_type?)` — network image url + tabular data
- `enrichment(identifiers, species?)` — functional enrichment for a gene set
- `homology(identifiers, species?)` — homology mappings to other organisms

`species` is NCBI taxonomy id (default `9606` human).

## Data source

`https://string-db.org/api/json/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "string-db": {
      "url": "https://gateway.pipeworx.io/string-db/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about String Db data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
