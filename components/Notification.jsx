import { Alert, Snackbar } from '@mui/material'
import React from 'react'
export default function Notification({
    openNotification,
    setOpenNotification,
    message,
    statusMessage = 'success',
}) {
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenNotification({
            open: false,
            statusMessage: statusMessage,
            message: message,
        })
    }

    return (
        <Snackbar
            open={openNotification}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                onClose={handleCloseSnackbar}
                severity={statusMessage}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    )
}
