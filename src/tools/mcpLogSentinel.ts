import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function mcpLogSentinelTool(server: McpServer) {
  server.tool(
    "mcpLogSentinel",
    "Strong branding, audit sentry",
    {
      logSource: z.string().optional().describe("Optional log source to monitor (e.g., Security, System, Application)"),
      alertThreshold: z.number().optional().describe("Optional threshold for alerts (e.g., number of errors per minute)"),
    },
    async ({ logSource, alertThreshold }) => {
      let output = "Monitoring logs as a sentinel";
      if (logSource) {
        output += ` from source: ${logSource}`;
      }
      if (alertThreshold) {
        output += ` with an alert threshold of ${alertThreshold}`;
      }
      if (!logSource && !alertThreshold) {
        output += ". No specific log source or alert threshold set.";
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