import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as ffi from "ffi-napi";
import * as ref from "ref-napi";
import * as Struct from "ref-struct-napi";

// Define Windows data types using ref-napi
const ULONG = ref.types.ulong;
const DWORD = ref.types.ulong;
const ULONGLONG = ref.types.ulonglong;
const BOOL = ref.types.bool;
const VOID = ref.types.void;

// Define MEMORYSTATUSEX structure
const MEMORYSTATUSEX = Struct.default({
  dwLength: DWORD,
  dwMemoryLoad: DWORD,
  ullTotalPhys: ULONGLONG,
  ullAvailPhys: ULONGLONG,
  ullTotalPageFile: ULONGLONG,
  ullAvailPageFile: ULONGLONG,
  ullTotalVirtual: ULONGLONG,
  ullAvailVirtual: ULONGLONG,
  ullAvailExtendedVirtual: ULONGLONG,
});
const LPMEMORYSTATUSEX = ref.refType(MEMORYSTATUSEX);

// Define Windows API functions
const kernel32 = ffi.Library("kernel32.dll", {
  GlobalMemoryStatusEx: [BOOL, [LPMEMORYSTATUSEX]],
});

export function mcpFreeMemoryTool(server: McpServer) {
  server.tool(
    "mcpFreeMemory",
    "Checks the available physical and virtual memory on the Windows system",
    {},
    async () => {
      // Allocate a Buffer for the MEMORYSTATUSEX structure
      const memoryStatusBuffer = ref.alloc(MEMORYSTATUSEX);
      // Get a JavaScript object representation of the struct from the buffer
      const memoryStatus = memoryStatusBuffer.deref();
      memoryStatus.dwLength = MEMORYSTATUSEX.size;

      if (kernel32.GlobalMemoryStatusEx(memoryStatusBuffer)) {
        const totalPhysicalMB = Number(memoryStatus.ullTotalPhys) / (1024 * 1024);
        const availPhysicalMB = Number(memoryStatus.ullAvailPhys) / (1024 * 1024);
        const totalVirtualMB = Number(memoryStatus.ullTotalVirtual) / (1024 * 1024);
        const availVirtualMB = Number(memoryStatus.ullAvailVirtual) / (1024 * 1024);

        const output = `
          Memory Information:
          Total Physical Memory: ${totalPhysicalMB.toFixed(2)} MB
          Available Physical Memory: ${availPhysicalMB.toFixed(2)} MB
          Total Virtual Memory: ${totalVirtualMB.toFixed(2)} MB
          Available Virtual Memory: ${availVirtualMB.toFixed(2)} MB
        `;

        return {
          content: [
            {
              type: "text",
              text: output,
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: "Error: Could not retrieve memory status.",
            },
          ],
        };
      }
    }
  );
} 