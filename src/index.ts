interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * STRING-DB MCP — protein-protein interaction networks.
 *
 * Auth: none. Docs: https://string-db.org/cgi/help?subpage=api
 */


const BASE = 'https://string-db.org/api/json';
const UA = 'pipeworx-mcp-string-db/1.0 (caller_identity=pipeworx; +https://pipeworx.io)';
const DEFAULT_SPECIES = 9606;

const tools: McpToolExport['tools'] = [
  {
    name: 'resolve',
    description: 'Map free-text identifiers (gene symbols, accessions) → STRING identifiers.',
    inputSchema: {
      type: 'object',
      properties: {
        identifiers: { type: 'array', items: { type: 'string' } },
        species: { type: 'number', description: 'NCBI taxonomy id (default 9606).' },
        limit: { type: 'number', description: 'Best-N matches per input (default 1).' },
      },
      required: ['identifiers'],
    },
  },
  {
    name: 'interactions',
    description: 'Interaction partners for a set of proteins.',
    inputSchema: {
      type: 'object',
      properties: {
        identifiers: { type: 'array', items: { type: 'string' } },
        species: { type: 'number' },
        required_score: { type: 'number', description: '0-1000 confidence score (default 400).' },
        limit: { type: 'number', description: 'Max partners per protein (default 10).' },
        network_type: { type: 'string', description: 'functional (default) | physical' },
      },
      required: ['identifiers'],
    },
  },
  {
    name: 'network',
    description: 'Network image url + tabular interaction data.',
    inputSchema: {
      type: 'object',
      properties: {
        identifiers: { type: 'array', items: { type: 'string' } },
        species: { type: 'number' },
        required_score: { type: 'number' },
        network_type: { type: 'string' },
      },
      required: ['identifiers'],
    },
  },
  {
    name: 'enrichment',
    description: 'Functional enrichment (GO, KEGG, Pfam, Reactome, …) for a gene set.',
    inputSchema: {
      type: 'object',
      properties: {
        identifiers: { type: 'array', items: { type: 'string' } },
        species: { type: 'number' },
      },
      required: ['identifiers'],
    },
  },
  {
    name: 'homology',
    description: 'Homology mappings.',
    inputSchema: {
      type: 'object',
      properties: {
        identifiers: { type: 'array', items: { type: 'string' } },
        species: { type: 'number' },
      },
      required: ['identifiers'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const species = (args.species as number) ?? DEFAULT_SPECIES;
  const ids = reqArr(args, 'identifiers', '["TP53","BRCA1"]').join('%0d');
  switch (name) {
    case 'resolve': {
      const limit = Math.max(1, (args.limit as number) ?? 1);
      return stGet(`/get_string_ids?identifiers=${ids}&species=${species}&limit=${limit}&caller_identity=pipeworx`);
    }
    case 'interactions': {
      const params = new URLSearchParams({
        identifiers: decodeURIComponent(ids),
        species: String(species),
        required_score: String((args.required_score as number) ?? 400),
        limit: String((args.limit as number) ?? 10),
        network_type: String(args.network_type ?? 'functional'),
        caller_identity: 'pipeworx',
      });
      return stGet(`/interaction_partners?${params}`);
    }
    case 'network': {
      const params = new URLSearchParams({
        identifiers: decodeURIComponent(ids),
        species: String(species),
        required_score: String((args.required_score as number) ?? 400),
        network_type: String(args.network_type ?? 'functional'),
        caller_identity: 'pipeworx',
      });
      return stGet(`/network?${params}`);
    }
    case 'enrichment': {
      const params = new URLSearchParams({
        identifiers: decodeURIComponent(ids),
        species: String(species),
        caller_identity: 'pipeworx',
      });
      return stGet(`/enrichment?${params}`);
    }
    case 'homology': {
      const params = new URLSearchParams({
        identifiers: decodeURIComponent(ids),
        species: String(species),
        caller_identity: 'pipeworx',
      });
      return stGet(`/homology?${params}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function stGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`STRING-DB: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  return res.json();
}

function reqArr(args: Record<string, unknown>, key: string, example: string): string[] {
  const v = args[key];
  if (!Array.isArray(v) || v.length === 0) {
    throw new Error(`Required argument "${key}" must be a non-empty array, e.g. ${example}.`);
  }
  return v.filter((s): s is string => typeof s === 'string');
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
