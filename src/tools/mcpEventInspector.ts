import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function mcpEventInspectorTool(server: McpServer) {
  server.tool(
    "mcpEventInspector",
    "Focus on system and security event logs",
    {
      logName: z.string().optional().describe("The name of the event log to inspect (e.g., System, Security, Application)"),
      eventType: z.string().optional().describe("Optional type of event to filter (e.g., Error, Warning, Information)"),
    },
    async ({ logName, eventType }) => {
      let output = "Inspecting Windows Event Logs";
      if (logName) {
        output += ` for log: ${logName}`;
      }
      if (eventType) {
        output += ` with event type: ${eventType}`;
      }
      if (!logName && !eventType) {
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