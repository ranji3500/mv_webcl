import { useState, useEffect, useRef } from "react";
import {
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import {
  CommodityCard,
  PageHeadingLabel,
  PhotoUploaderPreviewer,
} from "../../../components";
import SubPageStyles from "/src/styles/SubPages.module.css";
import {
  Add,
  ChevronLeft,
  ChevronRight,
  FileUploadOutlined,
} from "@mui/icons-material";
import OrderSummary from "../../../components/OrderSummary";
import {
  Commodity,
  SelectedCommodity,
} from "../../../interface/createOrder.interface";
import { useLoader } from "../../../contexts/LoaderContext";
import { useNavigate } from "react-router-dom";
import {
  DocumentCategory,
  LocalStorageKeys,
  OrderStage,
  SnackbarSeverity,
} from "../../../enums/common.enums";
import {
  DocumentModel,
  LocalStorageOrderDetails,
} from "../../../interface/common.interface";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import axios from "axios";
import { UploadDocumentPayloadModel } from "../../../interface/requestPayload.interface";

const Commodities: React.FC = () => {
  const steps = ["Order Details", "Commodities", "Billing"];
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const orderDetails: LocalStorageOrderDetails = JSON.parse(
    localStorage.getItem(LocalStorageKeys.ORDER_DETAILS) || "null"
  );
  const { showLoader, hideLoader } = useLoader();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedCommodity[]>([]);
  const [commodityImages, setCommodityImages] = useState<DocumentModel[]>([]);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCommodities = async () => {
      showLoader();
      try {
        const response = await axios.get(
          `${API_BASE_URL}/commodities/commodityList`
        );
        const data: Commodity[] = response.data;
        setCommodities(data);
      } catch (error) {
        console.error("Failed to fetch commodities:", error);
      } finally {
        hideLoader();
      }
    };

    fetchCommodities();
  }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (
        orderDetails?.orderId &&
        orderDetails?.orderStage != OrderStage.COMMODITY
      ) {
        try {
          showLoader();
          const response = await axios.get(
            `${API_BASE_URL}/orders/order-detailsbystage`,
            {
              params: {
                order_id: orderDetails.orderId,
                stage: OrderStage.COMMODITY,
              },
            }
          );

          const commodities: SelectedCommodity[] =
            response.data?.commodities?.map((commodity: Commodity) => ({
              id: commodity.commodityId,
              itemName: commodity.itemName,
              qty: commodity.quantity,
              price: commodity.price,
            }));
          setSelectedItems(commodities);

          if (response.data?.documents?.length) {
            setCommodityImages(response.data.documents);
          }
        } catch (error) {
          console.error("Error fetching order stage details:", error);
          showSnackbar(
            "Failed to fetch saved order details.",
            SnackbarSeverity.ERROR
          );
        } finally {
          hideLoader();
        }
      } else {
        setSelectedItems([{ id: null, qty: 1, price: 0, itemName: null }]);
        const documents = await getDocuments();
        if (documents?.length) {
          setCommodityImages(documents);
        }
      }
    };

    fetchOrderDetails();
  }, [orderDetails?.orderId]);

  const getDocuments = async (): Promise<DocumentModel[]> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/getdocumentsbyorderandcategory`,
        {
          params: {
            orderId: orderDetails?.orderId,
            category: DocumentCategory.COMMODITIES,
          },
        }
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching documents by order and category:", error);
      return [];
    }
  };

  const handleOpenCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      // Create camera container
      const container = document.createElement("div");
      container.id = "camera-container";
      Object.assign(container.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9999",
      });

      // Video element
      const video = document.createElement("video");
      Object.assign(video.style, {
        width: "90%",
        maxWidth: "500px",
        borderRadius: "10px",
      });
      video.autoplay = true;
      video.playsInline = true;
      video.srcObject = stream;

      // Capture button
      const takePhotoBtn = document.createElement("button");
      takePhotoBtn.textContent = "Take Photo";
      Object.assign(takePhotoBtn.style, {
        marginTop: "20px",
        padding: "10px 20px",
        fontSize: "18px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      });

      // Append elements to DOM
      container.appendChild(video);
      container.appendChild(takePhotoBtn);
      document.body.appendChild(container);

      // Start video stream
      video.onloadedmetadata = () => {
        video.play();
      };

      // Button click handler
      takePhotoBtn.onclick = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(async (blob) => {
            if (!blob) return;

            const file = new File([blob], `camera_image_${Date.now()}.png`, {
              type: "image/png",
            });

            const formData = buildUploadFilesPayload({
              order_id: orderDetails.orderId,
              doc_category: DocumentCategory.COMMODITIES,
              files: [file],
            });

            try {
              const res = await axios.post(
                `${API_BASE_URL}/orders/insertdocuments`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

              console.log(" res.status :" ,  res)

              const uploaded = res.data;
              if (uploaded) {
                showSnackbar("Photos uploaded successfully!", SnackbarSeverity.SUCCESS);

              } else {
                showSnackbar("Photos uploaded successfully!", SnackbarSeverity.SUCCESS);

              }

              console.log(uploaded);

              const newImage: DocumentModel = {
                documentId: uploaded[0].documentId, 
                documentName: uploaded[0].documentName,
                tempId: undefined,
                tempRequestPath: undefined,
                documentCategory: uploaded[0].documentCategory,
              };

              setCommodityImages((prev) => [...prev, newImage]);
            } catch (err) {
              console.error("Upload failed", err);
              alert("Upload failed");
            } finally {
              // Cleanup camera stream and DOM
              stream.getTracks().forEach((track) => track.stop());
              container.remove();
            }
          }, "image/png");
        }
      };


    } catch (err) {
      console.error("Camera error:", err);
      alert(" Unable to access camera. Please check browser permissions.");
    }
  };






  const addNewCommodity = () => {
    setSelectedItems([
      ...selectedItems,
      { id: null, qty: 1, price: 0, itemName: null },
    ]);
  };

  const updateCommodity = (
    index: number,
    field: keyof SelectedCommodity,
    value: SelectedCommodity[keyof SelectedCommodity]
  ) => {
    const updatedItems = [...selectedItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    if (field === "id") {
      const selectedCommodity = commodities.find(
        (c) => c.commodityId === value
      );
      updatedItems[index].price = selectedCommodity?.price || 0;
      updatedItems[index].itemName = selectedCommodity?.itemName || "";
    }

    setSelectedItems(updatedItems);
  };

  const removeCommodity = (index: number) => {
    setSelectedItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  function navigateToOrderDetails() {
    navigate("/order/details"); // Navigate to Order details page
  }

  const buildCommodityDetailsPayload = () => {
    return {
      order_id: orderDetails.orderId,
      items: selectedItems
        .filter((item) => item.id !== null)
        .map((item) => ({
          commodity_id: item.id!,
          quantity: item.qty,
          price: item.price,
        })),
    };
  };

  async function handleContinue() {
    if (
      orderDetails.orderId &&
      orderDetails?.orderStage != OrderStage.COMMODITY
    ) {
      navigate("/order/bill");
      return;
    }

    showLoader();
    try {
      const payload = buildCommodityDetailsPayload();

      const response = await axios.post(
        `${API_BASE_URL}/orders/insert-order-items`,
        payload
      );
      const orderId = response.data?.orderId;
      const orderStage: OrderStage = response.data?.orderStage;

      if (orderId && orderStage) {
        navigate(`/order/bill`);
        localStorage.setItem(
          LocalStorageKeys.ORDER_DETAILS,
          JSON.stringify({
            orderId,
            orderStage,
          })
        );
      } else {
        showSnackbar(
          "Error saving commodity details. Please try again.",
          SnackbarSeverity.ERROR
        );
      }
    } catch (error) {
      showSnackbar(
        "Something went wrong. Please try again later.",
        SnackbarSeverity.ERROR
      );
      console.error("Error saving commodity details:", error);
    } finally {
      hideLoader();
    }
  }

  const openBottomSheet = () => setBottomSheetOpen(true);
  const closeBottomSheet = () => setBottomSheetOpen(false);

  // function createTempDocumentModel(file: File): DocumentModel {
  //   return {
  //     tempId: crypto.randomUUID(),
  //     documentId: null,
  //     documentName: file.name,
  //     tempRequestPath: URL.createObjectURL(file),
  //     documentCategory: DocumentCategory.COMMODITIES,
  //   };
  // }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (!orderDetails?.orderId || imageFiles.length === 0) return;

    // Step 1: Show temporary previews
    // const previewDocs: DocumentModel[] = imageFiles.map(
    //   createTempDocumentModel
    // );

    // Add previews to state
    // setCommodityImages((prev) => [...prev, ...previewDocs]);

    showLoader();
    try {
      // Step 2: Build FormData and upload
      const formData = buildUploadFilesPayload({
        order_id: orderDetails.orderId,
        doc_category: DocumentCategory.COMMODITIES,
        files: imageFiles,
      });

      const response = await axios.post(
        `${API_BASE_URL}/orders/insertdocuments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Step 3: On success, replace previews with actual documents
      if (response.data) {
        const uploadedDocs: DocumentModel[] = response.data;

        setCommodityImages((prev) =>
          // Remove all the preview images without ID
          prev.filter((img) => img.documentId).concat(uploadedDocs)
        );

        showSnackbar("Photos uploaded successfully!", SnackbarSeverity.SUCCESS);
      } else {
        showSnackbar(
          "Upload completed but no document info received.",
          SnackbarSeverity.WARNING
        );
      }
    } catch (error) {
      setCommodityImages([]);
      console.error("File upload failed:", error);
      showSnackbar("Failed to upload photos.", SnackbarSeverity.ERROR);
    } finally {
      hideLoader();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function buildUploadFilesPayload(
    payload: UploadDocumentPayloadModel
  ): FormData {
    const formData = new FormData();
    formData.append("orderId", payload.order_id.toString());
    formData.append("doctype", payload.doc_category);

    Array.from(payload.files).forEach((file) => {
      formData.append("paths", file, file.name);
    });

    return formData;
  }
  return (
    <div className={`${SubPageStyles.container}`}>
      <PageHeadingLabel
        heading="Choose commodities"
        highlightedWords={["Choose"]}
        subHeading={`ID: ${orderDetails?.orderId}`}
      />

      {/* Stepper */}
      <Stepper activeStep={1}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div>
        <ul className={`list-unstyled`}>
          {selectedItems.map((item, index) => (
            <CommodityCard
              key={index}
              item={item}
              index={index}
              commodities={commodities}
              updateCommodity={updateCommodity}
              removeCommodity={removeCommodity}
            />
          ))}
        </ul>
        <div className={`d-flex justify-content-end`}>
          <Button onClick={addNewCommodity} size="large" startIcon={<Add />}>
            Add New
          </Button>
        </div>
      </div>

      <div>
        <h6 className="fs18 codGray950">Add photos (1-5)</h6>
        <PhotoUploaderPreviewer
          images={commodityImages}
          setImages={setCommodityImages}
        />
        <Button
          variant="outlined"
          component="span"
          startIcon={<FileUploadOutlined />}
          onClick={openBottomSheet}
          disabled={commodityImages.length >= 5}
          fullWidth
          sx={{ marginTop: "8px" }}
        >
          Upload
        </Button>
      </div>

      {<OrderSummary items={selectedItems} />}

      {/* Navigation Buttons */}
      <div className={SubPageStyles.stepperButtonBox}>
        <Button
          className={SubPageStyles.stepperBtn}
          onClick={navigateToOrderDetails}
          variant="contained"
          size="large"
          startIcon={<ChevronLeft />}
        >
          Go back
        </Button>

        <Button
          className={SubPageStyles.stepperBtn}
          onClick={handleContinue}
          variant="contained"
          size="large"
          endIcon={<ChevronRight />}
        >
          Billing Detials
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        hidden
        onChange={handleFileChange}
      />

      <Drawer anchor="bottom" open={bottomSheetOpen} onClose={closeBottomSheet}>
        <List>
          <ListItemButton
            onClick={() => {
              closeBottomSheet();
            }}
          >
            <ListItemText
              primary="Browse from device"
              sx={{ textAlign: 'center' }}
              onClick={() => {
                closeBottomSheet();
                fileInputRef.current?.click();
              }}
            />
            <ListItemText
              primary="Picture from Camera"
              sx={{ textAlign: 'center' }}
              onClick={() => {
                closeBottomSheet();
                handleOpenCamera();
              }}
            />
          </ListItemButton>
        </List>
      </Drawer>
    </div>
  );
};

export default Commodities;
