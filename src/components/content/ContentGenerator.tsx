import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { Configuration, OpenAIApi } from 'openai';

interface ContentGeneratorProps {
  persona: string;
  keywords: string[];
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({ persona, keywords }) => {
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    setLoading(true);
    try {
      // Implement OpenAI API call here
      // This is a placeholder for the actual implementation
      const prompt = `Write an SEO-optimized article about ${keywords.join(', ')} in the style of ${persona}`;
      
      // Add your OpenAI API key and implementation
      const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      
      // Implement actual API call here
      setGeneratedContent('Generated content will appear here');
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Content Generator
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          onClick={generateContent}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Content'}
        </Button>
        {generatedContent && (
          <TextField
            multiline
            rows={10}
            value={generatedContent}
            variant="outlined"
            fullWidth
          />
        )}
      </Box>
    </Paper>
  );
};
