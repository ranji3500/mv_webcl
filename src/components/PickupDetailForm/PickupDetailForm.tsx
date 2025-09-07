import React, { useState, useEffect, SyntheticEvent } from "react";
import {
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ListItem,
  ListItemText,
  Autocomplete,
  Button,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import axios from "axios";
import styles from "./PickupDetailForm.module.css";
import { FormType } from "../../enums/createOrder.enums";
import { LocalStorageOrderDetails } from "../../interface/common.interface";
import { LocalStorageKeys } from "../../enums/common.enums";
import { SnackbarSeverity, } from "../../enums/common.enums";
import { useSnackbar } from "../../contexts/SnackbarContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type StoreData = {
  phoneNumber: string;
  storeName: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  createdAt: string;
  customerId: number;
  outstandingPrice: string;
  whatsappNumber: string;
};

const CITIES = [
  "Bur Dubai",
  "Deira",
  "Jumeirah",
  "Downtown Dubai",
  "Dubai Marina",
  "Business Bay",
  "Al Barsha",
  "Palm Jumeirah",
  "Al Quoz",
  "Mirdif",
  "Emirates Hills",
  "Arabian Ranches",
  "Jebel Ali",
  "Al Nahda",
  "International City",
];

interface PickupDropFormProps {
  formType: FormType;
  otherDetails: Partial<StoreData>;
  currentDetails: Partial<StoreData>;
  setCurrentDetails: (details: StoreData) => void;
}

const PickupDropForm: React.FC<PickupDropFormProps> = ({
  formType,
  otherDetails,
  currentDetails,
  setCurrentDetails,
}) => {
  const orderDetails: LocalStorageOrderDetails | null = JSON.parse(
    localStorage.getItem(LocalStorageKeys.ORDER_DETAILS) || "null"
  );

  const [searchResults, setSearchResults] = useState<StoreData[]>([]);
  const [selectedData, setSelectedData] = useState<Partial<StoreData>>({});
  const [hoveredData, setHoveredData] = useState<Partial<StoreData> | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isCustomerSelected, setIsCustomerSelected] = useState(false);

  const [formFields, setFormFields] = useState<Partial<StoreData>>({
    phoneNumber: "",
    storeName: "",
    email: "",
    whatsappNumber: "",
    // city: "",
    addressLine1: "",
    addressLine2: "",
    outstandingPrice: 10.10,
  });

  const { showSnackbar } = useSnackbar();


  const handleCreateCustomer = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/employee/create_customer`,
        formFields
      );
      const value = formFields
      value.customerId = response.message.customerId
      console.log(response)
      console.log(formFields)
      console.log(value)

      setPhoneError(null);
      setSelectedData(value);
      setFormFields(value);
      setIsCustomerSelected(true);
      setCurrentDetails(value);

      if (response?.message?.message === 'Customer inserted successfully.') {
        showSnackbar("customer Created  successfully!", SnackbarSeverity.SUCCESS);
        setIsCustomerSelected(true);
      } else {
        showSnackbar(response?.message.message, SnackbarSeverity.ERROR);
      }
    } catch (error) {
      console.error("Create customer error:", error);

      showSnackbar(error.response.data.error, SnackbarSeverity.ERROR);
    }
  };

  useEffect(() => {
    if (currentDetails?.phoneNumber) {
      setSelectedData(currentDetails);
      setFormFields(currentDetails);
      setIsCustomerSelected(true);
    }
  }, [currentDetails]);
  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setFormFields((prev) => ({ ...prev, phoneNumber: query }));
    setSelectedData({});
    setIsCustomerSelected(false);

    if (query.length === 8) {
      if (query === otherDetails?.phoneNumber) {
        setPhoneError("Pickup and drop details should not be the same.");
        setSearchResults([]);
        return;
      }

      setPhoneError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/customers/get_customer_by_phone`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: query }),
        });

        const result = await response.json();
        const customerData = result.data;

        setSearchResults(customerData || []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setPhoneError(null);
    }
  };

  const handleHover = (data: StoreData) => setHoveredData(data);
  const handleMouseLeave = () => setHoveredData(null);

  const handleSelect = (_: SyntheticEvent, value: StoreData | null) => {
    console.log(value)
    if (value) {
      if (value.phoneNumber === otherDetails?.phoneNumber) {
        setPhoneError("Pickup and drop details should not be the same.");
        return;
      }
      setPhoneError(null);
      setSelectedData(value);
      setFormFields(value);
      setIsCustomerSelected(true);
      setCurrentDetails(value);
    } else {
      setIsCustomerSelected(false);
    }
  };

  const handleFieldChange = (field: keyof StoreData, value: string) => {
    setFormFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const handleCreateCustomer = () => {
  //   console.log("Creating customer with:", formFields);
  //   setCurrentDetails(formFields as StoreData);
  // };

  const displayData = hoveredData || formFields;

  return (
    <div>
      <h6 className={styles.formHeading}>
        {formType === FormType.PICKUP ? "Pick-up" : "Drop-off"}
      </h6>

      <form>
        <div className={styles.formFieldsContainer}>
          <TextField
            fullWidth
            label={formType === FormType.PICKUP ? "Pickup Location Name" : "Drop Location Name"}
            placeholder="Enter store name"
            variant="outlined"
            value={displayData.storeName || ""}
            disabled={isCustomerSelected}
            onChange={(e) => handleFieldChange("storeName", e.target.value)}
          />

          <div style={{ display: "flex", gap: "10px", width: "100%" }}>
            <TextField
              label="Code"
              variant="outlined"
              value="05"
              disabled
              style={{ width: "20%" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
            />
            <div style={{ flex: 1 }}>
              <Autocomplete
                freeSolo
                value={formFields.phoneNumber || ""}
                options={searchResults}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.phoneNumber
                }
                onChange={handleSelect as (
                  event: SyntheticEvent<Element, Event>,
                  value: string | StoreData | null
                ) => void}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!phoneError}
                    helperText={phoneError}
                    label={
                      formType === FormType.PICKUP
                        ? "Pickup Phone Number"
                        : "Drop Phone Number"
                    }
                    variant="outlined"
                    placeholder="0000-0000"
                    onChange={handleSearch}
                    fullWidth
                  />
                )}
                renderOption={(props, option) => (
                  <ListItem
                    {...props}
                    key={option.phoneNumber}
                    onMouseEnter={() => handleHover(option)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <ListItemText primary={option.phoneNumber} />
                  </ListItem>
                )}
              />
            </div>
          </div>

          <TextField
            fullWidth
            label="Email"
            placeholder="Enter email"
            variant="outlined"
            value={displayData.email || ""}
            disabled={isCustomerSelected}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Address line 1 *"
            placeholder="Number, Building, Street"
            variant="outlined"
            value={displayData.addressLine1 || ""}
            disabled={isCustomerSelected}
            onChange={(e) => handleFieldChange("addressLine1", e.target.value)}
          />
          <TextField
            fullWidth
            label="Address line 2"
            placeholder="Area, Locality"
            variant="outlined"
            value={displayData.addressLine2 || ""}
            disabled={isCustomerSelected}
            onChange={(e) => handleFieldChange("addressLine2", e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel>City</InputLabel>
            <Select
              value={displayData.city || ""}
              disabled={isCustomerSelected}
              onChange={(e) => handleFieldChange("city", e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Choose a City
              </MenuItem>
              {CITIES.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {!isCustomerSelected && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: "16px" }}
              onClick={handleCreateCustomer}
            >
              Create Customer
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PickupDropForm;
