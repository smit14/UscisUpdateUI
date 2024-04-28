import { FormEvent, useState } from 'react';
import './App.css';
import { Box, Container } from '@mui/system';
import { Alert, Button, CircularProgress, CssBaseline, Paper, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { getCaseStatus, statusUpdate as createStatusUpdate } from './backend';
import Toast from './Components/Toast';
import { ReceiptInputComponent } from './Components/ReceiptInput';

interface StatusDetails {
  receiptNumber: string;
  status: string;
  details: string;
}

const useStyles = makeStyles(() => ({
  wrappedText: {
    overflowWrap: 'anywhere', // Add overflowWrap property
  },
}));

function App() {

  const classes = useStyles();
  const [receiptNumber, setReceiptNumber] = useState('');
  const [isReceiptStatusLoading, setIsReceiptStatusLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusDetails, setStatusDetails] = useState<StatusDetails | undefined>(undefined);

  const [emailInput, setEmailInput] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  const [toastText, setToastText] = useState("");
  const [showToast, setShowToast] = useState(false);
  
  const handleReceiptInputSubmit = (receiptInput: string) => {
    setIsReceiptStatusLoading(true);
    setEmailSuccess(false);

    getCaseStatus(receiptInput).then(caseStatus => {
      setIsReceiptStatusLoading(false);
      setReceiptNumber(receiptInput);
      setStatusDetails({
        receiptNumber: receiptInput,
        status: caseStatus.status,
        details: caseStatus.details
      });
    }).catch(err => {
      setIsReceiptStatusLoading(false);
      setToastText("Something went wrong! try again.");
      setShowToast(true);
    })
  };

  const handleEmailSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!emailInput) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(emailInput)) {
      setEmailError('Please enter a valid email address')
    }
    setEmailError('');
    setIsEmailLoading(true);
    
    createStatusUpdate(receiptNumber, emailInput).then(response => {
      setIsEmailLoading(false);
      setEmailSuccess(true);
    });
  };

  const validateEmail = (email: string) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const EmailUpdateComponent = () => {
    if (!statusDetails) {
      return <></>;
    }
    if (emailSuccess) {
      return (
        <Alert severity="success">
          You will receive daily status update emails at 6:00 AM PST
        </Alert>
      )
    }
    return (
      <Paper
        elevation={3} // Optional: Adds a shadow effect
        style={{
          backgroundColor: '#F3F4F6',
          padding: '20px',
          borderRadius: '10px',
          width: '100%'
        }}
      >
        <Box component="form" onSubmit={handleEmailSubmit}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Typography component="h1" variant="body1" sx={{ paddingTop: '0px' }}>
              Enter your email to receive daily status updates
            </Typography>
            <Box display="flex" alignItems="center" 
              sx={{ paddingTop: '4px', width: {
                xs: '100%',
                sm: '80%'
              }}}
            >
              <TextField
                label="Email address"
                variant="outlined"
                size="small"
                id="email"
                style={{ marginRight: '8px' }}
                fullWidth 
                onChange={(e) => setEmailInput(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                value={emailInput}
              />
              <Button variant="contained" color="primary" type="submit" disabled={isEmailLoading} style={{
                textTransform: 'capitalize'
              }}>
                {isEmailLoading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    )
  }

  const StatusDetailsComponent = () => {
    if (!statusDetails) {
      return <></>;
    }
    return (
      <Paper
            elevation={3} // Optional: Adds a shadow effect
            style={{
              backgroundColor: '#F3F4F6',
              padding: '20px',
              borderRadius: '10px',
              width: '100%'
            }}
          >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Typography component="h1" variant="h5">
                  {`Receipt number: ${statusDetails.receiptNumber}`}
                </Typography>
                <Typography component="h1" variant="h6" sx={{ paddingTop: '16px' }}>
                  {statusDetails.status}
                </Typography>
                <Typography component="h1" variant="body1" className={classes.wrappedText}>
                  {statusDetails.details}
                </Typography>
              </Box>
          </Paper>
    )
  }
  
  return (
    <Container component="main" maxWidth="md">
        <CssBaseline />
        <Toast message={toastText} open={showToast} handleClose={() => setShowToast(false)} type="error" />
        <Box
          sx={{
            marginTop: !statusDetails ? 40 : 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px'
          }}
        > 
          <ReceiptInputComponent handleSubmit={handleReceiptInputSubmit} isLoading={isReceiptStatusLoading} />
          <StatusDetailsComponent />
          <EmailUpdateComponent />
          
          </Box>
      </Container>
  );
}

export default App;
