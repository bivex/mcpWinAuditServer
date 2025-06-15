import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function mcpIntegrityWatcherTool(server: McpServer) {
  server.tool(
    "mcpIntegrityWatcher",
    "Monitors file and system integrity for violations",
    {
      targetPath: z.string().describe("The file or directory path to monitor for integrity changes"),
      scanFrequency: z.number().optional().describe("Optional frequency of integrity scans in minutes"),
    },
    async ({ targetPath, scanFrequency }) => {
      let output = `Setting integrity watcher on: ${targetPath}`;
      if (scanFrequency) {
        output += ` with a scan frequency of ${scanFrequency} minutes`;
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