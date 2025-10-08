import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const success = await login(email, password, false);
		if (success) {
			navigate('/');
		} else {
			setError('Invalid credentials');
		}
	};

	return (
		<Container maxWidth="sm">
			<Typography variant="h4" gutterBottom>Login</Typography>
			<form onSubmit={handleSubmit}>
				<TextField
					label="Email"
					type="email"
					fullWidth
					margin="normal"
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<TextField
					label="Password"
					type="password"
					fullWidth
					margin="normal"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>
				{error && <Typography color="error">{error}</Typography>}
				<Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
			</form>
		</Container>
	);
};

export default LoginPage;
