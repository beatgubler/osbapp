import { useRef, useState, useEffect } from "react";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Grid from '@mui/material/Grid';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

import './Finance.css';

const Finance = () => {
  const nameRef = useRef();
  const amountRef = useRef();

  const [open, setOpen] = useState(false);

  const [interval, setInterval] = useState(12);
  const [type, setType] = useState('income');
  const [isLocalDataPresent, setIsLocalDataPresent] = useState(false);

  const [formIsValid, setFormIsValid] = useState(false);

  const [income, setIncome] = useState( [ 
    {type: 'income', name: "Job DUMMY", amount: 4000, interval: 12, yearlyAmount: 48000}, 
    {type: 'income', name: "Side job DUMMY", amount: 100, interval: 12, yearlyAmount: 1200}, 
    {type: 'income', name: "Dividends DUMMY", amount: 1000, interval: 1, yearlyAmount: 1000}, 
  ] );
  
  const [expense, setExpense] = useState( [ 
    {type: 'expense', name: "Rent DUMMY", amount: 1500, interval: 12, yearlyAmount: 18000}, 
    {type: 'expense', name: "Mobilephone DUMMY", amount: 100, interval: 12, yearlyAmount: 1200}, 
    {type: 'expense', name: "Car insurance DUMMY", amount: 600, interval: 1, yearlyAmount: 600}, 
    {type: 'expense', name: "Health insurance DUMMY", amount: 400, interval: 12, yearlyAmount: 4800}
  ] );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseYes = () => {
    setOpen(false);
    setIsLocalDataPresent(false);
    localStorage.clear();
  };

  const handleCloseNo = () => {
    setOpen(false);
  };

  const submit = () => {
    if (type === "income") {
      setIncome(arr =>  [...arr, {type: type, interval: Number(interval), name: nameRef.current.value, amount: Number(amountRef.current.value), yearlyAmount: Number(amountRef.current.value*interval)}])
    }
    if (type === "expense") {
      setExpense(arr => [...arr, {type: type, interval: Number(interval), name: nameRef.current.value, amount: Number(amountRef.current.value), yearlyAmount: Number(amountRef.current.value*interval)}])
    }
    nameRef.current.value = ""
    amountRef.current.value = ""
    formValidation();
  };

  const save = () => {
    setIsLocalDataPresent(true);
    localStorage.setItem('income', JSON.stringify(income));
    localStorage.setItem('expense', JSON.stringify(expense));
  }

  const load = () => {
    if (JSON.parse(localStorage.getItem('income')) && JSON.parse(localStorage.getItem('expense'))) {
      setIncome(JSON.parse(localStorage.getItem('income')))
      setExpense(JSON.parse(localStorage.getItem('expense')))
      setIsLocalDataPresent(true);
    }
  }

  const clear = () => {
    handleOpen();
  }

  const removeIncome = (event) => {
    const array = [...income]
    array.splice(event.target.id, 1)
    setIncome(array);
  }

  const removeExpense = (event) => {
    const array = [...expense]
    array.splice(event.target.id, 1)
    setExpense(array);
  }

  const getYearlyIncome = () => {
    return income.reduce((prev, curr) => prev + curr.yearlyAmount, 0)
  }

  const getYearlyExpense = () => {
    return expense.reduce((prev, curr) => prev + curr.yearlyAmount, 0)
  }

  const getYearlyResult = () => {
    return getYearlyIncome() - getYearlyExpense()
  }

  const getIsPositive = () => {
    if ((getYearlyIncome() - getYearlyExpense()) > 0) {
      return true
    } else {
      return false
    }
  }
  
  const handleChangeType = (event) => {
    setType(event.target.value);
  };

  const handleChangeInterval = (event) => {
    setInterval(event.target.value);
  };

  const intervalMapper = (interval) => {
    switch(interval){
      case 12:
        return "Every month";
      case 6:
        return "Every two months";
      case 4:
        return "Every three months";
      case 1:
        return "Once a year";
      default:
        return "no mapping"
    }
  }

  const formValidation = () => {
    if (nameRef.current.value.length > 2 && amountRef.current.value > 0) {
      setFormIsValid(true)
    } else {
      setFormIsValid(false)
    }
  }

  useEffect(() => {
    load();
  }, [])

  return (
    <Grid container spacing={2}>

      <Dialog
        open={open}
        onClose={handleCloseNo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Clear browser cache"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the local browser cache?
            All saved data will be erased.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseYes}>Yes</Button>
          <Button onClick={handleCloseNo} autoFocus>No</Button>
        </DialogActions>
      </Dialog>

      <Grid item xs={8}>
        
        <h3>Income</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={income}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="yearlyAmount" barSize={30} fill="green"/>
          </BarChart>
        </ResponsiveContainer>

        <Table>
          <TableHead>
            <TableRow style={{backgroundColor:'lightgray'}}>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Amount</TableCell>
              <TableCell align='right'>Yearly Amount</TableCell>
              <TableCell>Interval</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {income.map((item, index) => (
              <TableRow key={index} >
                <TableCell>{item.name}</TableCell>
                <TableCell align='right'>{item.amount.toLocaleString('de-ch', {minimumFractionDigits: 2})}</TableCell>
                <TableCell align='right'>{item.yearlyAmount.toLocaleString('de-ch', {minimumFractionDigits: 2})}</TableCell>
                <TableCell>{intervalMapper(item.interval)}</TableCell>
                <TableCell>
                  <Button id={index} variant="contained" onClick={removeIncome}>
                    <DeleteForeverIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <h3>Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expense}>
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="yearlyAmount" barSize={30} fill="red"/>
          </BarChart>
        </ResponsiveContainer>

        <Table>
          <TableHead>
            <TableRow style={{backgroundColor:'lightgray'}}>
              <TableCell>Name</TableCell>
              <TableCell align='right'>Amount</TableCell>
              <TableCell align='right'>Yearly Amount</TableCell>
              <TableCell>Interval</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expense.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell align='right'>{item.amount.toLocaleString('de-ch', {minimumFractionDigits: 2})}</TableCell>
                <TableCell align='right'>{item.yearlyAmount.toLocaleString('de-ch', {minimumFractionDigits: 2})}</TableCell>
                <TableCell>{intervalMapper(item.interval)}</TableCell>
                <TableCell>
                  <Button id={index} variant="contained" onClick={removeExpense}>
                    <DeleteForeverIcon />
                  </Button>
                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </Grid>
    
      <Grid item xs={4}>
        <h3>Results</h3>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            Yearly Income:
          </Grid>
          <Grid align='right' item xs={8}>
            <b>{getYearlyIncome().toLocaleString('de-ch', {minimumFractionDigits: 2})}</b>
          </Grid>
          <Grid item xs={4}>
            Yearly Expenses:
          </Grid>
          <Grid align='right' item xs={8}>
           <b>{getYearlyExpense().toLocaleString('de-ch', {minimumFractionDigits: 2})}</b>
          </Grid>
          <Grid item xs={4}>
            +/-:
          </Grid>
          <Grid align='right' item xs={8} className={getIsPositive() ? 'green' : 'red'}>
            <b>{getYearlyResult().toLocaleString('de-ch', {minimumFractionDigits: 2})}</b>
          </Grid>
        </Grid>

        <h3>New Income/Expense</h3>
        <form name="form">
          <FormControl fullWidth margin="normal">
            <InputLabel id="type-label">Type</InputLabel>
            <Select variant="outlined" labelId="type-label" label="Type" value={type} onChange={handleChangeType}>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">Interval</InputLabel>
            <Select variant="outlined" labelId="demo-simple-select-label" id="demo-simple-select-helper" label="Interval" value={interval} onChange={handleChangeInterval}>
              <MenuItem value={12}>Every month</MenuItem>
              <MenuItem value={6}>Every two months</MenuItem>
              <MenuItem value={4}>Every three months</MenuItem>
              <MenuItem value={1}>Once a year</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <TextField id="outlined-basic" label="Name" variant="outlined" inputRef={nameRef} onChange={formValidation} defaultValue="" margin="normal" required/>
          </FormControl>
          <FormControl fullWidth>
            <TextField id="outlined-basic" type="number" label="Amount" variant="outlined" inputRef={amountRef} onChange={formValidation} defaultValue="" margin="normal" required/>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Button variant="contained" onClick={submit} disabled={!formIsValid}>
              <AddCircleIcon /> Add Income / Expanse
            </Button>
          </FormControl>
        </form>
        
        <FormControl fullWidth margin="normal">
          <Button onClick={save}>
            <SaveIcon /> Save to Browser Cache
          </Button>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Button onClick={load} disabled={!isLocalDataPresent}>
            <DriveFolderUploadIcon /> Load Browser Cache
          </Button>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <Button onClick={clear} disabled={!isLocalDataPresent}>
            <DeleteForeverIcon /> Clear Browser Cache
          </Button>
        </FormControl>

      </Grid>
    </Grid>
  );
};

export default Finance;