import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography, TextField, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { firestoreService, UserSettings } from '../../services/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type PaymentMethod = 'creditCard' | 'paypal' | 'bankTransfer' | '';

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [creditCardExpiry, setCreditCardExpiry] = useState('');
  const [creditCardCvv, setCreditCardCvv] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [bankAccountHolder, setBankAccountHolder] = useState('');
  const [bankIban, setBankIban] = useState('');
  const [bankBic, setBankBic] = useState('');
    const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  useEffect(() => {
    const fetchUserSettings = async () => {
      const settings = await firestoreService.getUserSettings();
      if (settings && settings.data()) {
        setUserSettings(settings.data() as UserSettings);
        setCompanyName(settings.data().billing?.companyName || '');
        setBillingAddress(settings.data().billing?.billingAddress || '');
        setVatNumber(settings.data().billing?.vatNumber || '');
        setPaymentMethod(settings.data().billing?.paymentMethod as PaymentMethod || '');
        setCreditCardNumber(settings.data().billing?.creditCard?.cardNumber || '');
        setCreditCardExpiry(settings.data().billing?.creditCard?.expiryDate || '');
        setCreditCardCvv(settings.data().billing?.creditCard?.cvv || '');
        setPaypalEmail(settings.data().billing?.paypalEmail || '');
        setBankAccountHolder(settings.data().billing?.bankDetails?.accountHolderName || '');
        setBankIban(settings.data().billing?.bankDetails?.iban || '');
        setBankBic(settings.data().billing?.bankDetails?.bic || '');
          setFirstName(settings.data().billing?.firstName || '');
        setLastName(settings.data().billing?.lastName || '');
        setAddress(settings.data().billing?.address || '');
        setPostalCode(settings.data().billing?.postalCode || '');
        setCity(settings.data().billing?.city || '');
        setCountry(settings.data().billing?.country || '');
      }
    };
    fetchUserSettings();
  }, []);

  const handleLanguageChange = (event: any) => {
    const language = event.target.value;
    i18n.changeLanguage(language);
  };

  const handleSaveSettings = async () => {
    const updatedSettings: Partial<UserSettings> = {
      billing: {
        companyName,
        billingAddress,
        vatNumber,
        paymentMethod,
        creditCard: {
          cardNumber: creditCardNumber,
          expiryDate: creditCardExpiry,
          cvv: creditCardCvv,
        },
        paypalEmail,
        bankDetails: {
          accountHolderName: bankAccountHolder,
          iban: bankIban,
          bic: bankBic,
        },
          firstName,
        lastName,
        address,
        postalCode,
        city,
        country,
      },
    };
    await firestoreService.updateUserSettings(updatedSettings);
    toast.success(t('settings.settingsSaved') as string, {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer
        position="top-right"
        autoClose={6000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Typography variant="h5" sx={{ mb: 3 }}>
        {t('settings.title')}
      </Typography>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            {t('settings.userPreferences')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mt: 2 }}>
            <FormControl sx={{ minWidth: 200, mb: 3 }}>
              <InputLabel id="language-select-label">
                {t('settings.chooseLanguage')}
              </InputLabel>
              <Select
                labelId="language-select-label"
                value={i18n.language}
                label={t('settings.chooseLanguage')}
                onChange={handleLanguageChange}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            {t('settings.personalInformation')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mt: 2 }}>
            <TextField
              label={t('settings.firstName')}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label={t('settings.lastName')}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label={t('settings.address')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label={t('settings.postalCode')}
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label={t('settings.city')}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              margin="normal"
            />
             <TextField
              label={t('settings.country')}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">
            {t('settings.billingInformation')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mt: 2 }}>
            <TextField
              label={t('settings.companyName')}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label={t('settings.billingAddress')}
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label={t('settings.vatNumber')}
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="payment-method-label">
                {t('settings.paymentMethod')}
              </InputLabel>
              <Select
                labelId="payment-method-label"
                value={paymentMethod}
                label={t('settings.paymentMethod')}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              >
                <MenuItem value="creditCard">{t('settings.creditCard')}</MenuItem>
                <MenuItem value="paypal">{t('settings.paypal')}</MenuItem>
                <MenuItem value="bankTransfer">{t('settings.bankTransfer')}</MenuItem>
              </Select>
            </FormControl>

            {paymentMethod === 'creditCard' && (
              <>
                <TextField
                  label={t('settings.creditCardNumber')}
                  value={creditCardNumber}
                  onChange={(e) => setCreditCardNumber(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label={t('settings.creditCardExpiry')}
                  value={creditCardExpiry}
                  onChange={(e) => setCreditCardExpiry(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label={t('settings.creditCardCvv')}
                  value={creditCardCvv}
                  onChange={(e) => setCreditCardCvv(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </>
            )}

            {paymentMethod === 'paypal' && (
              <TextField
                label={t('settings.paypalEmail')}
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                fullWidth
                margin="normal"
              />
            )}

            {paymentMethod === 'bankTransfer' && (
              <>
                <TextField
                  label={t('settings.bankAccountHolder')}
                  value={bankAccountHolder}
                  onChange={(e) => setBankAccountHolder(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label={t('settings.bankIban')}
                  value={bankIban}
                  onChange={(e) => setBankIban(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label={t('settings.bankBic')}
                  value={bankBic}
                  onChange={(e) => setBankBic(e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Button variant="contained" color="primary" onClick={handleSaveSettings} sx={{ mt: 3 }}>
        {t('settings.saveSettings')}
      </Button>
    </Box>
  );
};
