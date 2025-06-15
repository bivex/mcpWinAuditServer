import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function mcpProcRegWatchTool(server: McpServer) {
  server.tool(
    "mcpProcRegWatch",
    "Monitors Windows processes and registry changes",
    {
      processName: z.string().optional().describe("Optional process name to watch"),
      registryPath: z.string().optional().describe("Optional registry path to monitor"),
    },
    async ({ processName, registryPath }) => {
      let output = "Monitoring";
      if (processName) {
        output += ` process: ${processName}`;
      }
      if (registryPath) {
        output += ` registry path: ${registryPath}`;
      }
      if (!processName && !registryPath) {
        output += " Windows processes and registry.";
      }
      
      return {
        content: [
          {
            type: "text",
            text: output,
          },
        ],
      };
    }
  );
} 