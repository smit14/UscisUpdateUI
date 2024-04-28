import { Paper, Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { error } from "console";
import { FormEvent, useState } from "react";

export const ReceiptInputComponent = (props: {
    handleSubmit: (receiptInput: string) => void,
    isLoading: boolean
}) => {
    const [receiptInput, setReceiptInput] = useState('');
    const [error, setError] = useState('');
    
    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (!receiptInput) {
            setError('Receipt number cannot be empty');
            return;
          }
        setError('');
        props.handleSubmit(receiptInput);
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
        <Box component="form" onSubmit={onSubmit}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Typography component="h1" variant="h5">
              USCIS Case Status Update
            </Typography>
            <Typography component="h1" variant="body1" sx={{ paddingTop: '16px' }}>
              Enter your receipt number
            </Typography>
            <Box display="flex" alignItems="center" 
              sx={{ paddingTop: '4px', width: {
                xs: '100%',
                sm: '80%'
              }}}
              >
              <TextField
                label="Receipt number"
                variant="outlined"
                size="small"
                id="receipt"
                style={{ marginRight: '8px' }} 
                fullWidth
                onChange={(e) => setReceiptInput(e.target.value)}
                error={!!error}
                helperText={error}
                value={receiptInput}
              />
              <Button variant="contained" color="primary" type="submit" disabled={props.isLoading} style={{
                  whiteSpace: 'nowrap', // Prevent text from wrapping
                  overflow: 'hidden', // Hide overflowed text if any
                  textTransform: 'capitalize'
                }}>
                {props.isLoading ? <CircularProgress size={24} color="inherit" /> : "Check status"}
              </Button>
            </Box>

            
          </Box>
        </Box>
      </Paper>
    )
  }