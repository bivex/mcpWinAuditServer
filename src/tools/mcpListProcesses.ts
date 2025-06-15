import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as ffi from "ffi-napi";
import * as ref from "ref-napi";
import * as Struct from "ref-struct-napi";

// Define Windows data types using ref-napi
const VOID = ref.types.void;
const UINT = ref.types.uint;
const ULONG = ref.types.ulong;
const DWORD = ref.types.ulong;
const HANDLE = ref.refType(VOID);
const BOOL = ref.types.bool;
const TCHAR = ref.types.char;

// Define PROCESSENTRY32 structure
const PROCESSENTRY32 = Struct({
  dwSize: DWORD,
  cntUsage: DWORD,
  th32ProcessID: DWORD,
  th32DefaultHeapID: ULONG,
  th32ModuleID: DWORD,
  cntThreads: DWORD,
  th32ParentProcessID: DWORD,
  pcPriClassBase: ULONG,
  dwFlags: DWORD,
  szExeFile: TCHAR.array(260),
});
const LPPROCESSENTRY32 = ref.refType(PROCESSENTRY32);

// Define Windows API functions
const kernel32 = ffi.Library("kernel32.dll", {
  CreateToolhelp32Snapshot: [HANDLE, [DWORD, DWORD]],
  Process32First: [BOOL, [HANDLE, LPPROCESSENTRY32]],
  Process32Next: [BOOL, [HANDLE, LPPROCESSENTRY32]],
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

      const hSnapshot = kernel32.CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);

      if (hSnapshot.address === INVALID_HANDLE_VALUE) {
        return {
          content: [
            {
              type: "text",
              text: "Error: Could not create process snapshot.",
            },
          ],
        };
      }

      const pe32 = new PROCESSENTRY32();
      pe32.dwSize = PROCESSENTRY32.size;

      let output = "";
      const processes = [];

      if (kernel32.Process32First(hSnapshot, pe32.ref)) {
        do {
          const processName = pe32.szExeFile.inspect().replace(/\u0000/g, "");
          const processId = pe32.th32ProcessID;

          const matchesFilter = 
            (!filterByName || processName.toLowerCase().includes(filterByName.toLowerCase())) &&
            (!filterById || processId === filterById);

          if (matchesFilter) {
            processes.push({ name: processName, id: processId });
          }
        } while (kernel32.Process32Next(hSnapshot, pe32.ref));
      }

      kernel32.CloseHandle(hSnapshot);

      if (processes.length > 0) {
        output = "Found processes:\n" + processes.map(p => `- Name: ${p.name}, ID: ${p.id}`).join("\n");
      } else {
        output = "No processes found matching the criteria.";
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