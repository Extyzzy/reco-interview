import { useState } from 'react';

import {
  useReactTable,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  HeaderGroup,
  Row,
  PaginationState,
} from '@tanstack/react-table';
import Pagination from './Pagination';

interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, never>[];
  pageSizeOptions?: number[]; // Optional prop to customize page size options
}

export const Table = <TData,>({
  data,
  columns,
  pageSizeOptions = [10, 25, 50],
}: TableProps<TData>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSizeOptions[0],
  });

  const table = useReactTable({
    data,
    //@ts-ignore
    columns,
    state: {
      pagination,
    },
    onStateChange: updater => {
      const newState =
        //@ts-ignore
        typeof updater === 'function' ? updater(pagination) : updater;
      setPagination(newState.pagination || pagination);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handlePageChange = (newPageIndex: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPageIndex }));
  };

  return (
    <div className="flex flex-col border-spacing-0 border border-gray-300 rounded-xl overflow-hidden shadow-sm">
      <table className="min-w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left bg-gray-800 text-white border-b border-gray-300"
                >
                  {header.isPlaceholder ? null : (
                    <p className="text-sm font-semibold">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </p>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row: Row<TData>) => (
            <tr
              key={row.id}
              className="hover:border-gray-800 hover:bg-gray-100 transition-colors duration-150 !rounded-b-3xl border-b"
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 text-sm text-gray-800 border-gray-300"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {table.getPageCount() > 1 && (
        <Pagination
          align="center"
          defaultPageSize={pagination.pageSize}
          showTotal={(total: number) => `Total ${total}`}
          total={table.getPageCount()}
          current={pagination.pageIndex}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};
