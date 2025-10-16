import { Container, Typography, Box, TextField, Button, Checkbox, FormControlLabel, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '../utils/validators';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const { register: registerUser, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '', role: 'applicant', rememberMe: true }
  });

  const onSubmit = async (values) => {
    clearError();
    const payload = { username: values.username, email: values.email, password: values.password, role: values.role };
    const result = await registerUser(payload, values.rememberMe);
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
      setError('root', { message: result.error || 'Registration failed' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            {...register('username')}
            error={!!errors.username}
            helperText={errors.username?.message}
            autoComplete="username"
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoComplete="email"
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            autoComplete="new-password"
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            autoComplete="new-password"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              defaultValue="applicant"
              {...register('role')}
              error={!!errors.role}
            >
              <MenuItem value="applicant">Applicant</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={<Checkbox color="primary" {...register('rememberMe')} />}
            label="Keep me signed in"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>

          <Typography variant="body2" align="center">
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
