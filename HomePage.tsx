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
import { useAuth } from './src/context/AuthContext';

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
  },
  {
    id: '2',
    title: 'Exclusive Interview: Behind the Scenes',
    description: 'Get an exclusive look behind the scenes with your favorite artists.',
    thumbnail: 'https://via.placeholder.com/400x225/2196F3/FFFFFF?text=Exclusive+Interview',
    price: 4.99,
    isLive: false,
    youtubeId: 'dQw4w9WgXcQ', // Example YouTube ID
  },
  {
    id: '3',
    title: 'Upcoming: Winter Festival 2023',
    description: 'Coming soon! The biggest winter festival of the year.',
    thumbnail: 'https://via.placeholder.com/400x225/4CAF50/FFFFFF?text=Coming+Soon',
    price: 14.99,
    isLive: false,
    upcoming: true,
    youtubeId: 'dQw4w9WgXcQ', // Example YouTube ID
  },
];

const HomePage: React.FC = () => {
  const { isAuthenticated, user, purchaseVideo } = useAuth();
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // In a real app, this would be an API call to fetch videos
    setVideos(mockVideos);
    setFeaturedVideo(mockVideos[0]); // First video is featured
  }, []);

  const handlePurchase = (videoId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }
    
    // In a real app, this would process a payment
    purchaseVideo(videoId);
    
    // Navigate to the video page after purchase
    navigate(`/video/${videoId}`);
  };

  const hasPurchased = (videoId: string) => {
    return user?.purchasedVideos?.includes(videoId) || false;
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section / Featured Video */}
      {featuredVideo && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
            {featuredVideo.isLive ? 'Live Now' : 'Featured Content'}
          </Typography>
          <Paper 
            elevation={3} 
            sx={{ 
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden',
              mb: 2,
              borderRadius: 2,
              '&:hover': {
                boxShadow: 6,
              },
            }}
          >
            <Box
              component="img"
              src={featuredVideo.thumbnail}
              alt={featuredVideo.title}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                textAlign: 'center',
                p: 3,
              }}
            >
              <Typography variant={isMobile ? 'h5' : 'h4'} component="h2" gutterBottom>
                {featuredVideo.title}
              </Typography>
              <Typography variant={isMobile ? 'body1' : 'h6'} paragraph>
                {featuredVideo.description}
              </Typography>
              {featuredVideo.isLive && (
                <Box 
                  sx={{
                    backgroundColor: 'red',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box 
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      mr: 1,
                      animation: 'pulse 1.5s infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 },
                      },
                    }}
                  />
                  LIVE NOW
                </Box>
              )}
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={() => handlePurchase(featuredVideo.id)}
                disabled={hasPurchased(featuredVideo.id) || featuredVideo.upcoming}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                }}
              >
                {hasPurchased(featuredVideo.id) 
                  ? 'Watch Now' 
                  : featuredVideo.upcoming
                  ? 'Coming Soon'
                  : `Watch for $${featuredVideo.price}`}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Upcoming Events / Videos */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 3 }}>
          Upcoming & Recent Events
        </Typography>
        
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item key={video.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <CardMedia
                    component="img"
                    image={video.thumbnail}
                    alt={video.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  {video.isLive && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'red',
                        color: 'white',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Box 
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          mr: 0.5,
                          animation: 'pulse 1.5s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                            '100%': { opacity: 1 },
                          },
                        }}
                      />
                      LIVE
                    </Box>
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {video.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {video.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Typography variant="h6" color="primary">
                    {video.upcoming ? 'Coming Soon' : `$${video.price}`}
                  </Typography>
                  <Button 
                    size="small" 
                    variant={hasPurchased(video.id) ? 'outlined' : 'contained'}
                    onClick={() => handlePurchase(video.id)}
                    disabled={video.upcoming}
                  >
                    {hasPurchased(video.id) ? 'Watch Now' : 'Purchase'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Ad Space */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 6, 
          textAlign: 'center',
          backgroundColor: theme.palette.grey[100],
          border: `1px dashed ${theme.palette.grey[400]}`,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Ad Space Available
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Contact us to advertise your brand on our platform
        </Typography>
      </Paper>

      {/* How It Works */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4, mb: 3 }}>
          How It Works
        </Typography>
        <Grid container spacing={3}>
          {[
            {
              title: 'Browse Events',
              description: 'Explore our selection of live and upcoming events',
              icon: '🔍',
            },
            {
              title: 'Purchase Access',
              description: 'Get instant access to the content you love',
              icon: '💳',
            },
            {
              title: 'Enjoy',
              description: 'Watch high-quality streams on any device',
              icon: '🎬',
            },
          ].map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Box 
                  sx={{
                    fontSize: '2.5rem',
                    mb: 2,
                  }}
                >
                  {step.icon}
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
