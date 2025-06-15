import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function mcpForensicAgentTool(server: McpServer) {
  server.tool(
    "mcpForensicAgent",
    "Performs deeper forensic-level logging and analysis",
    {
      collectionTarget: z.string().describe("The target for forensic data collection (e.g., memory, disk, network_traffic)"),
      depth: z.enum(["shallow", "deep"]).optional().describe("Optional depth of the forensic collection (shallow or deep)"),
    },
    async ({ collectionTarget, depth }) => {
      let output = `Initiating forensic data collection on: ${collectionTarget}`;
      if (depth) {
        output += ` with ${depth} analysis`;
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