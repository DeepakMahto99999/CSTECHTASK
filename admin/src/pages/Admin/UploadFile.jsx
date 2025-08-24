import React, { useContext, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const UploadFile = () => {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [previewData, setPreviewData] = useState([]); // stores valid rows
  const [error, setError] = useState(""); // stores validation error messages

  const fileRef = useRef(null); // ✅ using ref instead of querySelector

  // Required columns
  const requiredColumns = ["FirstName", "Phone", "Notes"];

  // Handle file select & preview with validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (worksheet.length === 0) {
        setError("❌ File is empty!");
        setPreviewData([]);
        return;
      }

      // Check if all required columns exist
      const fileColumns = Object.keys(worksheet[0]);
      const missingCols = requiredColumns.filter(
        (col) => !fileColumns.includes(col)
      );

      if (missingCols.length > 0) {
        setError(
          `❌ Invalid format. Missing columns: ${missingCols.join(", ")}`
        );
        setPreviewData([]);
        return;
      }

      // Validate each row (Phone must be number, others text)
      for (let i = 0; i < worksheet.length; i++) {
        const row = worksheet[i];
        if (typeof row.FirstName !== "string") {
          setError(`❌ Row ${i + 1}: FirstName must be text`);
          setPreviewData([]);
          return;
        }
        if (isNaN(Number(row.Phone))) { // ✅ allows string or number, but must be numeric
          setError(`❌ Row ${i + 1}: Phone must be numeric`);
          setPreviewData([]);
          return;
        }
        if (typeof row.Notes !== "string") {
          setError(`❌ Row ${i + 1}: Notes must be text`);
          setPreviewData([]);
          return;
        }
      }

      // ✅ If validation passed
      setError("");
      setPreviewData(worksheet);
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileRef.current || !fileRef.current.files[0]) {
      toast.error("Please select a file before submitting");
      return;
    }

    // create FormData object
    const formData = new FormData();
    formData.append("file", fileRef.current.files[0]);

    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/upload-list",
        formData,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        console.log("Distributed Data:", data.distributedData);
        setPreviewData([]);
        fileRef.current.value = null; // ✅ reset file input
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Upload CSV/XLSX File</h2>

      {/* File input */}
      <input
        type="file"
        accept=".csv, .xlsx, .xls"
        ref={fileRef} // ✅ using ref
        onChange={handleFileChange}
        className="mb-4"
      />

      {/* Error message */}
      {error && (
        <div className="text-red-600 font-semibold mb-3">{error}</div>
      )}

      {/* Preview */}
      {previewData.length > 0 && (
        <div className="border rounded-md p-3 mb-4 max-h-64 overflow-auto">
          <table className="w-full border">
            <thead>
              <tr>
                {Object.keys(previewData[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 bg-gray-100">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, i) => (
                <tr key={i}>
                  {Object.keys(previewData[0]).map((key) => (
                    <td key={key} className="border px-2 py-1">
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
        disabled={previewData.length === 0}
      >
        Submit
      </button>
    </div>
  );
};

export default UploadFile;
