import React from "react";
import {
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableContainer,
  TableHead,
  Paper,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
  Alert,
} from "@mui/material";
import moment from "moment";
import {
  sameRecordMsg,
  mendatoryMsg,
  Successrmsg,
  initalAddData,
  tableHeading,
  constNamesInPage,
} from "./constant";
import { useEffect, useState } from "react";
const AttendanceSystem = () => {
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [count, setCount] = useState(0);
  const [validationObj, setValidationObj] = useState({
    roll_number: false,
    student_name: false,
  });
  const [snackbarData, setSnackbarData] = useState({});
  const [dataToAdd, setDataToAdd] = useState(initalAddData);
  const [studentData, setStudentData] = useState([]);
  const handelAdd = () => {
    if (isValidField()) {
      const find = studentData.find(
        (ele) => ele.roll_number === dataToAdd.roll_number
      );
      if (find) {
        setSnackbarData(sameRecordMsg);
        setOpenSnackbar(true);
      } else {
        setStudentData([...studentData, dataToAdd]);
        setOpen(false);
        setDataToAdd(initalAddData);
        setSnackbarData(Successrmsg);
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarData(mendatoryMsg);
      setOpenSnackbar(true);
    }
  };
  const handelClose = () => {
    setOpen(false);
  };
  const handelChange = (e) => {
    setDataToAdd({ ...dataToAdd, [e.target.id]: e.target.value });
    if (e.target.id in validationObj) {
      const updatedValidatoinObj = {
        ...validationObj,
        [e.target.id]: false,
      };
      setValidationObj(updatedValidatoinObj);
    }
  };
  const isValidField = () => {
    const newValidObj = { ...validationObj };
    const validationArr = [];
    for (const key of Object.keys(validationObj)) {
      if (dataToAdd[key] === "" || dataToAdd[key] === null) {
        newValidObj[key] = true;
        validationArr.push(false);
      }
    }
    setValidationObj(newValidObj);
    if (validationArr.includes(false)) {
      return false;
    } else {
      return true;
    }
  };
  const handelCheckin = (rowData) => {
    const tempData = studentData.map((ele) => {
      if (ele.roll_number === rowData.roll_number) {
        return {
          ...ele,
          check_in_time: new Date(),
        };
      } else {
        return ele;
      }
    });
    setStudentData(tempData);
  };
  const handelCheckout = (rowData) => {
    const tempData = studentData.map((ele) => {
      if (ele.roll_number === rowData.roll_number) {
        return {
          ...ele,
          check_out_time: new Date(),
        };
      } else {
        return ele;
      }
    });
    setStudentData(tempData);
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  useEffect(() => {
    if (studentData.length) {
      setCount(
        studentData.filter(
          (ele) => ele.check_in_time !== null && ele.check_out_time === null
        ).length
      );
    }
  }, [studentData]);
  return (
    <div>
      <h3>{constNamesInPage.pageHeading}</h3>
      <Button variant="contained" onClick={() => setOpen(true)}>
        {constNamesInPage.addRecordButton}
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {tableHeading.map((name) => (
                <TableCell>{name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {studentData.map((row, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.roll_number}
                </TableCell>
                <TableCell>{row.student_name}</TableCell>
                <TableCell>
                  {row.check_in_time === null ? (
                    <Button onClick={() => handelCheckin(row)}>
                      {constNamesInPage.checkIn}
                    </Button>
                  ) : (
                    moment(row.check_in_time).format("L LT")
                  )}
                </TableCell>
                <TableCell>
                  {row.check_out_time === null ? (
                    <Button onClick={() => handelCheckout(row)}>
                      {constNamesInPage.checkOut}
                    </Button>
                  ) : (
                    moment(row.check_out_time).format("L LT")
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open}>
        <DialogTitle id="alert-dialog-title">
          {constNamesInPage.studentRecord}
        </DialogTitle>
        <DialogContent
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="roll_number"
            label="Role Number"
            variant="standard"
            type="number"
            onChange={handelChange}
            required
            error={validationObj.roll_number}
            helperText={validationObj.roll_number ? "Required" : ""}
          />
          <TextField
            id="student_name"
            label="Student Name"
            variant="standard"
            onChange={handelChange}
            required
            error={validationObj.student_name}
            helperText={validationObj.student_name ? "Required" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handelClose} variant="contained" color="error">
            {constNamesInPage.cancelButton}
          </Button>
          <Button onClick={handelAdd} variant="contained">
            {constNamesInPage.addButton}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarData.severity}
          sx={{ width: "100%" }}
        >
          {snackbarData.massage}
        </Alert>
      </Snackbar>
      {count ? (
        <h4>
          {count} {constNamesInPage.studentCountMsg}
        </h4>
      ) : (
        <h4>{constNamesInPage.noStudentMsg}</h4>
      )}
    </div>
  );
};
export default AttendanceSystem;
