// ==============================|| OVERRIDES - TABLE CELL ||============================== //

export default function TableCell(theme) {
  const commonCell = {
    '&:not(:last-of-type)': {
      position: 'relative',
      '&:after': {
        position: 'absolute',
        content: '""',
        backgroundColor: theme.palette.divider,
        width: 1,
        height: '100%',
        right: 0,
        top: 0,
      },
    },
  };

  return {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: 12,
          borderColor: theme.palette.divider,
        },
        sizeSmall: {
          padding: 8,
        },
        head: {
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          ...commonCell,
        },
        footer: {
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          ...commonCell,
        },
      },
    },
  };
}
