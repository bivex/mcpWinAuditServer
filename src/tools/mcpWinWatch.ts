import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function mcpWinWatchTool(server: McpServer) {
  server.tool(
    "mcpWinWatch",
    "Broad watcher for Windows activity",
    {
      activityType: z.string().optional().describe("Optional type of activity to watch (e.g., file_access, network_connection, process_creation)"),
      keyword: z.string().optional().describe("Optional keyword to filter activity"),
    },
    async ({ activityType, keyword }) => {
      let output = "Broadly watching Windows activity";
      if (activityType) {
        output += ` for ${activityType} events`;
      }
      if (keyword) {
        output += ` with keyword: ${keyword}`;
      }
      if (!activityType && !keyword) {
        output += ". No specific filters applied.";
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