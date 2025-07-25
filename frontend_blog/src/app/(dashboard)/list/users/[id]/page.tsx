"use client"
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function UsersDetail() {
  const router=useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchUser();
    }

  }, [id]);
 


  const [UserData, SetUserData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    is_admin: "",
  });


  const fetchUser = async () => {
    try {
      const result = await axios.get(`http://127.0.0.1:8000/api/users/${id}`);

      console.log("pulldata 1", result.data.Result);
      // SetUserData(result.data.Result);

      if (result.data.Result) {
        SetUserData({
          ...UserData,
          name: result.data.Result.name || "",
          email: result.data.Result.email || "",
          address: result.data.Result.address || "",
          phone: result.data.Result.phone || "",
          // password: "",
          is_admin: result.data.Result.is_admin?.toString() || "0", // Chuyển số thành chuỗi
        });
        console.log("pulldata 2", result.data.Result);
      }


    } catch (error) {
      console.log("something went wrong", error);

    }
  };
  const changeUserFieldHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    SetUserData({
      ...UserData,
      [e.target.name]: e.target.value
    });
  };


  const onSubmitChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();// chặn reload trang
    try {
      const formData = new FormData();
      formData.append("name", UserData.name);
      formData.append("email", UserData.email);
      if (UserData.password !==""){
        formData.append("password",UserData.password)
      }else{
        formData.append("password", "undefined");
      }
      
      formData.append("phone", UserData.phone || "");
      formData.append("address", UserData.address || "");
      formData.append("is_admin", UserData.is_admin);



      console.log("Data:", Array.from(formData.entries()));

      const res = await axios.post(`http://127.0.0.1:8000/api/usersUpdate/${id}`,
        formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // alert("Update successfully");
      console.log("sss", res);

      toast.success("user updated!", { position: "top-right" });

      setTimeout(() => {
      router.push("/list/users");
    }, 1000);

    } catch (error) {
      console.log("something went wrong", error);
    }

  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/usersDelete/${id}`);
      toast.success("user deleted!", { position: "top-right" });

      setTimeout(() => {
      router.push("/list/users");
    }, 1000);

    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (!id || !UserData) {
    return <div>Loading...</div>; // Xử lý trường hợp không có dữ liệu
  }


  return (
    <div className="max-w-lg mx-auto bg-white p-10 rounded-xl shadow-md mt-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Edit User</h2>
      <form onSubmit={onSubmitChange}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={UserData.name}
              onChange={changeUserFieldHandler}
              className="input input-bordered w-full"
              placeholder="Enter name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={UserData.email}
              onChange={changeUserFieldHandler}
              className="input input-bordered w-full"
              placeholder="Enter email"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={UserData.password}
              onChange={changeUserFieldHandler}
              className="input input-bordered w-full"
              placeholder="Enter password if you want to change"
            // required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={UserData.address}
              onChange={changeUserFieldHandler}
              className="input input-bordered w-full"
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={UserData.phone}
              onChange={changeUserFieldHandler}
              className="input input-bordered w-full"
              placeholder="Enter phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role: </label>
            <select
              name="is_admin"
              value={UserData.is_admin}
              onChange={(e) => SetUserData({ ...UserData, is_admin: e.target.value })}
              className="select select-bordered w-full"
              required
            >
              <option value="1">Admin</option>
              <option value="0">User</option>

            </select>
          </div>

          <button
            type="submit"
            className="btn btn-success w-full mt-4"
          >
            Update
          </button>
          <h1 className="text-center">Or</h1>
          <button
            type="submit"
            className="btn btn-error w-full mt-4"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
        <ToastContainer />

      </form>
    </div>
  );
};