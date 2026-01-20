import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type Row,
  type SortingState,
  getSortedRowModel,
  type CellContext,
} from "@tanstack/react-table";
import { useAtom } from "jotai";
import { tasksAtom } from "~/atoms";
import type { Task } from "~/types";
import type { GeoJSONFeature } from "ol/format/GeoJSON";
import TableActionButtons from "./TableActionButtons";
import { useState } from "react";

const columns = [
  {
    header: "Name", accessorKey: "name"
  },
  { header: "Created At", accessorKey: "createdAt" },
  { header: "Priority", accessorKey: "priority" },
  {
    header: "Position", accessorKey: "location", cell: (info: CellContext<Task, GeoJSONFeature>) => {
      const pos = info.getValue();
      return (
        <Box sx={{
          fontWeight: 500,
          color: 'hsl(222.2, 84%, 4.9%)'
        }}>{pos.geometry.coordinates[0].toFixed(4)}, {pos.geometry.coordinates[1].toFixed(4)}</Box>
      );
    }
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }: { row: Row<Task> }) => (
      <TableActionButtons row={row} />
    ),
  },
];

export default function TasksTable() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [tasks] = useAtom(tasksAtom);

  const table = useReactTable({
    data: tasks,
    columns,
    state: {
      sorting
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel()
  });

  return (
    (tasks.length > 0 ? (
      <Box component={Paper} sx={{
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        width: '100%'
      }}>
        <Box sx={{
          overflowX: 'auto'
        }}>
          <Table sx={{
            width: '100%'
          }}>
            <TableHead sx={{
              backgroundColor: 'action.hover'
            }}>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} style={{
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      lineHeight: '1.25rem',
                      fontWeight: 600,
                    }} onClick={header.column.getToggleSortingHandler()}>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1vw',
                        cursor: 'pointer'
                      }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() && (
                          <Box>{header.column.getIsSorted() === 'desc' ? '↓' : '↑'}</Box>
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    ) : (
      <Box sx={{
        width: '100%'
      }}>
        <Typography sx={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center'
        }}>This todo has no tasks</Typography>
      </Box>
    ))
  );
}

