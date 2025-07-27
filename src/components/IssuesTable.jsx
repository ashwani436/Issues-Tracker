"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getGroupedRowModel,
  getExpandedRowModel,
} from "@tanstack/react-table";
import { useAtom } from 'jotai';
import { ArrowUpDown, Search, Users, Calendar, Folder, Target, Filter, SortAsc, SortDesc } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";

import { selectedIssueAtom, detailViewOpenAtom, tableStateAtom } from "@/store/atoms";
import { cn } from "@/lib/utils";

export function IssuesTable({ data, loading = false }) {
  const [selectedIssue, setSelectedIssue] = useAtom(selectedIssueAtom);
  const [detailViewOpen, setDetailViewOpen] = useAtom(detailViewOpenAtom);
  const [tableState, setTableState] = useAtom(tableStateAtom);
  
  const [sorting, setSorting] = React.useState(tableState.sorting);
  const [columnFilters, setColumnFilters] = React.useState(tableState.columnFilters);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState(tableState.rowSelection);
  const [globalFilter, setGlobalFilter] = React.useState(tableState.globalFilter);
  const [grouping, setGrouping] = React.useState(tableState.grouping);
  const [expanded, setExpanded] = React.useState({});

  // Update tableState atom when local state changes
  React.useEffect(() => {
    setTableState({
      globalFilter,
      columnFilters,
      sorting,
      grouping,
      rowSelection,
      pagination: tableState.pagination,
    });
  }, [globalFilter, columnFilters, sorting, grouping, rowSelection, setTableState, tableState.pagination]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg';
      case 'High': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md';
      case 'Medium': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md';
      case 'Low': return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-300 shadow-sm';
      case 'In Progress': return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-300 shadow-sm';
      case 'Todo': return 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 border-slate-300 shadow-sm';
      case 'Cancelled': return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-300 shadow-sm';
      default: return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Add these helper functions in your IssuesTable component
  const getStatusIndicator = (status) => {
    switch (status) {
      case 'Done': return 'bg-emerald-500 shadow-lg shadow-emerald-200';
      case 'In Progress': return 'bg-blue-500 shadow-lg shadow-blue-200';
      case 'Todo': return 'bg-slate-500 shadow-lg shadow-slate-200';
      case 'Cancelled': return 'bg-red-500 shadow-lg shadow-red-200';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-500 shadow-lg shadow-red-200 animate-pulse';
      case 'High': return 'bg-orange-500 shadow-lg shadow-orange-200';
      case 'Medium': return 'bg-yellow-500 shadow-lg shadow-yellow-200';
      case 'Low': return 'bg-green-500 shadow-lg shadow-green-200';
      default: return 'bg-gray-500';
    }
  };

  const columns = [
    {
      accessorKey: "identifier",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
          >
            <span className="font-semibold text-slate-700 group-hover:text-blue-700">ID</span>
            {isSorted === "asc" ? (
              <SortAsc className="ml-2 h-4 w-4 text-blue-600" />
            ) : isSorted === "desc" ? (
              <SortDesc className="ml-2 h-4 w-4 text-blue-600" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-mono text-sm font-bold bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-2 rounded-lg border border-indigo-200 shadow-sm">
          <span className="text-indigo-700">{row.getValue("identifier")}</span>
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
          >
            <span className="font-semibold text-slate-700 group-hover:text-blue-700">Title</span>
            {isSorted === "asc" ? (
              <SortAsc className="ml-2 h-4 w-4 text-blue-600" />
            ) : isSorted === "desc" ? (
              <SortDesc className="ml-2 h-4 w-4 text-blue-600" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const title = row.getValue("title");
        return (
          <div className="max-w-[300px] truncate font-semibold text-slate-800 hover:text-blue-700 transition-colors">
            {title}
          </div>
        );
      },
    },
    {
      accessorKey: "labels",
      header: () => (
        <span className="font-semibold text-slate-700">Labels</span>
      ),
      cell: ({ row }) => {
        const labels = row.getValue("labels");
        return (
          <div className="flex flex-wrap gap-1.5">
            {labels.slice(0, 2).map((label, index) => (
              <Badge 
                key={label} 
                variant="secondary" 
                className={cn(
                  "text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105",
                  index === 0 && "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200",
                  index === 1 && "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200"
                )}
              >
                {label}
              </Badge>
            ))}
            {labels.length > 2 && (
              <Badge variant="outline" className="text-xs bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all duration-200">
                +{labels.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "project",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
          >
            <Folder className="mr-2 h-4 w-4 text-amber-600 group-hover:text-amber-700" />
            <span className="font-semibold text-slate-700 group-hover:text-blue-700">Project</span>
            {isSorted === "asc" ? (
              <SortAsc className="ml-2 h-4 w-4 text-blue-600" />
            ) : isSorted === "desc" ? (
              <SortDesc className="ml-2 h-4 w-4 text-blue-600" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-semibold text-slate-800 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1 rounded-md border border-amber-200 shadow-sm">
          {row.getValue("project")}
        </div>
      ),
    },
    {
      accessorKey: "assignee",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
          >
            <Users className="mr-2 h-4 w-4 text-emerald-600 group-hover:text-emerald-700" />
            <span className="font-semibold text-slate-700 group-hover:text-blue-700">Assignee</span>
            {isSorted === "asc" ? (
              <SortAsc className="ml-2 h-4 w-4 text-blue-600" />
            ) : isSorted === "desc" ? (
              <SortDesc className="ml-2 h-4 w-4 text-blue-600" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const assignee = row.getValue("assignee");
        const initials = assignee?.split(' ').map(n => n[0]).join('').toUpperCase();
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              {initials}
            </div>
            <span className="font-medium text-slate-800">{assignee}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "cycle",
      header: () => (
        <span className="font-semibold text-slate-700">Cycle</span>
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs bg-gradient-to-r from-violet-50 to-purple-50 text-violet-800 border-violet-300 shadow-sm hover:shadow-md transition-shadow">
          {row.getValue("cycle")}
        </Badge>
      ),
    },
    {
      accessorKey: "estimate",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
          >
            <Target className="mr-2 h-4 w-4 text-rose-600 group-hover:text-rose-700" />
            <span className="font-semibold text-slate-700 group-hover:text-blue-700">Est.</span>
            {isSorted === "asc" ? (
              <SortAsc className="ml-2 h-4 w-4 text-blue-600" />
            ) : isSorted === "desc" ? (
              <SortDesc className="ml-2 h-4 w-4 text-blue-600" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center">
          <span className="font-bold text-lg bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
            {row.getValue("estimate")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
          >
            <span className="font-semibold text-slate-700 group-hover:text-blue-700">Priority</span>
            {isSorted === "asc" ? (
              <SortAsc className="ml-2 h-4 w-4 text-blue-600" />
            ) : isSorted === "desc" ? (
              <SortDesc className="ml-2 h-4 w-4 text-blue-600" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const priority = row.getValue("priority");
        return (
          <Badge className={cn("text-xs font-bold border-0 shadow-lg hover:scale-105 transition-transform", getPriorityColor(priority))}>
            {priority}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <span className="font-semibold text-slate-700">Status</span>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <Badge variant="outline" className={cn("text-xs font-semibold border-2 hover:scale-105 transition-transform", getStatusColor(status))}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
          >
            <Calendar className="mr-2 h-4 w-4 text-cyan-600 group-hover:text-cyan-700" />
            <span className="font-semibold text-slate-700 group-hover:text-blue-700">Due Date</span>
            {isSorted === "asc" ? (
              <SortAsc className="ml-2 h-4 w-4 text-blue-600" />
            ) : isSorted === "desc" ? (
              <SortDesc className="ml-2 h-4 w-4 text-blue-600" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("dueDate"));
        const isOverdue = date < new Date();
        return (
          <div className={cn(
            "text-sm font-medium px-2 py-1 rounded-md",
            isOverdue 
              ? "text-red-700 bg-gradient-to-r from-red-50 to-red-100 border border-red-200" 
              : "text-slate-600 bg-gradient-to-r from-slate-50 to-slate-100"
          )}>
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
          >
            <span className="font-semibold text-slate-700 group-hover:text-blue-700">Created</span>
            {isSorted === "asc" ? (
              <SortAsc className="ml-2 h-4 w-4 text-blue-600" />
            ) : isSorted === "desc" ? (
              <SortDesc className="ml-2 h-4 w-4 text-blue-600" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-sm text-slate-500 font-medium">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
          >
            <span className="font-semibold text-slate-700 group-hover:text-blue-700">Updated</span>
            {isSorted === "asc" ? (
              <SortAsc className="ml-2 h-4 w-4 text-blue-600" />
            ) : isSorted === "desc" ? (
              <SortDesc className="ml-2 h-4 w-4 text-blue-600" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return (
          <div className="text-sm text-slate-500 font-medium">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      grouping,
      expanded,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      const title = row.getValue('title');
      const identifier = row.getValue('identifier');
      return (
        title?.toLowerCase().includes(searchValue) ||
        identifier?.toLowerCase().includes(searchValue)
      );
    },
  });

  const handleRowClick = (issue) => {
    setSelectedIssue(issue);
    setDetailViewOpen(true);
  };

  // Get unique values for filters
  const getUniqueValues = (key) => {
    return Array.from(new Set(data.map(item => item[key]))).filter(Boolean);
  };

  const statusOptions = getUniqueValues('status');
  const projectOptions = getUniqueValues('project');
  const priorityOptions = getUniqueValues('priority');
  const assigneeOptions = getUniqueValues('assignee');
  const cycleOptions = getUniqueValues('cycle');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 shadow-lg"></div>
          <p className="text-slate-600 font-medium">Loading issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg">
      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <div className="pl-10 pr-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg border border-slate-300 text-sm text-slate-600 font-medium shadow-inner">
                Search by title or identifier...
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Filter className="h-4 w-4 text-blue-600" />
              <span>Filters:</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 flex-wrap">
            <div className="relative">
              <Select
                value={(table.getColumn("status")?.getFilterValue()) ?? ""}
                onValueChange={(value) =>
                  table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[130px] bg-white/90 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 font-medium">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="z-[110] bg-white/95 backdrop-blur-md border-slate-200 shadow-xl">
                  <SelectItem value="all" className="font-semibold text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100">
                    All Status
                  </SelectItem>
                  <SelectSeparator className="bg-slate-200" />
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-3 h-3 rounded-full ring-2 ring-white", getStatusIndicator(status))}></div>
                        <span className="font-medium">{status}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Select
                value={(table.getColumn("project")?.getFilterValue()) ?? ""}
                onValueChange={(value) =>
                  table.getColumn("project")?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[150px] bg-white/90 hover:bg-white hover:border-amber-300 hover:shadow-md transition-all duration-200 font-medium">
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent className="z-[110] bg-white/95 backdrop-blur-md border-slate-200 shadow-xl">
                  <SelectItem value="all" className="font-semibold text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100">
                    All Projects
                  </SelectItem>
                  <SelectSeparator className="bg-slate-200" />
                  {projectOptions.map((project) => (
                    <SelectItem key={project} value={project} className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50">
                      <div className="flex items-center gap-3">
                        <Folder className="h-4 w-4 text-amber-600" />
                        <span className="font-medium">{project}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Select
                value={(table.getColumn("priority")?.getFilterValue()) ?? ""}
                onValueChange={(value) =>
                  table.getColumn("priority")?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[130px] bg-white/90 hover:bg-white hover:border-red-300 hover:shadow-md transition-all duration-200 font-medium">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="z-[110] bg-white/95 backdrop-blur-md border-slate-200 shadow-xl">
                  <SelectItem value="all" className="font-semibold text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100">
                    All Priority
                  </SelectItem>
                  <SelectSeparator className="bg-slate-200" />
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority} value={priority} className="hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-3 h-3 rounded-full ring-2 ring-white", getPriorityIndicator(priority))}></div>
                        <span className="font-medium">{priority}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Select
                value={(table.getColumn("assignee")?.getFilterValue()) ?? ""}
                onValueChange={(value) =>
                  table.getColumn("assignee")?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[150px] bg-white/90 hover:bg-white hover:border-emerald-300 hover:shadow-md transition-all duration-200 font-medium">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent className="z-[110] bg-white/95 backdrop-blur-md border-slate-200 shadow-xl">
                  <SelectItem value="all" className="font-semibold text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100">
                    All Assignees
                  </SelectItem>
                  <SelectSeparator className="bg-slate-200" />
                  {assigneeOptions.map((assignee) => (
                    <SelectItem key={assignee} value={assignee} className="hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white shadow-md ring-2 ring-white">
                          {assignee.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="font-medium">{assignee}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Select
                value={(table.getColumn("cycle")?.getFilterValue()) ?? ""}
                onValueChange={(value) =>
                  table.getColumn("cycle")?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[150px] bg-white/90 hover:bg-white hover:border-violet-300 hover:shadow-md transition-all duration-200 font-medium">
                  <SelectValue placeholder="Cycle" />
                </SelectTrigger>
                <SelectContent className="z-[110] bg-white/95 backdrop-blur-md border-slate-200 shadow-xl">
                  <SelectItem value="all" className="font-semibold text-slate-700 bg-gradient-to-r from-slate-50 to-slate-100">
                    All Cycles
                  </SelectItem>
                  <SelectSeparator className="bg-slate-200" />
                  {cycleOptions.map((cycle) => (
                    <SelectItem key={cycle} value={cycle} className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-violet-600" />
                        <span className="font-medium">{cycle}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Grouping Controls */}
      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-md border border-white/50">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-semibold text-slate-700">Group by:</span>
          <Select
            value={grouping.length > 0 ? grouping[0] : "none"}
            onValueChange={(value) => {
              if (value === "none") {
                setGrouping([]);
              } else {
                setGrouping([value]);
              }
            }}
          >
            <SelectTrigger className="w-[160px] bg-white/90 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 font-medium">
              <SelectValue placeholder="No grouping" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-md border-slate-200 shadow-xl">
              <SelectItem value="none" className="font-semibold">No grouping</SelectItem>
              <SelectSeparator />
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="assignee">Assignee</SelectItem>
              <SelectItem value="cycle">Cycle</SelectItem>
              <SelectItem value="estimate">Estimate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enhanced Table with Vertical Scroll and Visual Indicators */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 overflow-hidden relative">
        {/* Fade effect at top */}
        <div className="table-fade-top"></div>
        
        <div className="max-h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar smooth-scroll relative">
          <table className="w-full">
            <thead className="sticky top-0 z-20 shadow-md">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b-2 border-slate-200 bg-gradient-to-r from-slate-100 via-blue-50 to-indigo-100 backdrop-blur-md">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="h-14 px-6 text-left align-middle font-bold text-slate-800 bg-gradient-to-b from-white/40 to-white/20 shadow-sm border-r border-white/30 last:border-r-0">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white/50">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "border-b border-slate-200/50 transition-all duration-200 cursor-pointer group",
                      "hover:bg-gradient-to-r hover:from-blue-50/70 hover:via-indigo-50/70 hover:to-purple-50/70",
                      "hover:shadow-lg hover:scale-[1.005] hover:border-blue-200 hover:z-10 relative",
                      index % 2 === 0 ? "bg-white/40" : "bg-slate-50/40"
                    )}
                    onClick={() => {
                      if (!row.getIsGrouped()) {
                        handleRowClick(row.original);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-6 align-middle border-r border-slate-200/30 last:border-r-0">
                        {cell.getIsGrouped() ? (
                          <div className="flex items-center bg-gradient-to-r from-slate-100 to-slate-200 p-3 rounded-lg shadow-sm border border-slate-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                row.getToggleExpandedHandler()();
                              }}
                              className="mr-3 p-2 hover:bg-white/80 rounded-full transition-all duration-200 hover:shadow-md"
                            >
                              <span className="text-lg transition-transform duration-200 inline-block hover:scale-110">
                                {row.getIsExpanded() ? '🔽' : '▶️'}
                              </span>
                            </button>
                            <strong className="text-slate-800 font-bold">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())} 
                              <span className="ml-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-xs font-bold shadow-lg">
                                {row.subRows.length}
                              </span>
                            </strong>
                          </div>
                        ) : cell.getIsAggregated() ? (
                          flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())
                        ) : cell.getIsPlaceholder() ? null : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500 py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center shadow-lg">
                        <Search className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="font-medium text-lg">No results found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Fade effect at bottom */}
        <div className="table-fade-bottom"></div>
        
        {/* Scroll indicator bar */}
        <div className="h-1 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200 opacity-60"></div>
        
        {/* Row count indicator in top right */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border border-slate-200 z-30">
          <span className="text-xs font-semibold text-slate-700">
            {table.getRowModel().rows.length} rows
          </span>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
        <div className="flex items-center justify-between space-x-2">
          <div className="flex-1 text-sm font-medium text-slate-600 bg-gradient-to-r from-slate-100 to-slate-200 px-4 py-2 rounded-lg">
            <span className="font-semibold text-slate-800">{table.getFilteredSelectedRowModel().rows.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{table.getFilteredRowModel().rows.length}</span> row(s) selected
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-semibold text-slate-700">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-9 w-[80px] bg-white hover:bg-slate-50 border-slate-300 shadow-sm">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top" className="bg-white/95 backdrop-blur-md shadow-xl">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`} className="hover:bg-blue-50">
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[120px] items-center justify-center text-sm font-semibold text-slate-700 bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-2 rounded-lg">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-9 w-9 p-0 lg:flex bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-slate-300 shadow-sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <span className="font-bold">{'⏮'}</span>
              </Button>
              <Button
                variant="outline"
                className="h-9 w-9 p-0 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-slate-300 shadow-sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <span className="font-bold">{'◀'}</span>
              </Button>
              <Button
                variant="outline"
                className="h-9 w-9 p-0 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-slate-300 shadow-sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <span className="font-bold">{'▶'}</span>
              </Button>
              <Button
                variant="outline"
                className="hidden h-9 w-9 p-0 lg:flex bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-slate-300 shadow-sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <span className="font-bold">{'⏭'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Issue Detail Dialog with Better Styling and Scroll */}
      <Dialog open={detailViewOpen} onOpenChange={setDetailViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-white via-slate-50 to-blue-50 border-slate-200 shadow-2xl overflow-hidden flex flex-col">
          {/* Fixed Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 -m-6 mb-0 p-6 border-b-2 border-slate-200 shadow-sm">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 mb-2">
                <span className="font-mono text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-lg font-bold ring-2 ring-indigo-200">
                  {selectedIssue?.identifier}
                </span>
                <span className="text-slate-800 font-bold text-xl leading-tight flex-1">
                  {selectedIssue?.title}
                </span>
              </DialogTitle>
              <DialogDescription className="text-slate-600 font-medium text-base">
                Complete issue details and information
              </DialogDescription>
            </DialogHeader>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 -mx-6">
            {selectedIssue && (
              <div className="space-y-8 pr-2">
                {/* Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-5 rounded-xl border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200 animate-pulse"></div>
                      Status
                    </h4>
                    <Badge variant="outline" className={cn("font-semibold text-base px-4 py-2", getStatusColor(selectedIssue.status))}>
                      {selectedIssue.status}
                    </Badge>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-pink-100 p-5 rounded-xl border-2 border-red-200 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full shadow-lg", getPriorityIndicator(selectedIssue.priority))}></div>
                      Priority
                    </h4>
                    <Badge className={cn("font-bold text-base px-4 py-2", getPriorityColor(selectedIssue.priority))}>
                      {selectedIssue.priority}
                    </Badge>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-5 rounded-xl border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      Assignee
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-lg ring-2 ring-blue-200">
                        {selectedIssue.assignee.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800 text-base">{selectedIssue.assignee}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-5 rounded-xl border-2 border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-2">
                      <Folder className="w-4 h-4 text-amber-600" />
                      Project
                    </h4>
                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-lg border border-amber-300 shadow-inner">
                      <p className="font-semibold text-slate-800 text-base">{selectedIssue.project}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-5 rounded-xl border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-sm font-bold text-purple-800 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      Due Date
                    </h4>
                    <div className="bg-gradient-to-r from-purple-100 to-violet-100 px-4 py-2 rounded-lg border border-purple-300 shadow-inner">
                      <p className="font-semibold text-slate-800 text-base">{new Date(selectedIssue.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-rose-50 to-pink-100 p-5 rounded-xl border-2 border-rose-200 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-sm font-bold text-rose-800 mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-rose-600" />
                      Estimate
                    </h4>
                    <div className="flex items-center justify-center bg-white rounded-lg p-3 shadow-inner border border-rose-200">
                      <span className="font-bold text-3xl bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                        {selectedIssue.estimate}
                      </span>
                      <span className="text-sm font-semibold text-slate-600 ml-1">pts</span>
                    </div>
                  </div>
                </div>
                
                {/* Labels Section */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border-2 border-slate-200 shadow-lg">
                  <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-500 rounded-full shadow-lg"></div>
                    Labels
                    <span className="ml-2 px-2 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold">
                      {selectedIssue.labels.length}
                    </span>
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedIssue.labels.map((label, index) => (
                      <Badge 
                        key={label} 
                        variant="secondary" 
                        className={cn(
                          "font-semibold shadow-md hover:scale-105 transition-all duration-200 px-4 py-2 text-sm border-2",
                          index % 4 === 0 && "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-300 hover:from-purple-200 hover:to-pink-200",
                          index % 4 === 1 && "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-300 hover:from-blue-200 hover:to-cyan-200",
                          index % 4 === 2 && "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300 hover:from-green-200 hover:to-emerald-200",
                          index % 4 === 3 && "bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border-orange-300 hover:from-orange-200 hover:to-yellow-200"
                        )}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Cycle Section */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-100 p-6 rounded-xl border-2 border-violet-200 shadow-lg">
                  <h4 className="text-base font-bold text-violet-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-600" />
                    Development Cycle
                  </h4>
                  <div className="bg-white p-4 rounded-lg shadow-inner border-2 border-violet-200">
                    <Badge variant="outline" className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 border-violet-400 font-bold text-lg px-6 py-3 shadow-md">
                      {selectedIssue.cycle}
                    </Badge>
                  </div>
                </div>
                
                {/* Description Section */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl border-2 border-slate-200 shadow-lg">
                  <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-500 rounded-full shadow-lg"></div>
                    Description
                  </h4>
                  <div className="bg-white p-6 rounded-lg border-2 border-slate-200 shadow-inner max-h-48 overflow-y-auto custom-scrollbar">
                    <p className="text-slate-700 leading-relaxed font-medium text-base">
                      {selectedIssue.description}
                    </p>
                  </div>
                </div>
                
                {/* Timestamps Section */}
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-xl border-2 border-slate-300 shadow-lg">
                  <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-600 rounded-full shadow-lg"></div>
                    Timeline Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-slate-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">+</span>
                        </div>
                        <span className="font-bold text-slate-700 text-base">Created</span>
                      </div>
                      <p className="text-slate-600 font-medium text-sm bg-slate-50 px-3 py-2 rounded border">
                        {new Date(selectedIssue.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-slate-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">↻</span>
                        </div>
                        <span className="font-bold text-slate-700 text-base">Last Updated</span>
                      </div>
                      <p className="text-slate-600 font-medium text-sm bg-slate-50 px-3 py-2 rounded border">
                        {new Date(selectedIssue.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Fixed Footer with Actions */}
          <div className="flex-shrink-0 bg-gradient-to-r from-slate-100 to-slate-200 -m-6 mt-0 p-4 border-t-2 border-slate-200 shadow-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Issue details loaded successfully</span>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setDetailViewOpen(false)}
                  className="bg-white hover:bg-slate-50 border-slate-300 text-slate-700 font-semibold px-6 py-2 shadow-md hover:shadow-lg transition-all"
                >
                  Close
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-2 shadow-md hover:shadow-lg transition-all"
                >
                  Edit Issue
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
