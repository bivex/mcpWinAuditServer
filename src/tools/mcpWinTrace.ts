import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function mcpWinTraceTool(server: McpServer) {
  server.tool(
    "mcpWinTrace",
    "Lightweight tool for tracing Windows events and activity",
    {
      traceTarget: z.string().optional().describe("Optional target for tracing (e.g., file, process, network)"),
      duration: z.number().optional().describe("Optional duration for tracing in seconds"),
    },
    async ({ traceTarget, duration }) => {
      let output = "Initiating Windows trace";
      if (traceTarget) {
        output += ` on target: ${traceTarget}`;
      }
      if (duration) {
        output += ` for ${duration} seconds`;
      }
      if (!traceTarget && !duration) {
        output += ". No specific target or duration set.";
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