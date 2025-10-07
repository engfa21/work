import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Tabs, 
  Tab, 
  Alert,
  Link
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `login-tab-${index}`,
    'aria-controls': `login-tabpanel-${index}`,
  };
}

const LoginPage: React.FC = () => {
  const [value, setValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      const isAdminLogin = value === 1;
      const success = await login(email, password, isAdminLogin);
      
      if (success) {
        navigate(from, { replace: true });
      } else {
        setError('Failed to log in. Please check your credentials.');
      }
    } catch (err) {
      setError('Failed to log in. Please try again later.');
      console.error('Login error:', err);
    }
    
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ width: '100%', p: 2, mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="login tabs"
              variant="fullWidth"
            >
              <Tab label="User Login" {...a11yProps(0)} />
              <Tab label="Admin Login" {...a11yProps(1)} />
            </Tabs>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TabPanel value={value} index={0}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              User Sign In
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                Sign In
              </Button>
              <Box textAlign="center">
                <Link component={RouterLink} to="/" variant="body2">
                  Back to home
                </Link>
              </Box>
            </Box>
          </TabPanel>
          
          <TabPanel value={value} index={1}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Admin Sign In
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="admin-email"
                label="Admin Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="admin-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                Admin Sign In
              </Button>
              <Box textAlign="center">
                <Link component={RouterLink} to="/" variant="body2">
                  Back to home
                </Link>
              </Box>
            </Box>
          </TabPanel>
        </Paper>
        
        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Demo Credentials:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User: user@example.com / user123
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Admin: admin@example.com / admin123
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
