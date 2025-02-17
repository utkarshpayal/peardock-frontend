import * as React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TableSortLabel,
  TablePagination,
  Alert,
  Snackbar,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import PublicIcon from "@mui/icons-material/Public";
import { useEffect, useState } from "react";
import CopyModal from "./CopyModal";
import axios from "axios";
import PaymentFailedModal from "./PaymentFailedModal";
import { useLocation } from "react-router-dom";
function EnhancedTable({ rows }: { rows: any[] }) {
  const [connector, setConnector] = useState("");
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errorModal, setErrorModal] = useState(false);
  const [alreadybaught, setAlreadyBaught] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get("paymentId");

  //useEffect to check payment status and give the user the secret key
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        if (!paymentId) return;
        const response = await axios.get(
          `http://localhost:8282/status/${paymentId}`
        );
        if (response.data?.isPaid) {
          setConnector(response.data.key);
          setIsPaid(true);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };
    checkPaymentStatus();
  }, [paymentId]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Function to handle the deploy button click
  const handleClick = async (index: number): Promise<void> => {
    setIsLoading(rows[index].id);
    const gpuId = rows[index].id;
    try {
      const productData = {
        id: rows[index]._id,
        name: rows[index].host,
      };
      const priceData = {
        product: productData.id,
        unit_amount: Number(rows[index].price) * 100,
        currency: "inr",
      };

      const response = await fetch(
        "http://localhost:8282/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: index, productData, priceData, gpuId }),
        }
      );

      const data = await response.json();

      if (data.success) {
        window.location.href = data.checkoutUrl;
        
      } else if (data.error == "Product already exists.") {
        setAlreadyBaught(true);
      } else {
        setErrorModal(true);
      }
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsLoading(null);
    }
  };

  // Function to sort the rows
  const handleSort = (rows: any[]) => {
    if (orderBy) {
      return rows.sort((a, b) => {
        if (order === "asc") {
          return a[orderBy] < b[orderBy] ? -1 : 1;
        } else {
          return a[orderBy] > b[orderBy] ? -1 : 1;
        }
      });
    }
    return rows;
  };

  // Sort the rows
  const sortedRows = handleSort(rows);

  return (
    <Box sx={{ width: "100%" }} className="border border-gray-200 rounded-md ">
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table>
            <TableHead className="sticky top-0 bg-gray-200 z-[1]">
              <TableRow className="bg-gray-200">
                {[
                  { id: "host", label: "Host Machine" },
                  { id: "gpu", label: "GPU" },
                  { id: "vcpu", label: "vCPU" },
                  { id: "ram", label: "RAM (GB)" },
                  { id: "network", label: "Network (Mbps)" },
                  { id: "storage", label: "Storage (GB)" },
                  { id: "price", label: "Price" },
                  { id: "time", label: "time" },

                  { id: "action", label: "Action" },
                ].map((column) => (
                  <TableCell key={column.id}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.id} className="hover:bg-gray-100">
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PublicIcon sx={{ mr: 1 }} /> {row.host}
                      </Box>
                    </TableCell>
                    <TableCell>{row.gpuName}</TableCell>
                    <TableCell>{row.vcpu}</TableCell>
                    <TableCell>{row.ram}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          color="success.main"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <ArrowUpward fontSize="small" />{" "}
                          {row.network.split("/")[0]}
                        </Typography>
                        <Typography
                          color="error.main"
                          sx={{ display: "flex", alignItems: "center", ml: 1 }}
                        >
                          <ArrowDownward fontSize="small" />{" "}
                          {row.network.split("/")[1]}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{row.storage}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        className={`${
                          row.status === "success"
                            ? "!bg-green-500"
                            : "!bg-red-500"
                        } !text-sm !px-2 !pt-2`}
                        onClick={() => handleClick(index)}
                      >
                        {isLoading === row.id
                          ? "Deploying..."
                          : row.status === "success"
                          ? "Deployed"
                          : "Deploy"}
                      </Button>
                      <CopyModal
                        isOpen={isPaid}
                        onClose={() => setIsPaid(false)}
                        secretKey={connector}
                      />
                      <PaymentFailedModal
                        isOpen={errorModal}
                        onClose={() => setErrorModal(false)}
                      />
                      <Snackbar
                        open={alreadybaught}
                        autoHideDuration={6000}
                        onClose={() => {
                          setAlreadyBaught(false);
                        }}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                      >
                        <Alert
                          onClose={() => {
                            setAlreadyBaught(false);
                          }}
                          severity="success"
                          variant="filled"
                          sx={{ width: "100%" }}
                        >
                          Product already baught!
                        </Alert>
                      </Snackbar>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default EnhancedTable;
