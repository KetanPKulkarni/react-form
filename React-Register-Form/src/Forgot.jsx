import './Forgot.css';
import { useForm } from 'react-hook-form';

export default function Forgot() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    console.log('Forgot request for:', data);
   
  };

  return (
    <div className="forgot-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Forgot Password</h2>

        <div className="input-field">
          <label>Email Address</label>
          <input
            type="email"
            {...register('Email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Enter a valid email'
              }
            })}
          />
          {errors.Email && <p>{errors.Email.message}</p>}
        </div>

        <button type="submit">Forgot</button>
      </form>
    </div>
  );
}
