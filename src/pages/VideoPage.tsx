import React from 'react';
import { Container, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VideoPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { user } = useAuth();
	return (
		<Container>
			<Typography variant="h4" gutterBottom>Video Page</Typography>
			<Typography variant="body1">Video ID: {id}</Typography>
			{/* Add video player and details here */}
		</Container>
	);
};

export default VideoPage;
