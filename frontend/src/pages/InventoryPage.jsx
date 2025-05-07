const columns = [
  {
    field: 'sku',
    headerName: 'SKU',
    width: 120,
    editable: false,
  },
  {
    field: 'name',
    headerName: 'Product Name',
    width: 200,
    editable: false,
  },
  {
    field: 'brand',
    headerName: 'Brand',
    width: 150,
    editable: false,
  },
  {
    field: 'supplier',
    headerName: 'Supplier',
    width: 150,
    editable: false,
  },
  {
    field: 'price',
    headerName: 'Price',
    width: 120,
    editable: false,
    valueFormatter: (params) => `₱${params.value.toFixed(2)}`,
  },
  {
    field: 'stock',
    headerName: 'Stock',
    width: 120,
    editable: false,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 150,
    editable: false,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <div className="flex gap-2">
        <button
          onClick={() => handleEditClick(params.row)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleDeleteClick(params.row)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    ),
  },
];

const defaultItem = {
  name: '',
  brand: '',
  price: '',
  stock: '',
  category: '',
  description: '',
  sku: '',
  supplier: '',
  lowStock: 10,
};

const handleAddItem = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to add item');
    }

    setOpenModal(false);
    setFormData(defaultItem);
    fetchInventory();
  } catch (error) {
    console.error('Error adding item:', error);
  }
};

const handleUpdateItem = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`http://localhost:5000/api/products/${editingItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to update item');
    }

    setOpenModal(false);
    setEditingItem(null);
    setFormData(defaultItem);
    fetchInventory();
  } catch (error) {
    console.error('Error updating item:', error);
  }
};

return (
  <div className="p-6">
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Inventory Management</h2>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData(defaultItem);
              setOpenModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Item
          </button>
        </div>
      </div>
      <div className="p-4">
        <DataGrid
          rows={inventory}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          autoHeight
          className="bg-white"
        />
      </div>
    </div>

    {openModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    name="lowStock"
                    value={formData.lowStock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </div>
); 