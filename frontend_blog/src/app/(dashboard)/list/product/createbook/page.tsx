"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function CreateBook() {
  const router = useRouter();

  const [book, setBook] = useState({
    isbn: "",
    name: "",
    author: "",
    description: "",
    price: "",
    image: null as File | null,
    quantity: "",
    status: "",
    category: "",
    publisher: "",
  });
  const changeBookFieldHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value
    });
  };
  const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBook({
        ...book,
        image: e.target.files[0], // Gán tệp
      });
    }
  };


  const onSubmitChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!book.image) {
      alert("Vui lòng chọn ảnh!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("isbn", book.isbn);
      formData.append("name", book.name);
      formData.append("author", book.author);
      formData.append("description", book.description);
      formData.append("price", book.price);
      formData.append("quantity", book.quantity);
      formData.append("status", book.status);
      formData.append("category", book.category);
      formData.append("publisher", book.publisher);
      if (book.image) {
        formData.append("image", book.image);
      }
      console.log("Data:", Array.from(formData.entries()));
      const res = await axios.post(`http://127.0.0.1:8000/api/addBook`,
        formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(res);
      toast.success("book created!", { position: "top-right" });

      setTimeout(() => {
        router.push("/list/product");
      }, 1000);
    } catch (error) {
      console.log("something with wrong");

    }
  }

  return (
    <form onSubmit={onSubmitChange}>
      <div className="flex max-w-4xl mx-auto mt-5 gap-6">
        {/* Hình ảnh */}
        <div className="w-[389px]">
          <div className="h-[360px] bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
            <img
              alt="Set image"
              className="w-full h-full object-cover"
            />
          </div>
          <input type="file"
            className="mt-2 file-input file-input-bordered w-full"
            onChange={changeFileHandler}
            name="image"

          />
        </div>
        {/* </form> */}
        {/* Form thông tin */}
        <div className="flex-1">
          <h1 className="text-2xl text-center mb-4">Create Book</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">ISBN:</label>
              <input type="text"
                className="input input-bordered w-full"
                name="isbn"
                onChange={changeBookFieldHandler}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Name:</label>
              <input type="text"
                className="input input-bordered w-full"
                onChange={changeBookFieldHandler}
                required
                name="name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Author:</label>
              <input type="text"
                className="input input-bordered w-full"
                onChange={changeBookFieldHandler}
                required
                name="author"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Publisher:</label>
              <input type="text"
                className="input input-bordered w-full"
                onChange={changeBookFieldHandler}
                required
                name="publisher"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category:</label>
              <input type="text"
                className="input input-bordered w-full"
                name="category"
                onChange={changeBookFieldHandler}
                required
              />
            </div>
            <div >
              <label className="block text-sm font-medium text-gray-900">Status:</label>
              <select
                className="select select-bordered w-full max-w-xs"
                name="status"
                onChange={(e) => setBook({ ...book, status: e.target.value })}
                required
              >
                <option value="available">Available</option>
                <option value="out_of_stock">Out_of_stock</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Price:</label>
              <input type="number"
                className="input input-bordered w-full"
                name="price"
                onChange={changeBookFieldHandler}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Quantity:</label>
              <input type="number"
                className="input input-bordered w-full"
                onChange={changeBookFieldHandler}
                required
                name="quantity"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium ">Description:</label>
              <textarea
                className="textarea textarea-bordered w-full h-[135px]"
                onChange={(e) => setBook({ ...book, description: e.target.value })}
                required
                name="description"
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-success mt-4 w-full">Create</button>
        </div>
      </div>
      <ToastContainer />
    </form>
  );
};