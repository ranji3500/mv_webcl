// src/pages/Bills.tsx

import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  IconButton,
  Button,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import styles from "/src/styles/MainPages.module.css";
import { OrderPreviewListItemText } from "../components";
import axios from "axios";

// 👇 Import the worker locally (Vite-compatible)
import { useNavigate } from "react-router-dom";
import workerUrl from "pdfjs-dist/build/pdf.worker?url";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Bills = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    handleFetchOrders();
  }, []);
  const verifyToken = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/verify_token`);
        console.log(res)
        if(res.message!=="Token is valid"){
          navigate('/login')
        }
      }catch{
  
      } }
      useEffect(() => {
   verifyToken();
      })
  const handleFetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/billing/billing_overview`);

      setOrders(response.data);
    } catch (e) {
      console.log("Error:", e);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      tabValue === 0 ||
      (tabValue === 1 && order.paymentStatus === "Pending") ||
      (tabValue === 2 && order.paymentStatus === "Paid");

    const matchesSearch =
      order.senderName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.dropName.toLowerCase().includes(searchText.toLowerCase()) ||
      order.id.toString().includes(searchText);

    return matchesStatus && matchesSearch;
  });

  const openPdfPreview = (billfile: string) => {
    const url = `${API_BASE_URL}/orders/getdocumentfile/${billfile}`;
    setPdfUrl(url);
    setOpen(true);
  };

  const downloadPdfFile = async (url: string, filename = "invoice.pdf") => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download PDF.");
    }
  };

  return (
    <div className={styles.container}>
      <Card>
        <CardHeader
          title="Bills"
          action={
            <TextField
              placeholder="Search bill"
              variant="outlined"
              size="small"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ width: "250px" }}
            />
          }
        />
        <CardContent>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            <Tab label="All" />
            <Tab label="Pending" />
            <Tab label="Settled" />
          </Tabs>

          <List>
            {filteredOrders.map((order) => (
              <ListItem
                key={order.orderId}
                divider
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => openPdfPreview(order.billFile)}
              >
                <OrderPreviewListItemText
                  primaryText={order.orderId.toString()}
                  secondaryText={`${order.senderName} - ${order.receiverName}`}
                  tertiaryText={"2025-01-13"}
                />
                <ListItemIcon
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                    alignItems: "flex-end",
                  }}
                >
                  <p className={styles.billAmount}>+AED 40</p>
                  <p className={styles.billBalance}>Balance: AED 10</p>
                </ListItemIcon>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* PDF Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogContent sx={{ position: "relative", p: 0, pt: 2 }}>

          {/* === Header === */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "2rem 1.5rem",
              borderBottom: "1px solid #e0e0e0",
              background: "#484848e6",
              fontWeight: 600,
              fontSize: "1.1rem",
              color: '#fff'

            }}
          >
            <span>Bill Preview</span>
            <IconButton onClick={() => setOpen(false)} aria-label="Close" style={{ color: '#fff', fontSize: '20px' }}>
              <CloseIcon />
            </IconButton>
          </div>

          {/* === PDF Viewer === */}
          <div style={{ height: "75vh", overflow: "auto", backgroundColor: "#fafafa" }}>
            {pdfUrl && (
              <Worker workerUrl={workerUrl}>
                <Viewer fileUrl={pdfUrl} />
              </Worker>
            )}
          </div>

          {/* === Footer === */}
          <div
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid #e0e0e0",
              background: "#f9f9f9",
              display: "flex",
              justifyContent: "flex-end",
              gap: '30px'
            }}
          >
            <Button
              style={{ color: '#fff', fontSize: '20px' }}
              variant="contained"
              onClick={() => downloadPdfFile(pdfUrl, "invoice.pdf")}
            >
              Download PDF
            </Button>

            <Button
              style={{ color: '#fff', fontSize: '20px' }}
              variant="contained"
              onClick={() => downloadPdfFile(pdfUrl, "invoice.pdf")}
            >
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Bills;
