import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [newProductsForm, setNewProductsForm] = useState({
    id: 0,
    name: "",
    price: 0,
    desc: "",
    img: "",
  });
  const [mode, setMode] = useState("submit"); // "submit", "edit", or "delete"

  const handleNewProductsFormChange = (e) => {
    const value = e.target.name === "id" || e.target.name === "price" 
      ? parseInt(e.target.value) || 0 
      : e.target.value;
    
    setNewProductsForm({
      ...newProductsForm,
      [e.target.name]: value,
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiRes = await axios.get("/api/products");
        setProducts(apiRes.data);
        console.log(apiRes.data);
      } catch (err) {
        alert("Something went wrong!");
      }
    };
    fetchProducts();
  }, []);

  async function saveProduct(e) {
    e.preventDefault();
    try {
      await axios.post("/api/products", {
        id: newProductsForm.id,
        name: newProductsForm.name,
        price: newProductsForm.price,
        desc: newProductsForm.desc,
        img: newProductsForm.img,
      });
      alert("Data has been Saved!");

      const apiRes = await axios.get("http://localhost:3000/products");
      setProducts(apiRes.data);

      // Reset the form!!!!
      setNewProductsForm({
        id: 0,
        name: "",
        price: 0,
        desc: "",
        img: "",
      });
    } catch (err) {
      alert("Hmm ? :/");
    }
  }

  async function editProduct(e) {
    e.preventDefault();
    
    if (!newProductsForm.id) {
      alert("Please enter a product ID!");
      return;
    }
    
    try {
      console.log("Editing product with ID:", newProductsForm.id);
      console.log("Current products:", products);
      await axios.put(`/api/products/${newProductsForm.id}`, {
        name: newProductsForm.name,
        price: newProductsForm.price,
        desc: newProductsForm.desc,
        img: newProductsForm.img,
      });
      alert("Product has been Updated!");

      const apiRes = await axios.get("/api/products");
      setProducts(apiRes.data);

      setNewProductsForm({
        id: 0,
        name: "",
        price: 0,
        desc: "",
        img: "",
      });
      setMode("submit");
    } catch (err) {
      console.error("Edit error:", err);
      alert("Failed to update product! Make sure the product ID exists.");
    }
  }

  async function deleteProduct(e) {
    e.preventDefault();
    try {
      await axios.delete(`/api/products/${newProductsForm.id}`);
      alert("Product has been Deleted!");

      const apiRes = await axios.get("/api/products");
      setProducts(apiRes.data);

      setNewProductsForm({
        id: 0,
        name: "",
        price: 0,
        desc: "",
        img: "",
      });
      setMode("submit");
    } catch (err) {
      alert("Failed to delete product!");
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (mode === "submit") {
      saveProduct(e);
    } else if (mode === "edit") {
      editProduct(e);
    } else if (mode === "delete") {
      deleteProduct(e);
    }
  };

  return (
    <>
      <div className="main-heading">
        <h1>API Data Handling</h1>
      </div>
      <br />
      <form onSubmit={handleFormSubmit}>
        <input
          type="number"
          name="id"
          id="id"
          placeholder="Enter your product's id"
          onChange={handleNewProductsFormChange}
          value={newProductsForm.id || ""}
          required
        />
        <br />
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter your product's name"
          onChange={handleNewProductsFormChange}
          value={newProductsForm.name}
          required={mode !== "delete"}
          disabled={mode === "delete"}
        />
        <br />
        <input
          type="number"
          name="price"
          id="price"
          placeholder="Enter your product's price"
          onChange={handleNewProductsFormChange}
          value={newProductsForm.price || ""}
          required={mode !== "delete"}
          disabled={mode === "delete"}
        />
        <br />
        <input
          type="text"
          name="desc"
          id="desc"
          placeholder="Enter your product's description"
          onChange={handleNewProductsFormChange}
          value={newProductsForm.desc}
          required={mode !== "delete"}
          disabled={mode === "delete"}
        />
        <br />
        <input
          type="text"
          name="img"
          id="img"
          placeholder="Enter your product's Image URL"
          onChange={handleNewProductsFormChange}
          value={newProductsForm.img}
          required={mode !== "delete"}
          disabled={mode === "delete"}
        />
        <br />
        <div className="button-group">
          <button type="button" onClick={() => setMode("submit")} className={mode === "submit" ? "active" : ""}>
            Submit
          </button>
          <button type="button" onClick={() => setMode("edit")} className={mode === "edit" ? "active" : ""}>
            Edit
          </button>
          <button type="button" onClick={() => setMode("delete")} className={mode === "delete" ? "active" : ""}>
            Delete
          </button>
        </div>
        <button type="submit" style={{ marginTop: "1rem", width: "100%" }}>
          {mode === "submit" ? "Add Product" : mode === "edit" ? "Update Product" : "Delete Product"}
        </button>
      </form>
      <div className="products">
        {products.map((pr) => {
          return (
            <div key={pr.id} className="product-card">
              <div className="product-id">#{pr.id}</div>
              <img src={pr.img} alt={pr.name} />
              <h3 className="product-name">{pr.name}</h3>
              <p className="product-price">${pr.price}</p>
              <p className="product-desc">{pr.desc}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
