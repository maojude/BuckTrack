import React, { useState, useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import { Link } from 'react-router-dom';
//import { validateEmail } from '../../utils/helper'; 
//import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
//import axiosInstance from '../../utils/axiosInstance';
//import { UserContext } from '../../context/UserContext';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {

    };

    return(
        <AuthLayout>
            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Please enter your details to log in.
                </p>
        
                {/* when form is submitted, handleLogin function is called */}  
                <form onSubmit={ handleLogin }>
                    {/* Input with props */}
                    {/* onChange passes the function to the real onChange */}
                    <Input
                    value={email} 
                    onChange={({ target }) => setEmail(target.value)}
                    label="Email Address"
                    placeholder="john@example.com"
                    type="text"
                    />
        
                    <Input
                    value={password} 
                    onChange={({ target }) => setPassword(target.value)}
                    label="Password"
                    placeholder="Min 8 characters"
                    type="password"
                    />
        
                    {/* Error message set from handleLogin function */}
                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        
                    <button type="submit" className="btn-primary">
                    LOGIN
                    </button>
        
        
                    <p className="text-[13px] text-slate-800 mt-3">
                    Don't have an account?{" "}
                    <Link className="font-medium text-primary underline" to="/signUp">
                        Sign Up
                    </Link> 
                    </p>
                </form>
            </div>
      </AuthLayout>
    )
}

export default Login;