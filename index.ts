import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { mcpWinAuditServerTool } from "./src/tools/mcpWinAuditServer.js";
import { mcpProcRegWatchTool } from "./src/tools/mcpProcRegWatch.js";
import { mcpSecAuditTool } from "./src/tools/mcpSecAudit.js";
import { mcpEventInspectorTool } from "./src/tools/mcpEventInspector.js";
import { mcpWinTraceTool } from "./src/tools/mcpWinTrace.js";
import { mcpRegWatchdogTool } from "./src/tools/mcpRegWatchdog.js";
import { mcpIntegrityWatcherTool } from "./src/tools/mcpIntegrityWatcher.js";
import { mcpWinWatchTool } from "./src/tools/mcpWinWatch.js";
import { mcpAuditCoreTool } from "./src/tools/mcpAuditCore.js";
import { mcpSysTrackerTool } from "./src/tools/mcpSysTracker.js";
import { mcpForensicAgentTool } from "./src/tools/mcpForensicAgent.js";
import { mcpLogSentinelTool } from "./src/tools/mcpLogSentinel.js";
import { mcpListProcessesTool } from "./src/tools/mcpListProcesses.js";

// Create server instance
const server = new McpServer({
  name: "mcp-server-template",
  version: "0.0.1",
});

mcpWinAuditServerTool(server);
mcpProcRegWatchTool(server);
mcpSecAuditTool(server);
mcpEventInspectorTool(server);
mcpWinTraceTool(server);
mcpRegWatchdogTool(server);
mcpIntegrityWatcherTool(server);
mcpWinWatchTool(server);
mcpAuditCoreTool(server);
mcpSysTrackerTool(server);
mcpForensicAgentTool(server);
mcpLogSentinelTool(server);
mcpListProcessesTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
