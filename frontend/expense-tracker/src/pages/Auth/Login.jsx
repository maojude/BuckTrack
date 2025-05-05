import React, { useState, useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate } from 'react-router-dom';
import Input from "../../components/Inputs/Input";
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper'; 
import { API_PATHS, BASE_URL } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { UserContext } from '../../context/UserContext';

const Login = () => {

}

export default Login;