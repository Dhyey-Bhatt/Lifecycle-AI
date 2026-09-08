import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Filter, 
  FileSpreadsheet, 
  FileCode,
  Eye,
  Trash2,
  SlidersHorizontal
} from 'lucide-react';

export const DataTable = ({
  columns,
  data = [],
  onRowClick,
  onDeleteRow,
  title = "Documents",
  searchPlaceholder = "Search by product, brand, model, serial...",
  initialSortField = "purchaseDate",
  initialSortAsc = false,
  statusOptions = ["All", "Valid", "Expiring Soon", "Expired", "Renewed", "Archived"],
  categoryOptions = ["All", "Laptops & Computers", "Smartphones & Tablets", "Home Appliances", "Audio & Wearables"],
  customActions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortField, setSortField] = useState(initialSortField);
  const [sortAsc, setSortAsc] = useState(initialSortAsc);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());

  // Handle sorting toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      const matchesSearch = !searchTerm || Object.values(item).some(val => 
        val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Status filter
      const matchesStatus = selectedStatus === 'All' || 
        (item.status && item.status.toLowerCase() === selectedStatus.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'All' || 
        (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesStatus && matchesCategory;
    }).sort((a, b) => {
      if (!sortField) return 0;
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [data, searchTerm, selectedStatus, selectedCategory, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handle row selection
  const toggleSelectAll = () => {
    if (selectedRowIds.size === paginatedData.length) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(paginatedData.map(r => r.id)));
    }
  };

  const toggleSelectRow = (id, e) => {
    e.stopPropagation();
    const newSelected = new Set(selectedRowIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRowIds(newSelected);
  };

  // Export to CSV
  const exportCSV = () => {
    const rowsToExport = selectedRowIds.size > 0 
      ? filteredData.filter(d => selectedRowIds.has(d.id))
      : filteredData;

    const headers = columns.map(c => c.header).join(',');
    const rows = rowsToExport.map(row => 
      columns.map(c => {
        let val = row[c.accessor] ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lifecycle_documents_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportJSON = () => {
    const rowsToExport = selectedRowIds.size > 0 
      ? filteredData.filter(d => selectedRowIds.has(d.id))
      : filteredData;

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(rowsToExport, null, 2))}`;
    const link = document.createElement("a");
    link.setAttribute("href", jsonString);
    link.setAttribute("download", `lifecycle_documents_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="datatable-container">
      {/* Header with Search and Filters */}
      <div className="datatable-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="datatable-search">
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder={searchPlaceholder} 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="datatable-filters">
            <select 
              className="select-filter"
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              {statusOptions.map(st => (
                <option key={st} value={st}>Status: {st}</option>
              ))}
            </select>

            <select 
              className="select-filter"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              {categoryOptions.map(cat => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {customActions}

          <button 
            className="btn btn-secondary" 
            onClick={exportCSV}
            title="Export filtered records to CSV"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
          >
            <FileSpreadsheet size={15} />
            Export CSV
          </button>

          <button 
            className="btn btn-secondary" 
            onClick={exportJSON}
            title="Export to JSON"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
          >
            <FileCode size={15} />
            JSON
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="table-responsive">
        <table className="custom-datatable">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input 
                  type="checkbox"
                  checked={paginatedData.length > 0 && selectedRowIds.size === paginatedData.length}
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              {columns.map(col => (
                <th 
                  key={col.accessor || col.header} 
                  className={col.sortable !== false ? "sortable" : ""}
                  onClick={() => col.sortable !== false && handleSort(col.accessor)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {col.header}
                    {col.sortable !== false && sortField === col.accessor && (
                      sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <SlidersHorizontal size={32} color="var(--color-secondary)" />
                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>No documents matched your criteria.</p>
                    <p style={{ fontSize: '0.82rem' }}>Try clearing filters or search terms.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr 
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox"
                      checked={selectedRowIds.has(row.id)}
                      onChange={(e) => toggleSelectRow(row.id, e)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  {columns.map(col => (
                    <td key={col.accessor || col.header}>
                      {col.render ? col.render(row[col.accessor], row) : (row[col.accessor] ?? '—')}
                    </td>
                  ))}
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                      {onRowClick && (
                        <button 
                          className="btn btn-soft" 
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                          onClick={() => onRowClick(row)}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                      )}
                      {onDeleteRow && (
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem', color: '#EF4444' }}
                          onClick={() => onDeleteRow(row)}
                          title="Delete Document"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination & Page Size */}
      <div className="datatable-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>
            Showing <strong>{filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to <strong>{Math.min(currentPage * pageSize, filteredData.length)}</strong> of <strong>{filteredData.length}</strong> items
          </span>
          {selectedRowIds.size > 0 && (
            <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              ({selectedRowIds.size} selected)
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Rows:</span>
            <select 
              className="select-filter"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="pagination">
            <button 
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((pageNum, idx, arr) => {
                const prevPage = arr[idx - 1];
                return (
                  <React.Fragment key={pageNum}>
                    {prevPage && pageNum - prevPage > 1 && (
                      <span style={{ padding: '0 0.25rem', color: 'var(--text-muted)' }}>...</span>
                    )}
                    <button 
                      className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </React.Fragment>
                );
              })
            }

            <button 
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
