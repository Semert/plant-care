import React, { useEffect, useState } from "react";
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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  SelectChangeEvent,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Opacity as WaterIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { RootState } from "../../store";
import { plantsActions } from "../../store/slices/plantsSlice";
import { householdsActions } from "../../store/slices/householdsSlice";
import { uiActions } from "../../store/slices/uiSlice";
import { healthActions } from "../../store/slices/healthSlice";

const PlantList: React.FC = () => {
  const dispatch = useDispatch();
  const {
    items: plants,
    loading,
    error,
  } = useSelector((state: RootState) => state.plants);
  const { items: households } = useSelector(
    (state: RootState) => state.households
  );
  const { searchTerm, filters, pagination } = useSelector(
    (state: RootState) => state.ui
  );

  const [page, setPage] = useState(1);
  const [selectedHousehold, setSelectedHousehold] = useState<string>("");
  const itemsPerPage = pagination.itemsPerPage;

  useEffect(() => {
    dispatch(plantsActions.fetchPlantsRequest());
    dispatch(householdsActions.fetchHouseholdsRequest());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this plant?")) {
      dispatch(plantsActions.deletePlantRequest(id));
    }
  };

  const handleUpdateHealth = (id: string) => {
    dispatch(healthActions.updatePlantHealthRequest(id));
  };

  const handleHouseholdChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value as string;
    setSelectedHousehold(value);

    if (value) {
      dispatch(plantsActions.fetchPlantsByHouseholdRequest(value));
    } else {
      dispatch(plantsActions.fetchPlantsRequest());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(uiActions.setSearchTerm(e.target.value));
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  // Filter plants based on search term and other filters
  const filteredPlants = plants.filter((plant) => {
    // Filter by search term
    if (
      searchTerm &&
      !plant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !plant.type.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by plant type
    if (filters.plantType && plant.type !== filters.plantType) {
      return false;
    }

    return true;
  });

  // Paginate filtered plants
  const paginatedPlants = filteredPlants.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading && plants.length === 0)
    return <Typography>Loading plants...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Plants</Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/plants/new"
        >
          Add Plant
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search Plants"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />

        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="household-label">Filter by Household</InputLabel>
          <Select
            labelId="household-label"
            value={selectedHousehold}
            onChange={handleHouseholdChange}
            label="Filter by Household"
          >
            <MenuItem value="">
              <em>All Households</em>
            </MenuItem>
            {households.map((household) => (
              <MenuItem key={household.id} value={household.id}>
                {household.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredPlants.length === 0 ? (
        <Typography>
          No plants found. Add some plants to get started!
        </Typography>
      ) : (
        <>
          <List>
            {paginatedPlants.map((plant) => {
              const household = households.find(
                (h) => h.id === plant.householdId
              );

              return (
                <ListItem
                  key={plant.id}
                  component={RouterLink}
                  to={`/plants/${plant.id}`}
                  divider
                >
                  <ListItemText
                    primary={plant.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Type: {plant.type}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Location: {household?.name || "Unknown"}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUpdateHealth(plant.id);
                      }}
                      title="Update Health"
                    >
                      <WaterIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      component={RouterLink}
                      to={`/plants/edit/${plant.id}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(plant.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>

          {filteredPlants.length > itemsPerPage && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={Math.ceil(filteredPlants.length / itemsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PlantList;
