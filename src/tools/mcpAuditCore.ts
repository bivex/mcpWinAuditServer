import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function mcpAuditCoreTool(server: McpServer) {
  server.tool(
    "mcpAuditCore",
    "Central audit engine for Windows systems",
    {
      auditScope: z.string().optional().describe("Optional scope of the audit (e.g., full_system, network_connections, user_activity)"),
      reportFormat: z.enum(["json", "csv", "text"]).optional().describe("Optional format for the audit report"),
    },
    async ({ auditScope, reportFormat }) => {
      let output = "Running central audit engine";
      if (auditScope) {
        output += ` for scope: ${auditScope}`;
      }
      if (reportFormat) {
        output += ` with report format: ${reportFormat}`;
      }
      if (!auditScope && !reportFormat) {
        output += ". Default scope and format.";
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