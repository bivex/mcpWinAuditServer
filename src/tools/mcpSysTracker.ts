import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function mcpSysTrackerTool(server: McpServer) {
  server.tool(
    "mcpSysTracker",
    "Generic tracker for Windows system state and changes",
    {
      trackComponent: z.string().optional().describe("Optional system component to track (e.g., services, drivers, installed_apps)"),
      reportInterval: z.number().optional().describe("Optional interval for reporting changes in minutes"),
    },
    async ({ trackComponent, reportInterval }) => {
      let output = "Tracking Windows system";
      if (trackComponent) {
        output += ` component: ${trackComponent}`;
      }
      if (reportInterval) {
        output += ` with reports every ${reportInterval} minutes`;
      }
      if (!trackComponent && !reportInterval) {
        output += ". Tracking general system state.";
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