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
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';

interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, never>[];
  pageSizeOptions?: number[];
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

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      columnFilters,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleResetFilters = () => {
    setColumnFilters([]); // Clear all column filters
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
                    <>
                      <p className="text-sm font-semibold">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </p>
                      {/* Column Filter Input */}
                      <div>
                        <input
                          type="text"
                          value={
                            columnFilters.find(
                              filter => filter.id === header.id,
                            )?.value || ''
                          }
                          onChange={e => {
                            const value = e.target.value;
                            setColumnFilters(prev => {
                              const existingFilter = prev.find(
                                filter => filter.id === header.id,
                              );
                              if (existingFilter) {
                                return prev.map(filter =>
                                  filter.id === header.id
                                    ? { ...filter, value }
                                    : filter,
                                );
                              }
                              return [...prev, { id: header.id, value }];
                            });
                          }}
                          placeholder={`Filter ${header.column.columnDef.header}`}
                          className="px-2 py-1 text-sm border rounded"
                        />
                      </div>
                    </>
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
              className="hover:border-gray-800 hover:bg-gray-100 transition-colors duration-150 border-b"
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

      <div className="p-4 bg-white border-t border-gray-300 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: table.getPageCount() }, (_, i) => (
            <button
              key={i}
              onClick={() => table.setPageIndex(i)}
              className={`px-4 py-2 border rounded ${pagination.pageIndex === i ? 'bg-gray-800 text-white' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Reset Filters Button */}
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
