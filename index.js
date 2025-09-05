import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { ElicitationHelper } from './elicitation.js';
import { createUserTool, listUsersTool, searchUsersTool } from './tools/userTools.js';
import { createJobTool, listJobsTool } from './tools/jobTools.js';

const server = new McpServer({
  name: "elicitation-demo-server",
  version: "1.0.0",
  description: "A simple MCP server for user profile elicitation"
});

const elicitationHelper = new ElicitationHelper(server);

createUserTool(server, elicitationHelper);
listUsersTool(server);
searchUsersTool(server, elicitationHelper);

createJobTool(server, elicitationHelper);
listJobsTool(server);

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("MCP Elicitation Server running on stdio 2");
  } catch (error) {
    console.error("Fatal error running server:", error);
    process.exit(1);
  }
}

main();
