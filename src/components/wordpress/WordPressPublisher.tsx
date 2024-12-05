import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';

interface WordPressPublisherProps {
  content: string;
  title: string;
}

export const WordPressPublisher: React.FC<WordPressPublisherProps> = ({ content, title }) => {
  const [publishing, setPublishing] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');

  const publishToWordPress = async () => {
    setPublishing(true);
    try {
      // Configuration WordPress
      const wpConfig = {
        baseURL: process.env.REACT_APP_WP_API_URL,
        auth: {
          username: process.env.REACT_APP_WP_USERNAME,
          password: process.env.REACT_APP_WP_APP_PASSWORD,
        },
      };

      const postData = {
        title,
        content,
        status: scheduledDate ? 'future' : 'publish',
        date: scheduledDate || undefined,
      };

      // Implement actual WordPress API call here
      // const response = await axios.post('/wp-json/wp/v2/posts', postData, wpConfig);
      
    } catch (error) {
      console.error('Error publishing to WordPress:', error);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        WordPress Publisher
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          type="datetime-local"
          label="Schedule Publication"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          onClick={publishToWordPress}
          disabled={publishing}
          startIcon={publishing ? <CircularProgress size={20} /> : null}
        >
          {publishing ? 'Publishing...' : 'Publish to WordPress'}
        </Button>
      </Box>
    </Paper>
  );
};
