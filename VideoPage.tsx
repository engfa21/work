import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  Avatar, 
  Divider, 
  IconButton,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { Send as SendIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ReactPlayer from 'react-player';
import { useAuth } from './src/context/AuthContext';

// Mock video data - in a real app, this would come from an API
const mockVideos = [
  {
    id: '1',
    title: 'Live Concert: Summer Beats',
    description: 'Join us for an amazing live concert experience with top artists!',
    thumbnail: 'https://via.placeholder.com/1280x720/FF5722/FFFFFF?text=Live+Concert',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    price: 9.99,
    isLive: true,
    views: 1245,
    likes: 842,
    uploadDate: '2023-06-15T19:00:00',
    duration: '1:23:45',
  },
  {
    id: '2',
    title: 'Exclusive Interview: Behind the Scenes',
    description: 'Get an exclusive look behind the scenes with your favorite artists.',
    thumbnail: 'https://via.placeholder.com/1280x720/2196F3/FFFFFF?text=Exclusive+Interview',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    price: 4.99,
    isLive: false,
    views: 876,
    likes: 523,
    uploadDate: '2023-06-10T14:30:00',
    duration: '45:22',
  },
];

// Mock comments data
const mockComments = [
  {
    id: '1',
    userId: 'user1',
    userName: 'MusicLover42',
    userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'This concert was amazing! The energy was incredible!',
    timestamp: '2023-06-15T20:15:00',
    likes: 24,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'ConcertGoer',
    userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'Best performance I\'ve seen this year!',
    timestamp: '2023-06-15T21:30:00',
    likes: 15,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'MusicFan123',
    userAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'Can\'t wait for the next one!',
    timestamp: '2023-06-16T09:45:00',
    likes: 8,
  },
];

const VideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef<NodeJS.Timeout>();

  // Format time in seconds to MM:SS
  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(14, 5);
  };

  // Handle video progress
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setProgress(state.played * 100);
  };

  // Handle video duration
  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    resetControlsTimer();
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
    resetControlsTimer();
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<{}>, newValue: number | number[]) => {
    const volume = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(volume);
    setMuted(volume === 0);
    resetControlsTimer();
  };

  // Handle seek change
  const handleSeekChange = (e: React.ChangeEvent<{}>, newValue: number | number[]) => {
    const newProgress = Array.isArray(newValue) ? newValue[0] : newValue;
    setProgress(newProgress);
    // In a real app, you would seek the video to this position
    // playerRef.current.seekTo(newProgress / 100);
    resetControlsTimer();
  };

  // Reset controls hide timer
  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Handle mouse movement to show controls
  const handleMouseMove = () => {
    resetControlsTimer();
  };

  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCommentObj = {
        id: `comment-${Date.now()}`,
        userId: user?.id || 'anonymous',
        userName: user?.email?.split('@')[0] || 'Anonymous',
        userAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
        text: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      setIsSubmitting(false);
    }, 500);
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Format view count
  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Load video data
  useEffect(() => {
    // In a real app, this would be an API call to fetch the video by ID
    const fetchVideo = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const foundVideo = mockVideos.find(v => v.id === id);
        
        if (!foundVideo) {
          throw new Error('Video not found');
        }
        
        // Check if user has purchased this video
        // In a real app, this would be checked against the user's purchased videos
        // For now, we'll just check if the user is authenticated
        if (!isAuthenticated) {
          throw new Error('Please log in to view this video');
        }
        
        setVideo(foundVideo);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video');
        console.error('Error fetching video:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideo();
    
    // Set up controls timer
    resetControlsTimer();
    
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [id, isAuthenticated]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space key to toggle play/pause
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      // M key to toggle mute
      else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      }
      // Left/Right arrow keys to seek
      else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        // Seek backward 5 seconds
        const newProgress = Math.max(0, progress - (5 / (duration || 1) * 100));
        setProgress(newProgress);
        // In a real app, you would seek the video to this position
        // playerRef.current.seekTo(newProgress / 100);
      }
      else if (e.code === 'ArrowRight') {
        e.preventDefault();
        // Seek forward 5 seconds
        const newProgress = Math.min(100, progress + (5 / (duration || 1) * 100));
        setProgress(newProgress);
        // In a real app, you would seek the video to this position
        // playerRef.current.seekTo(newProgress / 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [progress, duration]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/')}
          startIcon={<ArrowBackIcon />}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!video) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>
      
      <Grid container spacing={4}>
        {/* Video Player Section */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3} 
            sx={{ 
              position: 'relative',
              paddingTop: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden',
              borderRadius: 2,
              backgroundColor: '#000',
              '&:hover .video-controls': {
                opacity: 1,
              },
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              if (controlsTimeout.current) {
                clearTimeout(controlsTimeout.current);
              }
              setShowControls(false);
            }}
          >
            {/* Video Player */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            >
              <ReactPlayer
                url={video.videoUrl}
                width="100%"
                height="100%"
                playing={isPlaying}
                volume={muted ? 0 : volume}
                muted={muted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onProgress={handleProgress}
                onDuration={handleDuration}
                progressInterval={100}
                config={{
                  youtube: {
                    playerVars: { 
                      showinfo: 0,
                      controls: 0,
                      rel: 0,
                      modestbranding: 1,
                    },
                  },
                }}
              />
              
              {/* Custom Controls */}
              <Box
                className="video-controls"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                  color: '#fff',
                  padding: 2,
                  opacity: showControls ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 10,
                }}
              >
                {/* Progress Bar */}
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: 4, 
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 2,
                    mb: 2,
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    const newProgress = Math.min(Math.max(pos * 100, 0), 100);
                    setProgress(newProgress);
                    // In a real app, you would seek the video to this position
                    // playerRef.current.seekTo(pos);
                  }}
                >
                  <Box 
                    sx={{ 
                      width: `${progress}%`, 
                      height: '100%', 
                      backgroundColor: '#ff0000',
                      borderRadius: 2,
                      position: 'relative',
                    }}
                  >
                    <Box 
                      sx={{
                        position: 'absolute',
                        right: -6,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 12,
                        height: 12,
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: showControls ? 'block' : 'none',
                      }}
                    />
                  </Box>
                </Box>
                
                {/* Controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <IconButton 
                      onClick={togglePlay}
                      sx={{ color: '#fff' }}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Box component="span" sx={{ fontSize: '1.8rem' }}>⏸</Box>
                      ) : (
                        <Box component="span" sx={{ fontSize: '1.8rem' }}>▶️</Box>
                      )}
                    </IconButton>
                    
                    <IconButton 
                      onClick={toggleMute}
                      sx={{ color: '#fff' }}
                      aria-label={muted ? 'Unmute' : 'Mute'}
                    >
                      {muted || volume === 0 ? (
                        <Box component="span" sx={{ fontSize: '1.5rem' }}>🔇</Box>
                      ) : volume > 0.5 ? (
                        <Box component="span" sx={{ fontSize: '1.5rem' }}>🔊</Box>
                      ) : (
                        <Box component="span" sx={{ fontSize: '1.5rem' }}>🔉</Box>
                      )}
                    </IconButton>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 100 }}>
                      <Typography variant="caption" sx={{ color: '#fff' }}>
                        {formatTime((progress / 100) * duration)} / {formatTime(duration)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small"
                      onClick={() => {
                        // Toggle fullscreen
                        const element = document.documentElement;
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          element.requestFullscreen().catch(err => {
                            console.error(`Error attempting to enable fullscreen: ${err.message}`);
                          });
                        }
                      }}
                      sx={{ 
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      ⛶
                    </Button>
                  </Box>
                </Box>
              </Box>
              
              {/* Live Badge */}
              {video.isLive && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    backgroundColor: 'red',
                    color: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    zIndex: 2,
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
                  <Typography variant="caption" fontWeight="bold">
                    LIVE
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
          
          {/* Video Info */}
          <Box sx={{ mt: 3, mb: 4 }}>
            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {video.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {formatViewCount(video.views)} views • {formatDate(video.uploadDate)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                <Button 
                  startIcon={<span>👍</span>} 
                  size="small" 
                  sx={{ color: 'text.secondary', mr: 1 }}
                >
                  {formatViewCount(video.likes)}
                </Button>
                <Button 
                  startIcon={<span>👎</span>} 
                  size="small" 
                  sx={{ color: 'text.secondary' }}
                >
                  Dislike
                </Button>
              </Box>
            </Box>
            
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Avatar 
                  sx={{ width: 48, height: 48, mr: 2 }}
                  src="https://randomuser.me/api/portraits/lego/1.jpg"
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {video.isLive ? 'Streamed by' : 'Uploaded by'} LiveStream PPV
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {video.description}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
        
        {/* Comments Section */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Comments ({comments.length})
            </Typography>
            
            {/* Add Comment */}
            {isAuthenticated ? (
              <Box 
                component="form" 
                onSubmit={handleCommentSubmit}
                sx={{ mb: 3 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Avatar 
                    sx={{ width: 40, height: 40, mr: 2, mt: 1 }}
                    src={user?.email ? `https://i.pravatar.cc/150?u=${user.email}` : undefined}
                  >
                    {user?.email ? user.email[0].toUpperCase() : 'U'}
                  </Avatar>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      size="small"
                      multiline
                      rows={2}
                      sx={{ mb: 1 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        size="small"
                        disabled={!newComment.trim() || isSubmitting}
                        endIcon={<SendIcon />}
                      >
                        {isSubmitting ? 'Posting...' : 'Post'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box 
                sx={{ 
                  p: 2, 
                  mb: 3, 
                  backgroundColor: 'action.hover', 
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Please sign in to leave a comment
                </Typography>
              </Box>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            {/* Comments List */}
            <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, maxHeight: '60vh' }}>
              {comments.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No comments yet. Be the first to comment!
                  </Typography>
                </Box>
              ) : (
                comments.map((comment) => (
                  <Box 
                    key={comment.id} 
                    sx={{ 
                      display: 'flex', 
                      mb: 3,
                      '&:last-child': { mb: 0 } 
                    }}
                  >
                    <Avatar 
                      src={comment.userAvatar}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    >
                      {comment.userName[0].toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ mr: 1 }}>
                          {comment.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(comment.timestamp)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph sx={{ mb: 1 }}>
                        {comment.text}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton size="small" sx={{ mr: 1 }}>
                          <Box component="span" sx={{ fontSize: '1rem' }}>👍</Box>
                        </IconButton>
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                          {comment.likes > 0 ? comment.likes : ''}
                        </Typography>
                        <IconButton size="small">
                          <Box component="span" sx={{ fontSize: '1rem' }}>💬</Box>
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VideoPage;
