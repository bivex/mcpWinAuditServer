import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function mcpListProcessesTool(server: McpServer) {
  server.tool(
    "mcpListProcesses",
    "Lists running processes on the Windows system",
    {
      filterByName: z.string().optional().describe("Optional filter to list processes by name (e.g., chrome.exe)"),
      filterById: z.number().optional().describe("Optional filter to list processes by ID"),
    },
    async ({ filterByName, filterById }) => {
      let output = "Listing processes";
      if (filterByName) {
        output += ` filtered by name: ${filterByName}`;
      }
      if (filterById) {
        output += ` filtered by ID: ${filterById}`;
      }
      if (!filterByName && !filterById) {
        output += ". No specific filters applied.";
      }
      
      // In a real scenario, this would execute a system command (e.g., powershell Get-Process)
      // and parse its output.

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