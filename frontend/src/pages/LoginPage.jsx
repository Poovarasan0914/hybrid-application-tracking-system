import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../utils/validators';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const LoginPage = () => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false }
  });

  const onSubmit = async (values) => {
    clearError();
    const result = await login(values.email, values.password, values.rememberMe);
    if (result.success) {
      const role = result.user?.role;
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (role === 'bot') {
        navigate('/bot', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setError('root', { message: result.error || 'Login failed' });
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{
          fontSize: '2rem',
          color: '#1f2937',
          textAlign: 'center',
          marginBottom: '2rem',
          fontWeight: '600'
        }}>
          Welcome Back
        </h1>

        {error && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            color: '#dc2626',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{error}</span>
            <button 
              onClick={clearError}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc2626',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ×
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: errors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && (
              <span style={{ 
                color: '#ef4444', 
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                display: 'block'
              }}>
                {errors.email.message}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#374151',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: errors.password ? '2px solid #ef4444' : '1px solid #d1d5db',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && (
              <span style={{ 
                color: '#ef4444', 
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                display: 'block'
              }}>
                {errors.password.message}
              </span>
            )}
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <input
              type="checkbox"
              {...register('rememberMe')}
              id="rememberMe"
              style={{
                marginRight: '0.5rem',
                cursor: 'pointer'
              }}
            />
            <label 
              htmlFor="rememberMe"
              style={{
                color: '#374151',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? '0.7' : '1',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#1d4ed8';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#2563eb';
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p style={{
            textAlign: 'center',
            marginTop: '1rem',
            color: '#6b7280',
            fontSize: '0.875rem'
          }}>
            Don't have an account? {' '}
            <Link 
              to="/register"
              style={{
                color: '#2563eb',
                textDecoration: 'none',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
