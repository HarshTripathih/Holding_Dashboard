import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Box,
  useTheme,
  makeStyles,
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginBottom: theme.spacing(4),
  },
  tableHeading: {
    fontWeight: 'bold',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  additionalDetails: {
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(1),
  },
}));

const HoldingsTable = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const response = await axios.get(
          'https://canopy-frontend-task.now.sh/api/holdings'
        );
        setHoldings(response.data.payload);
      } catch (error) {
        console.error('Error fetching holdings:', error);
      }
    };

    fetchHoldings();
  }, []);

  const Row = ({ holding }) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <TableRow className={classes.row}>
          <TableCell>
            <IconButton size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>
          <TableCell>{holding.name}</TableCell>
          <TableCell>{holding.ticker}</TableCell>
          <TableCell>{holding.asset_class}</TableCell>
          <TableCell>{holding.avg_price}</TableCell>
          <TableCell>{holding.market_price}</TableCell>
          <TableCell>{holding.latest_chg_pct}</TableCell>
          <TableCell>{holding.market_value_ccy}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1} className={classes.additionalDetails}>
                <Typography variant="h6" gutterBottom component="div">
                  Additional Details
                </Typography>
                <Table size="small" aria-label="additional-details">
                  <TableBody>
                    <TableRow>
                      <TableCell>Additional Detail 1:</TableCell>
                      <TableCell>{holding.additional_detail_1}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Additional Detail 2:</TableCell>
                      <TableCell>{holding.additional_detail_2}</TableCell>
                    </TableRow>
                    {/* Add more additional details here */}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  };

  const GroupedRows = ({ assetClass }) => {
    const holdingsByAssetClass = holdings.filter(
      (holding) => holding.asset_class === assetClass
    );

    return (
      <>
        <TableRow>
          <TableCell colSpan={8}>
            <Typography
              variant="h6"
              className={classes.tableHeading}
              style={{ color: theme.palette.primary.main }}
            >
              {assetClass}
            </Typography>
          </TableCell>
        </TableRow>
        {holdingsByAssetClass.map((holding) => (
          <Row key={holding.name} holding={holding} />
        ))}
      </>
    );
  };

  const groupedHoldings = [...new Set(holdings.map((holding) => holding.asset_class))];

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table aria-label="holdings-table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell className={classes.tableHeading}>Name</TableCell>
            <TableCell className={classes.tableHeading}>Ticker</TableCell>
            <TableCell className={classes.tableHeading}>Asset Class</TableCell>
            <TableCell className={classes.tableHeading}>Average Price</TableCell>
            <TableCell className={classes.tableHeading}>Market Price</TableCell>
            <TableCell className={classes.tableHeading}>Latest Change (%)</TableCell>
            <TableCell className={classes.tableHeading}>Market Value (Base CCY)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groupedHoldings.map((assetClass) => (
            <GroupedRows key={assetClass} assetClass={assetClass} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HoldingsTable;