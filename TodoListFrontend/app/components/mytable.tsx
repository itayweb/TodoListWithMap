import { Box, IconButton } from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const data = [
  { id: 1, name: "Alice", role: "Developer" },
  { id: 2, name: "Bob", role: "Designer" },
];

const columns = [
  { header: "Name", accessorKey: "name" },
  { header: "Created At", accessorKey: "createdat" },
  { header: "Priority", accessorKey: "priority" },
  { header: "Position", accessorKey: "position" },
  {
    header: "Actions",
    id: "actions", // Unique ID is required since there's no accessorKey
    cell: ({ row }) => (
      <Box>
        <IconButton>
          <EditIcon color="primary" />
        </IconButton>
        <IconButton>
          <DeleteIcon color="primary" />
        </IconButton>
      </Box>
    ),
  },
];

export default function MyTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
