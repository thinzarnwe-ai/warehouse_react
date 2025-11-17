import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../assets/warehouse_register.jpg';
import { AppContext } from '../contexts/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);
  const [formData, setFormData] = useState({ emp_id: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: 'Login failed. Please try again.' });
        }
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/");
    } catch (err) {
      setErrors({ general: 'An unexpected error occurred.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="flex flex-col lg:flex-row items-stretch justify-center bg-[#364f6b] rounded-lg overflow-hidden shadow-lg">
        {/* Image Section */}
        <div className="lg:h-[500px] lg:w-[400px] w-full">
          <img
            src={Image}
            alt="Warehouse login illustration"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Form Section */}
        <form
          className="w-full lg:w-[400px] h-full lg:h-[500px] p-10 bg-[#364f6b] flex flex-col justify-center"
          onSubmit={handleLogin}
        >
          <h1 className="mb-7 text-white font-medium text-2xl">Log In</h1>

          {errors.general && (
            <p className="text-red-300 mb-4">{errors.general}</p>
          )}

          <div className="mb-5">
            <label htmlFor="emp_id" className="block mb-2 text-sm font-medium text-white">
              Employee ID
            </label>
            <input
              type="text"
              name="emp_id"
              id="emp_id"
              value={formData.emp_id}
              onChange={handleChange}
              placeholder="000-000000"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
            {errors.emp_id && <p className="text-red-300">{errors.emp_id[0]}</p>}
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            />
            {errors.password && <p className="text-red-300">{errors.password[0]}</p>}
          </div>

          <div className="flex items-start mb-5">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300"
            />
            <label htmlFor="terms" className="ml-2 text-sm font-medium text-white">
              I agree with the <a href="#" className="text-blue-300 hover:underline">terms and conditions</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-auto text-white bg-[#e73f61] hover:bg-[#c23650] focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
