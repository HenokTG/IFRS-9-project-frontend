// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableContainer(theme) {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          width: '100%',
          overflowX: 'auto',
          display: 'block',
          px: 2,
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            height: '6px',
            width: '3px'
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.grey['300']
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.grey['500'],
            borderRadius: 5
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.grey['600']
          }
        }
      }
    }
  };
}
