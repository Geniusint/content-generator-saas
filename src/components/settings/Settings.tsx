import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const Settings = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (event: any) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {t('settings.language', { returnObjects: false }) as string}
      </Typography>
      
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="language-select-label">
          {t('settings.chooseLanguage', { returnObjects: false }) as string}
        </InputLabel>
        <Select
          labelId="language-select-label"
          value={i18n.language}
          label={t('settings.chooseLanguage', { returnObjects: false }) as string}
          onChange={handleLanguageChange}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="fr">Français</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
