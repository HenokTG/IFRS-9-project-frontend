// ==============================|| OVERRIDES - DIALOG CONTENT TEXT ||============================== //

export default function DialogContent(theme) {
  return {
    MuiDialogContent: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          color: theme.palette.text.primary,
          border: 'none',
          overflow: 'auto',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            height: '4px',
            width: '4px'
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555'
          }
        }
      }
    }
  };
}
