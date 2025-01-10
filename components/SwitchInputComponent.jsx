import { TextField } from '@mui/material'

export default function SwitchInputComponent({
    index,
    messages,
    maximumMessage,
    handleMessageChange,
}) {
    return (
        <>
            {messages[index].type === 'text' && (
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    style={{ marginTop: 16 }}
                    placeholder={`Enter your message (${
                        index + 1
                    }/${maximumMessage})`}
                    variant="outlined"
                    value={messages[index].text}
                    onChange={(e) =>
                        handleMessageChange(index, e.target.value, 'text')
                    }
                />
            )}
            {messages[index].type === 'image' && (
                <>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your previewImageUrl (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].previewImageUrl}
                        onChange={(e) =>
                            handleMessageChange(
                                index,
                                e.target.value,
                                'previewImageUrl'
                            )
                        }
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your originalContentUrl (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].originalContentUrl}
                        onChange={(e) =>
                            handleMessageChange(
                                index,
                                e.target.value,
                                'originalContentUrl'
                            )
                        }
                    />
                </>
            )}
            {messages[index].type === 'sticker' && (
                <>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your packageId (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].packageId}
                        onChange={(e) =>
                            handleMessageChange(
                                index,
                                e.target.value,
                                'packageId'
                            )
                        }
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your stickerId (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].stickerId}
                        onChange={(e) =>
                            handleMessageChange(
                                index,
                                e.target.value,
                                'stickerId'
                            )
                        }
                    />
                </>
            )}
            {messages[index].type === 'video' && (
                <>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your originalContentUrl (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].originalContentUrl}
                        onChange={(e) =>
                            handleMessageChange(
                                index,
                                e.target.value,
                                'originalContentUrl'
                            )
                        }
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your previewImageUrl (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].previewImageUrl}
                        onChange={(e) =>
                            handleMessageChange(
                                index,
                                e.target.value,
                                'previewImageUrl'
                            )
                        }
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your trackingId (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].trackingId}
                        onChange={(e) =>
                            handleMessageChange(
                                index,
                                e.target.value,
                                'trackingId'
                            )
                        }
                    />
                </>
            )}
            {messages[index].type === 'audio' && (
                <>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your originalContentUrl (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].originalContentUrl}
                        onChange={(e) =>
                            handleMessageChange(
                                index,
                                e.target.value,
                                'originalContentUrl'
                            )
                        }
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your duration (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].duration}
                        onChange={(e) =>
                            handleMessageChange(
                                index,
                                e.target.value,
                                'duration'
                            )
                        }
                    />
                </>
            )}
            {messages[index].type === 'location' && (
                <>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your title (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].title}
                        onChange={(e) =>
                            handleMessageChange(index, e.target.value, 'title')
                        }
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your address (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].address}
                        onChange={(e) =>
                            handleMessageChange(
                                index,
                                e.target.value,
                                'address'
                            )
                        }
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your latitude (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].latitude}
                        onChange={(e) =>
                            handleMessageChange(
                                index,
                                e.target.value,
                                'latitude'
                            )
                        }
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        style={{ marginTop: 16 }}
                        placeholder={`Enter your longitude (${
                            index + 1
                        }/${maximumMessage})`}
                        variant="outlined"
                        value={messages[index].longitude}
                        onChange={(e) =>
                            handleMessageChange(
                                index,
                                e.target.value,
                                'longitude'
                            )
                        }
                    />
                </>
            )}
            {messages[index].type === 'flex' && <></>}
            {messages[index].type === 'template' && <></>}
        </>
    )
}
