import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ inside component

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );

      localStorage.setItem("token", res.data.token);
      alert("Login Successful");

      navigate("/dashboard"); // ✅ correct place
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4">Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
