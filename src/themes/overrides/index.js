//

import Card from './Card';
import Paper from './Paper';
import Input from './Input';
import Button from './Button';
import Tooltip from './Tooltip';
import Backdrop from './Backdrop';
import Typography from './Typography';
import CssBaseline from './CssBaseline';
import Autocomplete from './Autocomplete';
import IconButton from './IconButton';
import TableBody from './TableBody';
import TableCell from './TableCell';
import TableHead from './TableHead';
import Lists from './Lists';

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
  return Object.assign(
    Card(theme),
    Input(theme),
    Paper(theme),
    Button(theme),
    Tooltip(theme),
    Backdrop(theme),
    Typography(theme),
    CssBaseline(theme),
    Autocomplete(theme),
    IconButton(theme),
    TableBody(theme),
    TableCell(theme),
    TableHead(theme),
    Lists(theme)
  );
}
