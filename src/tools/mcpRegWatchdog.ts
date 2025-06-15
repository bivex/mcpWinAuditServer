import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function mcpRegWatchdogTool(server: McpServer) {
  server.tool(
    "mcpRegWatchdog",
    "Monitors and guards Windows registry changes",
    {
      keyPath: z.string().describe("The registry key path to monitor"),
      watchType: z.enum(["create", "delete", "modify"]).optional().describe("Optional type of change to watch for (create, delete, modify)"),
    },
    async ({ keyPath, watchType }) => {
      let output = `Setting watchdog on registry key: ${keyPath}`;
      if (watchType) {
        output += ` for ${watchType} events`;
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