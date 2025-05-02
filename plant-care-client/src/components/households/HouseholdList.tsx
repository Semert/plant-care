// src/components/households/HouseholdList.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { RootState } from "../../store";
import { householdsActions } from "../../store/slices/householdsSlice";

const HouseholdList: React.FC = () => {
  const dispatch = useDispatch();
  const {
    items: households,
    loading,
    error,
  } = useSelector((state: RootState) => state.households);

  useEffect(() => {
    dispatch(householdsActions.fetchHouseholdsRequest());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this household?")) {
      dispatch(householdsActions.deleteHouseholdRequest(id));
    }
  };

  if (loading) return <Typography>Loading households...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Households</Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/households/new"
        >
          Add Household
        </Button>
      </Box>

      {households.length === 0 ? (
        <Typography>No households found. Create one to get started!</Typography>
      ) : (
        <List>
          {households.map((household) => (
            <ListItem
              key={household.id}
              component={RouterLink}
              to={`/households/${household.id}`}
              divider
            >
              <ListItemText
                primary={household.name}
                secondary={`Location: ${household.location.name}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  component={RouterLink}
                  to={`/households/edit/${household.id}`}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete(household.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default HouseholdList;
