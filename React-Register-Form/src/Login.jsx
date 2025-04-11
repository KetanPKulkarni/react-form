import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Login.css';
import { useForm } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import Loader from './Loader';
import axios from 'axios';
import Cookies from 'js-cookie'; 

export default function Login() {
  const { register, handleSubmit, formState: { errors }, setValue, setFocus } = useForm();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFormSubmit = async (data) => {
    setLoading(true);

    setTimeout(async () => {
      try {
        const payload = {
          userName: data.userName,
          password: data.password
        };

        if (payload.userName === 'admin@gmail.com' && payload.password === 'Admin@123') {
          Cookies.set('user', 'admin'); 
          toast.success('Admin Login Successful!');
          setLoading(false);
          navigate('/dashboard');
          return;
        }

        const res = await axios.post('https://nodejs-backend-8ksy.vercel.app/login', payload);
        const resData = res.data;
        setLoading(false);

        if (resData.status) {
          Cookies.set('user', payload.userName); 
          toast.success(resData.message);
          navigate('/dashboard');
        } else {
          toast.error(resData.message);
        }
      } catch (error) {
        setLoading(false);
        toast.error('Something went wrong. Try again.');
        console.error(error);
      }
    }, 1000);
  };

  useEffect(() => {
    setValue('userName', '');
    setValue('password', '');
    setFocus('userName');
  }, [setValue, setFocus]);

  return (
    <>
      {isLoading && <Loader />}

      <div className="login-container">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <h2>Login</h2>

          <div className="input-field">
            <label>Username</label>
            <input
              type="text"
              {...register('userName', { required: 'Username is required' })}
            />
            {errors.userName && <p>{errors.userName.message}</p>}
          </div>

          <div className="input-field">
            <label>Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}

            <div className="forgot-password">
              <NavLink to="/forgot" className="forgot-link">
                Forgot Password?
              </NavLink>
            </div>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>

          <div className="login-links">
            <span>Don't have an account? </span>
            <Link to="/register" className="register">
              Register here
            </Link>
          </div>
        </form>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
    </>
  );
}
