const API_URL = 'http://localhost:5000/api';

// Products API
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      body: formData // FormData will automatically set the correct Content-Type
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      body: formData // FormData will automatically set the correct Content-Type
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
