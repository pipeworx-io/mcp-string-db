# mcp-string-db

STRING-DB MCP — protein-protein interaction networks.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `resolve` | Map free-text identifiers (gene symbols, accessions) → STRING identifiers. |
| `interactions` | Interaction partners for a set of proteins. |
| `network` | Network image url + tabular interaction data. |
| `enrichment` | Functional enrichment (GO, KEGG, Pfam, Reactome, …) for a gene set. |
| `homology` | Homology mappings. |

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

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
