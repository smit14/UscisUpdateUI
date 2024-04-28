import { Snackbar } from "@mui/material";
import React from "react";
import MuiAlert, { AlertProps } from '@mui/material/Alert';


export interface ToastProps {
    message: string; 
    open: boolean;
    handleClose: () => void;
    type: "success" | "error" | "info",
    autoHideDuration?: number;
}



export default function Toast ({message, open, handleClose, type, autoHideDuration}: ToastProps) {
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
      
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={autoHideDuration ?? 5000}
            open={open}
            onClose={handleClose}
        >
            <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}