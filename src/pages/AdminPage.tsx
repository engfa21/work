import React from 'react';
import { Container, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const AdminPage: React.FC = () => {
	const { user } = useAuth();
	return (
		<Container>
			<Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
			<Typography variant="body1">Welcome, {user?.email || 'Admin'}!</Typography>
			{/* Add admin features here */}
		</Container>
	);
};

export default AdminPage;
