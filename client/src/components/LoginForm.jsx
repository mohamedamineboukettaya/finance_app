import { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // For redirecting to /dashboard
import { Link } from 'react-router-dom';         // For the "Register here" link
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';  // Your custom auth hook  // For managing form state

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // get the login function from context

  const [formData, setFormData] = useState({ // state for form inputs
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); //state to manage loading indicator
  // and prevent multiple submissions

  const [show, setShow] = useState(false); // state to toggle password visibility


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // to clear error when typing 

  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the form default refresh behavior
    setLoading(true);
    setError(''); // clear old errors
    const result = await login(formData.email, formData.password);

    if(result.success){ // because auth context login returns {success: true/false, message: '...'}
      navigate('/dashboard'); // redirect to dashboard on success
    } else {
      setError(result.message);
    }
    setLoading(false); // reset loading state and re-enable the form button

  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          
          
          <h2 className="title">Welcome Back</h2>
          <p className="subtitle">Sign in to manage your budget</p>
        </div>

        {/* Error */}
        {error && <div className="error-alert">{error}</div>}

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="form-group">
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={show ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
              />
            
            <button type="button" onClick={() => setShow(!show)} className="password-toggle">
            {show ? <EyeOff /> : <Eye />}
            </button>
            </div>
            
          </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <svg className="spinner" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Sign In'}
          </button>

          <p className="text-center-sm">
            Don't have an account? <Link to="/register" className="link-primary">Create one free</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;