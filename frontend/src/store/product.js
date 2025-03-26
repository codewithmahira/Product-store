
import { create } from "zustand";


export const useProductStore = create((set) => ({

  products: [],

  setProducts: (products) => set({ products }),

  createProduct: async (product) => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create product');
      }

      const data = await response.json();

      // Add the newly created product to the store's `products` array
      set((state) => ({
        products: [...state.products, data],
      }));

      return { success: true, message: "Product created successfully" };

    } catch (error) {
      console.error("Error creating product:", error.message);
      return { success: true, message: error.message };
    }
  },

  fetchProducts: async () => {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    set({ products: data.data });

  },
  deleteProduct: async (pid) => {
    const res = await fetch(`http://localhost:5000/api/products/${pid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success)
      return { success: false, message: data.message };
    set(state => ({ products: state.products.filter(product => product._id !== pid) }));
    return { success: true, message: data.message };
  },
  updateProduct: async(pid,updatedProduct)=>{
    const res=await fetch(`http://localhost:5000/api/products/${pid}`,{
      method:"PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProduct),
    });
    const data=await res.json();
    if (!data.success) return {success:false, message:data.message};
    set(state =>({
      products:state.products.map((product)=> product._id===pid? data.data :product)

    }));
    return {success:true, message: data.message};
  },
}));

