import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
	Container, 
	Typography, 
	Box, 
	Grid, 
	Card, 
	CardContent, 
	CardMedia, 
	Button, 
	CardActions,
	Paper,
	Divider,
	useTheme,
	useMediaQuery
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

// Mock data - in a real app, this would come from an API
interface Video {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	price: number;
	isLive: boolean;
	youtubeId: string;
	upcoming?: boolean;
}

const mockVideos: Video[] = [
	{
		id: '1',
		title: 'Live Concert: Summer Beats',
		description: 'Join us for an amazing live concert experience with top artists!',
		thumbnail: 'https://via.placeholder.com/400x225/FF5722/FFFFFF?text=Live+Concert',
		price: 9.99,
		isLive: true,
		youtubeId: 'dQw4w9WgXcQ', // Example YouTube ID
		upcoming: false,
	},
	// ...add more videos as needed
];

const HomePage: React.FC = () => {
	const navigate = useNavigate();
	const { user, isAuthenticated } = useAuth();

	return (
		<Container>
			<Typography variant="h3" gutterBottom>Welcome to the Concert Platform</Typography>
			<Grid container spacing={4}>
				{mockVideos.map(video => (
					<Grid item xs={12} sm={6} md={4} key={video.id}>
						<Card>
							<CardMedia
								component="img"
								height="140"
								image={video.thumbnail}
								alt={video.title}
							/>
							<CardContent>
								<Typography variant="h5">{video.title}</Typography>
								<Typography variant="body2" color="text.secondary">{video.description}</Typography>
							</CardContent>
							<CardActions>
								<Button size="small" onClick={() => navigate(`/video/${video.id}`)}>View</Button>
								{video.isLive && <Button size="small" color="secondary">Live</Button>}
							</CardActions>
						</Card>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default HomePage;
