
import { createContext, useContext, useState } from 'react';
import { apiClientProduct } from '../api/Authentication';
import { getToken } from '../services/tokenStorage';


export const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getallProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // Replace this with the JWT obtained after login.
      const token = await getToken();

      const response = await apiClientProduct.get(
        '/product/allproduct',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setProducts(data);
      return data;
    } catch (err) {
      console.error('Failed to fetch products');
      console.error('HTTP STATUS:', err.response?.status);
      console.error('RESPONSE DATA:', err.response?.data);
      console.error('REQUEST URL:', err.config?.url);
      console.error('ERROR MESSAGE:', err.message);

      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to fetch products'
      );

      return [];
    } finally {
      setLoading(false);
    }
  };

  

const addProduct = async (productData) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error('Authentication token not found. Please log in.');
    }
    console.log('Product data:',productData);

    const response = await apiClientProduct.post(
      '/product/create',
      productData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Product created:', response.data);

    return response.data;
  } catch (error) {
    console.error(
      'Error creating product:',
      error.response?.data || error.message
    );

    throw error;
  }
};

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        getallProduct,
        loading,
        error,
        addProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      'useProducts must be used within a ProductProvider'
    );
  }

  return context;
};
