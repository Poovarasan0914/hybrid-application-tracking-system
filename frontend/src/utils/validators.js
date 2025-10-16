import * as yup from 'yup';

// Validation schemas using Yup
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

export const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

export const jobSchema = yup.object({
  title: yup
    .string()
    .min(3, 'Job title must be at least 3 characters')
    .required('Job title is required'),
  department: yup
    .string()
    .min(2, 'Department must be at least 2 characters')
    .required('Department is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .required('Job description is required'),
  requirements: yup
    .array()
    .of(yup.string().min(1, 'Requirement cannot be empty'))
    .min(1, 'At least one requirement is required')
    .required('Requirements are required'),
  type: yup
    .string()
    .oneOf(['full-time', 'part-time', 'contract', 'internship'], 'Invalid job type')
    .required('Job type is required'),
  location: yup
    .string()
    .min(2, 'Location must be at least 2 characters')
    .required('Location is required'),
  salary: yup.object({
    min: yup
      .number()
      .positive('Minimum salary must be positive')
      .required('Minimum salary is required'),
    max: yup
      .number()
      .positive('Maximum salary must be positive')
      .moreThan(yup.ref('min'), 'Maximum salary must be greater than minimum')
      .required('Maximum salary is required'),
    currency: yup
      .string()
      .default('USD')
  }).required('Salary information is required'),
  deadline: yup
    .date()
    .min(new Date(), 'Deadline must be in the future')
    .required('Deadline is required')
});

export const applicationSchema = yup.object({
  jobId: yup
    .string()
    .required('Job selection is required'),
  coverLetter: yup
    .string()
    .min(100, 'Cover letter must be at least 100 characters')
    .required('Cover letter is required'),
  documents: yup
    .array()
    .of(yup.object({
      name: yup.string().required('Document name is required'),
      url: yup.string().url('Invalid document URL').required('Document URL is required'),
      type: yup.string().required('Document type is required')
    }))
    .optional()
});

export const noteSchema = yup.object({
  note: yup
    .string()
    .min(10, 'Note must be at least 10 characters')
    .required('Note is required')
});

export const statusUpdateSchema = yup.object({
  status: yup
    .string()
    .oneOf(['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'], 'Invalid status')
    .required('Status is required')
});

export const userActivationSchema = yup.object({
  isActive: yup
    .boolean()
    .required('Activation status is required')
});

// Custom validation functions
export const validateFileSize = (file, maxSizeInMB = 5) => {
  if (!file) return true;
  const maxSize = maxSizeInMB * 1024 * 1024; // Convert MB to bytes
  return file.size <= maxSize;
};

export const validateFileType = (file, allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']) => {
  if (!file) return true;
  return allowedTypes.includes(file.type);
};

export const validatePasswordStrength = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength,
    strength: {
      minLength: password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
};

export default {
  loginSchema,
  registerSchema,
  jobSchema,
  applicationSchema,
  noteSchema,
  statusUpdateSchema,
  userActivationSchema,
  validateFileSize,
  validateFileType,
  validatePasswordStrength
};
