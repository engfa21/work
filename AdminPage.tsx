import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  TextField, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  CardMedia, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Switch,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  AttachMoney as RevenueIcon,
  People as UsersIcon,
  Movie as VideoIcon,
  BarChart as AnalyticsIcon
} from '@mui/icons-material';
import { useAuth } from './src/context/AuthContext';

// Types
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  isLive: boolean;
  youtubeId: string;
  upcoming?: boolean;
  views?: number;
  purchases?: number;
  revenue?: number;
}

// Mock data
const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Live Concert: Summer Beats',
    description: 'Join us for an amazing live concert experience with top artists!',
    thumbnail: 'https://via.placeholder.com/400x225/FF5722/FFFFFF?text=Live+Concert',
    price: 9.99,
    isLive: true,
    youtubeId: 'dQw4w9WgXcQ',
    views: 1245,
    purchases: 320,
    revenue: 3196.8
  },
  {
    id: '2',
    title: 'Exclusive Interview: Behind the Scenes',
    description: 'Get an exclusive look behind the scenes with your favorite artists.',
    thumbnail: 'https://via.placeholder.com/400x225/2196F3/FFFFFF?text=Exclusive+Interview',
    price: 4.99,
    isLive: false,
    youtubeId: 'dQw4w9WgXcQ',
    views: 876,
    purchases: 210,
    revenue: 1047.9
  },
  {
    id: '3',
    title: 'Upcoming: Winter Festival 2023',
    description: 'Coming soon! The biggest winter festival of the year.',
    thumbnail: 'https://via.placeholder.com/400x225/4CAF50/FFFFFF?text=Coming+Soon',
    price: 14.99,
    isLive: false,
    upcoming: true,
    youtubeId: 'dQw4w9WgXcQ',
    views: 0,
    purchases: 0,
    revenue: 0
  },
];

// Mock analytics data
const mockAnalytics = {
  totalRevenue: 4244.7,
  totalUsers: 530,
  totalVideos: 3,
  monthlyRevenue: [
    { month: 'Jan', revenue: 1200 },
    { month: 'Feb', revenue: 1900 },
    { month: 'Mar', revenue: 1500 },
    { month: 'Apr', revenue: 2800 },
    { month: 'May', revenue: 3200 },
    { month: 'Jun', revenue: 4244.7 },
  ]
};

const AdminPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Video>>({
    title: '',
    description: '',
    thumbnail: '',
    price: 0,
    isLive: false,
    youtubeId: '',
    upcoming: false,
  });

  const { user } = useAuth();

  useEffect(() => {
    // In a real app, this would fetch videos from an API
    setVideos(mockVideos);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (video: Video | null = null) => {
    if (video) {
      setSelectedVideo(video);
      setFormData({
        ...video,
      });
    } else {
      setSelectedVideo(null);
      setFormData({
        title: '',
        description: '',
        thumbnail: 'https://via.placeholder.com/400x225/9E9E9E/FFFFFF?text=Thumbnail',
        price: 0,
        isLive: false,
        youtubeId: '',
        upcoming: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedVideo(null);
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      price: 0,
      isLive: false,
      youtubeId: '',
      upcoming: false,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedVideo) {
      // Update existing video
      setVideos(videos.map(video => 
        video.id === selectedVideo.id ? { ...formData, id: selectedVideo.id } as Video : video
      ));
    } else {
      // Add new video
      const newVideo: Video = {
        ...formData as Omit<Video, 'id'>,
        id: `video-${Date.now()}`,
        views: 0,
        purchases: 0,
        revenue: 0,
      };
      setVideos([...videos, newVideo]);
    }
    
    handleCloseDialog();
  };

  const handleOpenDeleteDialog = (videoId: string) => {
    setVideoToDelete(videoId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setVideoToDelete(null);
  };

  const handleDeleteVideo = () => {
    if (videoToDelete) {
      setVideos(videos.filter(video => video.id !== videoToDelete));
      handleCloseDeleteDialog();
    }
  };

  const extractYoutubeId = (url: string) => {
    // Extract YouTube video ID from URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const videoId = extractYoutubeId(url) || url;
    
    setFormData(prev => ({
      ...prev,
      youtubeId: videoId,
      thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
    }));
  };

  if (!user?.isAdmin) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Access Denied. Admin privileges required.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
          <Tab label="Dashboard" />
          <Tab label="Videos" />
          <Tab label="Analytics" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                <RevenueIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ${mockAnalytics.totalRevenue.toFixed(2)}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                <UsersIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Total Users
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {mockAnalytics.totalUsers}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                <VideoIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h6" color="text.secondary">
                    Total Videos
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {mockAnalytics.totalVideos}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Recent Videos</Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add New Video
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {videos.slice(0, 3).map((video) => (
                <Grid item xs={12} md={4} key={video.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={video.thumbnail}
                      alt={video.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {video.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {video.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          ${video.price} • {video.purchases} purchases
                        </Typography>
                        <Typography variant="body2" color="primary">
                          ${video.revenue?.toFixed(2)} revenue
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenDialog(video)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleOpenDeleteDialog(video.id)}>
                          <DeleteIcon fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Manage Videos
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add New Video
            </Button>
          </Box>
          
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="videos table">
              <TableHead>
                <TableRow>
                  <TableCell>Thumbnail</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Purchases</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell>
                      <Box 
                        component="img"
                        src={video.thumbnail}
                        alt={video.title}
                        sx={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{video.title}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {video.description.substring(0, 50)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: video.isLive 
                          ? 'error.light' 
                          : video.upcoming 
                            ? 'warning.light' 
                            : 'success.light',
                        color: video.isLive || video.upcoming ? '#fff' : 'text.primary',
                      }}>
                        {video.isLive ? 'Live Now' : video.upcoming ? 'Upcoming' : 'Available'}
                      </Box>
                    </TableCell>
                    <TableCell>${video.price}</TableCell>
                    <TableCell>{video.purchases}</TableCell>
                    <TableCell>${video.revenue?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Tooltip title="Preview">
                        <IconButton size="small" color="primary">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenDialog(video)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDeleteDialog(video.id)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Analytics
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Revenue Overview (Last 6 Months)
                </Typography>
                <Box sx={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                  {mockAnalytics.monthlyRevenue.map((monthData, index) => {
                    const height = (monthData.revenue / 5000) * 100;
                    return (
                      <Box 
                        key={monthData.month}
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          height: '100%',
                        }}
                      >
                        <Box 
                          sx={{
                            width: '60%',
                            height: `${Math.min(height, 100)}%`,
                            backgroundColor: 'primary.main',
                            borderRadius: 1,
                            mb: 1,
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.75rem',
                            padding: '4px 0',
                          }}
                        >
                          ${monthData.revenue}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {monthData.month}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Performing Videos
                </Typography>
                <Box>
                  {[...videos]
                    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
                    .slice(0, 3)
                    .map((video) => (
                      <Box 
                        key={video.id} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          mb: 2,
                          p: 1,
                          '&:hover': { bgcolor: 'action.hover' },
                          borderRadius: 1,
                        }}
                      >
                        <Box 
                          component="img"
                          src={video.thumbnail}
                          alt={video.title}
                          sx={{ width: 60, height: 34, objectFit: 'cover', borderRadius: 0.5, mr: 1.5 }}
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap>{video.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            ${video.revenue?.toFixed(2)} • {video.purchases} purchases
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Video Performance
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Video</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Views</TableCell>
                    <TableCell>Purchases</TableCell>
                    <TableCell>Conversion</TableCell>
                    <TableCell>Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {videos.map((video) => (
                    <TableRow key={video.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            component="img"
                            src={video.thumbnail}
                            alt={video.title}
                            sx={{ width: 60, height: 34, objectFit: 'cover', borderRadius: 0.5, mr: 1.5 }}
                          />
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {video.title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ 
                          display: 'inline-flex', 
                          alignItems: 'center',
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          bgcolor: video.isLive 
                            ? 'error.light' 
                            : video.upcoming 
                              ? 'warning.light' 
                              : 'success.light',
                          color: video.isLive || video.upcoming ? '#fff' : 'text.primary',
                          fontSize: '0.75rem',
                        }}>
                          {video.isLive ? 'Live Now' : video.upcoming ? 'Upcoming' : 'Available'}
                        </Box>
                      </TableCell>
                      <TableCell>{video.views}</TableCell>
                      <TableCell>{video.purchases}</TableCell>
                      <TableCell>
                        {video.views ? `${((video.purchases || 0) / video.views * 100).toFixed(1)}%` : '0%'}
                      </TableCell>
                      <TableCell>${video.revenue?.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}

      {/* Add/Edit Video Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{selectedVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={4}
                  required
                />
                <TextField
                  fullWidth
                  label="YouTube Video URL or ID"
                  name="youtubeId"
                  value={formData.youtubeId}
                  onChange={handleYoutubeUrlChange}
                  margin="normal"
                  required
                  helperText="Paste a YouTube URL or video ID"
                />
                <TextField
                  fullWidth
                  label="Thumbnail URL"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  margin="normal"
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                />
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isLive || false}
                        onChange={handleSwitchChange}
                        name="isLive"
                        color="primary"
                      />
                    }
                    label="Is Live Stream"
                  />
                </Box>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.upcoming || false}
                        onChange={handleSwitchChange}
                        name="upcoming"
                        color="primary"
                        disabled={formData.isLive}
                      />
                    }
                    label="Mark as Upcoming"
                    disabled={formData.isLive}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Preview
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  {formData.thumbnail ? (
                    <Box 
                      component="img"
                      src={formData.thumbnail}
                      alt="Video Thumbnail"
                      sx={{ 
                        width: '100%', 
                        height: 'auto',
                        borderRadius: 1,
                        mb: 2
                      }}
                    />
                  ) : (
                    <Box 
                      sx={{ 
                        bgcolor: 'grey.200', 
                        height: 200, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 2,
                        borderRadius: 1,
                      }}
                    >
                      <Typography color="text.secondary">Thumbnail Preview</Typography>
                    </Box>
                  )}
                  <Typography variant="h6" gutterBottom>
                    {formData.title || 'Video Title'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {formData.description || 'Video description will appear here.'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      {formData.price !== undefined ? `$${formData.price.toFixed(2)}` : '$0.00'}
                    </Typography>
                    <Box>
                      {formData.isLive && (
                        <Box 
                          component="span" 
                          sx={{
                            bgcolor: 'error.main',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            mr: 1,
                          }}
                        >
                          LIVE
                        </Box>
                      )}
                      {formData.upcoming && !formData.isLive && (
                        <Box 
                          component="span" 
                          sx={{
                            bgcolor: 'warning.main',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                          }}
                        >
                          COMING SOON
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Paper>
                
                {formData.youtubeId && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      YouTube Preview
                    </Typography>
                    <Box
                      sx={{
                        position: 'relative',
                        paddingBottom: '56.25%', // 16:9 aspect ratio
                        height: 0,
                        overflow: 'hidden',
                        borderRadius: 1,
                        bgcolor: 'black',
                      }}
                    >
                      <Box
                        component="iframe"
                        src={`https://www.youtube.com/embed/${formData.youtubeId}?autoplay=0&controls=1`}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          border: 0,
                        }}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="YouTube video player"
                      />
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={handleCloseDialog} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedVideo ? 'Update Video' : 'Add Video'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Video</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this video? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteVideo} 
            variant="contained" 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;
