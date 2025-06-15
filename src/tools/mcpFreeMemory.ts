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
        // Read ULONGLONG values as BigInt for precision
        const totalPhysicalBytes = BigInt(memoryStatus.ullTotalPhys);
        const availPhysicalBytes = BigInt(memoryStatus.ullAvailPhys);
        const totalVirtualBytes = BigInt(memoryStatus.ullTotalVirtual);
        const availVirtualBytes = BigInt(memoryStatus.ullAvailVirtual);

        const MB = BigInt(1024 * 1024);

        const totalPhysicalMB = Number(totalPhysicalBytes / MB);
        const availPhysicalMB = Number(availPhysicalBytes / MB);
        const totalVirtualMB = Number(totalVirtualBytes / MB);
        const availVirtualMB = Number(availVirtualBytes / MB);

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