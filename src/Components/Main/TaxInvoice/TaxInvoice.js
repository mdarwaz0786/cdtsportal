import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Linking,
  FlatList,
} from "react-native";
import FileViewer from 'react-native-file-viewer';
import Icon from "react-native-vector-icons/Feather";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import requestStoragePermission from "./utils/requestStoragePermission.js";
import getUniqueFileName from "./utils/getUniqueFileName.js";
import { useAuth } from "../../../Context/auth.context.js";
import { API_BASE_URL } from "@env";
import axios from "axios";
import formatDate from "../../../Helper/formatDate.js";
import Toast from "react-native-toast-message";
import { useRefresh } from "../../../Context/refresh.context.js";
import { ActivityIndicator } from "react-native-paper";

const TaxInvoice = ({ navigation }) => {
  const { validToken } = useAuth();
  const { refreshKey, refreshPage } = useRefresh();
  const [invoice, setInvoice] = useState([]);
  const [downloading, setDownloading] = useState({});
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchInvoice = async (page, isRefreshing = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      };

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/invoice/all-invoice?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        const newInvoices = response?.data?.invoice || [];

        setInvoice((prev) => (isRefreshing ? newInvoices : [...prev, ...newInvoices]));
        setHasMore(newInvoices?.length === limit);
      };
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    };
  };

  useEffect(() => {
    if (validToken) {
      fetchInvoice(page, true);
    };
  }, [validToken, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    refreshPage();
    setPage(1);
    fetchInvoice(1, true);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchInvoice(nextPage);
    };
  };

  const openPDF = async (filePath) => {
    try {
      const fileExists = await RNFS.exists(filePath);

      if (!fileExists) {
        Alert.alert("Error", "Pdf not generated");
        return;
      };

      await FileViewer.open(filePath, { type: "application/pdf" });
    } catch (error) {
      Alert.alert(
        "No PDF Viewer Found",
        "Please install a PDF viewer to open this file.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Install", onPress: () => Linking.openURL("market://details?id=com.adobe.reader") },
        ]
      );
    };
  };

  const generatePDF = async (id) => {
    try {
      const hasPermission = await requestStoragePermission();

      if (!hasPermission) {
        Alert.alert("Permission Denied", "Cannot save file without storage permission");
        return;
      };

      if (isDownloading) {
        return;
      };

      setIsDownloading(true);
      setDownloading((prev) => ({ ...prev, [id]: true }));

      let invoiceData = {};

      const response = await axios.get(
        `${API_BASE_URL}/api/v1/invoice/single-invoice/${id}`,
        {
          headers: {
            Authorization: validToken,
          },
        },
      );

      if (response?.data?.success) {
        invoiceData = response?.data?.invoice;
      };

      const html = `
      <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tax Invoice</title>
    <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
    }

    .content {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .invoice-container {
      background-color: white;
    }

    .invoice-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
    }

    .logo img {
      width: 150px;
      margin-bottom: 10px;
    }

    .invoice-title h4 {
      font-size: 18px;
    }

    .invoice-details {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
    }

    .invoice-id {
      margin-bottom: 5px;
    }

    .billing-info div {
      margin-bottom: 5px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      margin-top: 20px;
    }

    .row div {
      margin-bottom: 5px;
    }

    .invoice-table {
      width: 100%;
      margin-top: 20px;
      border-collapse: collapse;
    }

    .invoice-table th,
    .invoice-table td {
      text-align: left;
    }

    .invoice-table th {
      padding: 10px 20px;
      background-color: #dcf0f0 !important;
      color: #000 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .invoice-table td {
      padding: 8px 20px;
    }

    .invoice-table th.text-end,
    .invoice-table td.text-end {
      text-align: right;
    }

    .notes {
      padding: 20px;
    }

    .notes div {
      padding-bottom: 5px;
    }
  </style>
</head>

<body>
  <div class="content">
    <div class="invoice-container">
      <div class="invoice-heading">
        <div class="logo">
          <img src="${invoiceData?.office?.logo}" alt="logo">
        </div>
        <div class="invoice-title">
          <h4>TAX INVOICE</h4>
        </div>
      </div>
      <div class="invoice-details">
        <div class="billing-info">
          <div><strong>${invoiceData?.office?.name || "Code diffusion Technology"}</strong></div>
          <div>Address:</div>
          <div>${invoiceData?.office?.addressLine1 || "120, Kirti Shikhar Tower"},</div>
          <div>${invoiceData?.office?.addressLine2 || "District Centre, Janakpuri"},</div>
          <div>${invoiceData?.office?.addressLine3 || "New Delhi"}.</div>
          <div><strong>GST No: ${invoiceData?.office?.GSTNumber || "O7FRWPS7288J3ZC"}</strong></div>
        </div>
        <div class="invoice-meta">
          <div class="invoice-id">Invoice ID: <strong>${invoiceData?.invoiceId}</strong></div>
          <div class="invoice-date">
            <strong>Date:</strong>
            <span>${formatDate(invoiceData?.date)}</span>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="billing-address">
          <div><strong>Bill To:</strong></div>
          <div>${invoiceData?.proformaInvoiceDetails?.companyName || invoiceData?.proformaInvoiceDetails?.clientName || invoiceData?.project?.customer?.companyName || invoiceData?.project?.customer?.name}</div>
          <div><strong>GST No: ${invoiceData?.proformaInvoiceDetails?.GSTNumber || invoiceData?.project?.customer?.GSTNumber}</strong></div>
        </div>
        <div class="shipping-address">
          <div><strong>Ship To:</strong></div>
          <div>${invoiceData?.proformaInvoiceDetails?.shipTo || invoiceData?.project?.customer?.address}</div>
        </div>
        <div class="balance-due">
          <p><strong>Balance Due: ₹${invoiceData?.total}</strong></p>
        </div>
      </div>
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th class="text-end">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${invoiceData?.proformaInvoiceDetails?.projectName || invoiceData?.project?.projectName}</td>
            <td>1</td>
            <td>₹${invoiceData?.subtotal}</td>
            <td class="text-end">₹${invoiceData?.subtotal}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
            <td class="text-end">₹${invoiceData?.subtotal}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>CGST (9%):</strong></td>
            <td class="text-end">₹${invoiceData?.CGST}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>SGST (9%):</strong></td>
            <td class="text-end">₹${invoiceData?.SGST}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>IGST (18%):</strong></td>
            <td class="text-end">₹${invoiceData?.IGST}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
            <td class="text-end">₹${invoiceData?.total}</td>
          </tr>
        </tfoot>
      </table>
      <div class="notes">
        <div><strong>Notes:</strong></div>
        <div><strong>Account Name: </strong>${invoiceData?.office?.accountName || "Code Diffusion Technologies"}</div>
        <div><strong>Account Type: </strong>${invoiceData?.office?.accountType || "Current Account"}</div>
        <div><strong>Account Number: </strong>${invoiceData?.office?.accountNumber || "60374584640"}</div>
        <div><strong>Bank Name: </strong>${invoiceData?.office?.bankName || "Bank of Maharashtra"}</div>
        <div><strong>IFSC Code: </strong>${invoiceData?.office?.IFSCCode || "mahb0001247"}</div>
      </div>
    </div>
  </div>
</body>

</html>`;

      const fileNameBase = `${invoiceData?.invoiceId}-tax-invoice`;
      const directory = RNFS.DownloadDirectoryPath;

      try {
        // Ensure Downloads folder exists
        if (!await RNFS.exists(directory)) {
          await RNFS.mkdir(directory);
        };

        // Generate the PDF
        const pdfOptions = {
          html: html,
          fileName: fileNameBase,
          directory: 'Download',
        };

        const pdf = await RNHTMLtoPDF.convert(pdfOptions);

        // Generate a unique file name
        const uniqueFileName = await getUniqueFileName(directory, fileNameBase, 'pdf');
        const newPath = `${directory}/${uniqueFileName}`;

        // Move the PDF to the Downloads directory
        await RNFS.moveFile(pdf.filePath, newPath);

        // Notify the media scanner about the new file
        await RNFetchBlob.fs.scanFile([{ path: newPath, mime: 'application/pdf' }]);
        Toast.show({ type: "success", text1: "Invoice Downloaded", text2: `Invoice saved at: ${newPath}` });

        setTimeout(() => {
          openPDF(newPath);
        }, 3000)
      } catch (error) {
        Alert.alert("Error", "Downloading Failed");
      } finally {
        setIsDownloading(false);
        setDownloading((prev) => ({ ...prev, [id]: false }));
      };
    } catch (error) {
      console.log("Error:", error.message);
      Alert.alert("Error", "Downloading Failed");
    };
  };

  const renderItem = ({ item }) => (
    <View style={styles.invoiceItem}>
      <Text style={styles.invoiceText}>Invoice ID: {item?.invoiceId}</Text>
      <Text style={styles.invoiceText}>Date: {formatDate(item?.date)}</Text>
      <Text style={styles.invoiceText}>Project: {item?.proformaInvoiceDetails?.projectName || item?.project?.projectName}</Text>
      <Text style={styles.invoiceText}>Client: {item?.proformaInvoiceDetails?.clientName || item?.project?.customer?.name}</Text>
      {
        downloading[item?._id] ? (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Downloading...</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => generatePDF(item?._id)}
            style={[styles.button, { opacity: isDownloading ? 0.8 : 1 }]}
            disabled={isDownloading}
          >
            <Icon name="download" size={18} color="#555" style={styles.icon} />
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity>
        )
      }
    </View>
  );

  return (
    <>
      <View style={styles.header}>
        <Icon name="arrow-left" size={20} color="#000" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Tax Invoice</Text>
      </View>

      <View style={styles.container}>
        {loading && invoice?.length === 0 ? (
          <ActivityIndicator size="small" color="#ffb300" />
        ) : (
          <FlatList
            data={invoice}
            keyExtractor={(item) => item?._id}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              loadingMore ? (
                <View style={{ marginVertical: 16, alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#ffb300" />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  container: {
    flex: 1,
  },
  invoiceItem: {
    backgroundColor: "#fff",
    margin: 10,
    marginBottom: 0,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 15,
  },
  invoiceText: {
    fontSize: 14,
    color: "#555",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#555",
    fontWeight: "400",
    fontSize: 14,
    marginLeft: 8,
  },
  icon: {
    marginRight: 5,
  },
});

export default TaxInvoice;