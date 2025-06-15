import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as ffi from "ffi-napi";
import * as ref from "ref-napi";
import * as Struct from "ref-struct-napi";
import ArrayType from "ref-array-napi";

// Define Windows data types using ref-napi
const VOID = ref.types.void;
const ULONG = ref.types.ulong;
const DWORD = ref.types.ulong;
const HANDLE = ref.refType(VOID);
const BOOL = ref.types.bool;
const WCHAR = ref.types.ushort;

// Define PROCESSENTRY32 structure
const PROCESSENTRY32 = Struct.default({
  dwSize: DWORD,
  cntUsage: DWORD,
  th32ProcessID: DWORD,
  th32DefaultHeapID: ULONG,
  th32ModuleID: DWORD,
  cntThreads: DWORD,
  th32ParentProcessID: DWORD,
  pcPriClassBase: ULONG,
  dwFlags: DWORD,
  szExeFile: ArrayType(WCHAR, 260),
});
const LPPROCESSENTRY32 = ref.refType(PROCESSENTRY32);

// Define Windows API functions
const kernel32 = ffi.Library("kernel32.dll", {
  CreateToolhelp32Snapshot: [HANDLE, [DWORD, DWORD]],
  Process32FirstW: [BOOL, [HANDLE, LPPROCESSENTRY32]],
  Process32NextW: [BOOL, [HANDLE, LPPROCESSENTRY32]],
  CloseHandle: [BOOL, [HANDLE]],
});

export function mcpListProcessesTool(server: McpServer) {
  server.tool(
    "mcpListProcesses",
    "Lists running processes on the Windows system",
    {
      filterByName: z.string().optional().describe("Optional filter to list processes by name (e.g., chrome.exe)"),
      filterById: z.number().optional().describe("Optional filter to list processes by ID"),
    },
    async ({ filterByName, filterById }) => {
      const TH32CS_SNAPPROCESS = 0x00000002;
      const INVALID_HANDLE_VALUE = -1;
      let debugMessage = "";

      const hSnapshot = kernel32.CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
      debugMessage += `Snapshot Handle: ${hSnapshot.address}; `;

      if (hSnapshot.address === INVALID_HANDLE_VALUE) {
        debugMessage += "CreateToolhelp32Snapshot failed.";
        return {
          content: [
            {
              type: "text",
              text: `Error: Could not create process snapshot. Debug: ${debugMessage}`,
            },
          ],
        };
      }

      // Allocate a Buffer for the PROCESSENTRY32 structure
      const pe32Buffer = ref.alloc(PROCESSENTRY32);
      // Get a JavaScript object representation of the struct from the buffer
      const pe32 = pe32Buffer.deref();
      pe32.dwSize = PROCESSENTRY32.size;

      const processes = [];

      let firstProcessResult = kernel32.Process32FirstW(hSnapshot, pe32Buffer);
      debugMessage += `Process32FirstW result: ${firstProcessResult}; `;

      if (firstProcessResult) {
        do {
          // Correctly read wide string from ArrayType buffer
          const processName = pe32.szExeFile.readString(0, 260 * WCHAR.size, 'ucs2').replace(/\0/g, '');
          const processId = pe32.th32ProcessID;

          const matchesFilter = 
            (!filterByName || processName.toLowerCase().includes(filterByName.toLowerCase())) &&
            (!filterById || processId === filterById);

          if (matchesFilter) {
            processes.push({ name: processName, id: processId });
          }
          // Check Process32NextW result to see if loop continues
          let nextProcessResult = kernel32.Process32NextW(hSnapshot, pe32Buffer);
          if (!nextProcessResult && processes.length > 0) {
            // If we found some processes but the loop stopped unexpectedly
            debugMessage += "Process32NextW returned false prematurely after finding processes.";
          } else if (!nextProcessResult && processes.length === 0) {
            // If no processes found and loop stopped at the first attempt to move next
            debugMessage += "Process32NextW returned false, no processes found during iteration.";
          }

        } while (kernel32.Process32NextW(hSnapshot, pe32Buffer));
      } else {
        debugMessage += "Process32FirstW returned false, no processes found.";
      }

      kernel32.CloseHandle(hSnapshot);

      if (processes.length > 0) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(processes, null, 2),
            },
          ],
        };
      } else {
        return {
          content: [
            {
              type: "text",
              text: `No processes found matching the criteria. Debug: ${debugMessage}`,
            },
          ],
        };
      }
    }
  );
} 