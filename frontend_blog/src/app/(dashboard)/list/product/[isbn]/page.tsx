"use client";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function BookDetail() {
  const { isbn } = useParams();
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

  useEffect(() => {
    if (isbn) {
      fetchBook();
    }

  }, [isbn]);

  const fetchBook = async () => {
    try {
      const result = await axios.get(`http://127.0.0.1:8000/api/books/${isbn}`);

      setBook(result.data.Result);
      console.log(result.data.Result);
      // console.log("Image path:", book.image);
      // console.log("Image path:", book.isbn);



    } catch (error) {
      console.log("something went wrong");

    }
  };
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
    e.preventDefault();// chặn reload trang
    try {
      const formData = new FormData();
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
      // console.log("formData: ", formData);
      // console.log("isbn: ", isbn);
      const res = await axios.post(`http://127.0.0.1:8000/api/booksUpdate/${isbn}`,
        formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // alert("Update successfully");
      console.log(res);
      toast.success("book updated!", { position: "top-right" });

      setTimeout(() => {
        router.push("/list/product");
      }, 1000);

    } catch (error) {
      console.log("something went wrong");
      toast.success("ISBN already exists! pls change", { position: "top-right" });


    }

  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/booksDelete/${isbn}`);
    } catch (err) {
      console.error("Error deleting Book:", err);
    }
  };

  if (!isbn) {
    return <div>Loading...</div>; // Hiển thị loading khi chưa có id
  }

  return (
    <form onSubmit={onSubmitChange}>
      <div className="flex max-w-4xl mx-auto mt-5 gap-6">
        {/* Hình ảnh */}
        <div className="w-[389px]">
          <div className="h-[360px] bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
            <img src={`http://127.0.0.1:8000/storage/${book?.image}`}
              alt="Book image"
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
          <h1 className="text-2xl text-center mb-4">Edit Book</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">ISBN:</label>
              <input type="text"
                value={book.isbn}
                className="input input-bordered w-full"
                name="isbn"
                disabled />
            </div>
            <div>
              <label className="block text-sm font-medium">Name:</label>
              <input type="text"
                value={book.name}
                className="input input-bordered w-full"
                onChange={changeBookFieldHandler}
                name="name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Author:</label>
              <input type="text"
                value={book.author}
                className="input input-bordered w-full"
                onChange={changeBookFieldHandler}
                name="author"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Publisher:</label>
              <input type="text"
                value={book.publisher}
                className="input input-bordered w-full"
                onChange={changeBookFieldHandler}
                name="publisher"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category:</label>
              <input type="text"
                value={book.category}
                className="input input-bordered w-full"
                name="category"
                onChange={changeBookFieldHandler}
              />
            </div>
            <div >
              <label className="block text-sm font-medium text-gray-900">Status:</label>
              <select
                className="select select-bordered w-full max-w-xs"
                name="status"
                value={book.status}
                onChange={(e) => setBook({ ...book, status: e.target.value })}
              >
                <option value="available">Available</option>
                <option value="out_of_stock">Out_of_stock</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Price:</label>
              <input type="number"
                value={book.price}
                className="input input-bordered w-full"
                onChange={changeBookFieldHandler}
                name="price"
              />
              <span>VND</span>
            </div>
            <div>
              <label className="block text-sm font-medium">Quantity:</label>
              <input type="number"
                value={book.quantity}
                className="input input-bordered w-full"
                onChange={changeBookFieldHandler}
                name="quantity"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium ">Description:</label>
              <textarea
                value={book.description}
                className="textarea textarea-bordered w-full h-[135px]"
                onChange={(e) => setBook({ ...book, description: e.target.value })}
                name="description"
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-success mt-4 w-full">Update
          </button>
          <span><h1 className="text-center ">Or</h1></span>

          <button
            type="submit"
            className="btn btn-error mt-4 w-full"
            onClick={handleDelete}
          >Delete</button>

        </div>
      </div>
      <ToastContainer />
    </form>
  );
};