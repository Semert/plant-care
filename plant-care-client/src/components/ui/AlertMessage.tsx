import React, { useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { uiActions } from "../../store/slices/uiSlice";

const AlertMessage: React.FC = () => {
  const dispatch = useDispatch();
  const alerts = useSelector((state: RootState) => state.ui.alerts);

  useEffect(() => {
    if (alerts.length > 0) {
      // Auto-dismiss alert after 5 seconds
      const timer = setTimeout(() => {
        dispatch(uiActions.removeAlert(alerts[0].id));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [alerts, dispatch]);

  if (alerts.length === 0) return null;

  const { id, type, message } = alerts[0];

  const handleClose = () => {
    dispatch(uiActions.removeAlert(id));
  };

  return (
    <Snackbar
      open={true}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;
