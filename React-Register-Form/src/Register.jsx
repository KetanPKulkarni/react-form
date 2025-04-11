import { Toaster, toast } from 'react-hot-toast';
import './Register.css';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Loader from './Loader';
import axios from 'axios';

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const [isLoading, setLoading] = useState(false);
  const passwordValue = watch('password');

  const onFormSubmit = async (data) => {
    setLoading(true);

   
    const payload = {
      fullName: data.fullName,
      userName: data.userName,
      age: data.age,
      password: data.password
    };

    try {
      const res = await axios.post('https://nodejs-backend-8ksy.vercel.app/register', payload);
      const resData = res.data;
      setLoading(false);

      if (resData.status) {
        toast.success(resData.message);
      } else {
        toast.error(resData.message || 'Registration failed');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'white',
            color: 'black',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            style: {
              background: '#ff4d4f',
              color: 'white',
            },
          },
        }}
      />
      <div className="register-container">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <h2>Register</h2>

          <div className="input-field">
            <label>Full Name</label>
            <input
              type="text"
              {...register('fullName', { required: 'Full name is required' })}
            />
            {errors.fullName && <p>{errors.fullName.message}</p>}
          </div>

          <div className="input-field">
            <label>Email Address</label>
            <input
              type="email"
              {...register('userName', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.userName && <p>{errors.userName.message}</p>}
          </div>

          <div className="input-field">
            <label>Age</label>
            <input
              type="number"
              {...register('age', {
                required: 'Age is required',
                validate: (value) => value >= 18 || 'You must be 18 or older',
              })}
            />
            {errors.age && <p>{errors.age.message}</p>}
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
          </div>

          <div className="input-field">
            <label>Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === passwordValue || 'Passwords do not match',
              })}
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Register'}
          </button>
        </form>
      </div>
    </>
  );
}
