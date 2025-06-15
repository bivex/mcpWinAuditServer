import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { mcpFreeMemoryTool } from "./mcpFreeMemory.js";

export function mcpWinAuditServerTool(server: McpServer) {
  server.tool(
    "mcpWinAuditServer",
    "General Windows audit server",
    {
      input: z.string().describe("Input parameter for the Windows audit server"),
    },
    async ({ input }) => {
      // Process the input
      const output = `Audit result for: ${input}`;
      
      // Return the result
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
  mcpFreeMemoryTool(server);
} 