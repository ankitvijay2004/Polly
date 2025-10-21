import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const credentials = { username, email, password };
      const result = await axios.post(
        import.meta.env.VITE_API_URI + "/api/auth/signup",
        credentials
      ); // use import.meta.env for Vite
      setSuccessMessage("Registration successful! Redirecting...");

      localStorage.setItem("token", result.data.token);
      localStorage.setItem("username", username);
      localStorage.setItem("id", result.data.id);
      localStorage.setItem("email", email);

      setTimeout(() => {
        navigate("/profile");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || "An error occurred during registration"
      );
    }
  };

  const handleSignin = () => {
    navigate("/signin");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="hidden md:flex bg-[var(--retro_red)] md:w-[60%] h-screen flex-col items-center justify-center">
        <img src="/auth.svg" width={400} className="max-w-[80%]" />
        <div className="flex flex-col text-[var(--retro_bg_light)] text-center gap-3 mt-5 px-4">
          <div className="text-2xl md:text-3xl font-bold">
            Create, Connect, Change
          </div>
          <div className="w-72 m-auto text-sm md:text-base">
            Empowering Communities to Inspire Action and Transform Lives
          </div>
        </div>
      </div>

      <div className="bg-[var(--retro_bg_light)] w-full md:w-[40%] h-screen flex flex-col justify-center items-center gap-8 p-6">
        <div className="text-[var(--retro_blue)] text-2xl md:text-3xl font-bold">
          Register Now
        </div>

        {successMessage && (
          <div
            className="bg-[var(--retro_green)] text-[var(--retro_bg_light)] p-4 rounded-lg mt-4 w-full text-center"
            role="alert"
          >
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div
            className="bg-[var(--retro_red)] text-[var(--retro_bg_light)] p-4 rounded-lg mt-4 w-full text-center"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <form
          className="w-full max-w-md flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Username"
            className="p-3 w-full placeholder:text-[var(--retro_border)] outline-none bg-[var(--retro_bg_med)] border-2 border-[var(--retro_border)] focus:border-[var(--retro_green)] rounded-lg text-[var(--retro_red)]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="p-3 w-full placeholder:text-[var(--retro_border)] outline-none bg-[var(--retro_bg_med)] border-2 border-[var(--retro_border)] focus:border-[var(--retro_green)] rounded-lg text-[var(--retro_red)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 w-full placeholder:text-[var(--retro_border)] outline-none bg-[var(--retro_bg_med)] border-2 border-[var(--retro_border)] focus:border-[var(--retro_green)] rounded-lg text-[var(--retro_red)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full p-3 bg-[var(--retro_blue)] text-[var(--retro_bg_light)] rounded-lg mt-2 cursor-pointer"
          >
            Sign Up
          </button>
          <div className="text-[var(--retro_blue)] flex justify-center gap-2 text-sm">
            Already have an account?
            <div
              className="text-[var(--retro_red)] hover:underline cursor-pointer"
              onClick={handleSignin}
            >
              Sign In
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
