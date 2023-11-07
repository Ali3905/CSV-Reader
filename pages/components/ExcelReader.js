import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/firebase";
import PopUp from "./PopUp";

function ExcelReader() {
  const [data, setData] = useState([]);
  const [popup, setPopup] = useState(false)
  const [student, setStudent] = useState(null)

  const getData = async () => {
    const q = query(
      collection(firestore, "students"),
      where("name", "!=", null)
    );
    const snapshot = await getDocs(q);
    const tempDoc = [];
    snapshot.forEach((doc) => {
      tempDoc.push({ id: doc.id, ...doc.data() });
    });
    setData(tempDoc);
  };

  const handleFileChange = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const file = e.target.result;
      const workbook = XLSX.read(file, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      addData(sheetData);
    };

    reader.readAsArrayBuffer(file);
    getData();
  };

  const addData = async (data) => {
    const ref = collection(firestore, "students");
    data.forEach(async (currentItem) => {
      const doc = await addDoc(ref, {
        name: currentItem.Name || null,
        class: currentItem.Class || null,
        roll_no: currentItem["Roll No"] || null,
      });
    });
  };

  const closePopup = () => {
    setPopup(prev => !prev)
  }

  const updateData = async (element) => {
    // closePopup()
    setPopup(true)
    setStudent(element)
  };

  const deleteData= async (element) => {
    
    const ref = doc(firestore, "students", element.id)
    const deletedDoc = deleteDoc(ref).then((doc)=>{
      getData()
      alert("Deleted")
    })

  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center py-16 bg-gray-400">
      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => handleFileChange(e.target.files[0])}
      />
      {popup && <PopUp element={student} closePopup={closePopup} getData={getData} />}
      {data.length>0 && (
        <table className="mt-16">
          <thead>
            <tr>
              <th className="px-5 py-5 text-left border border-gray-800">Name</th>
              <th className="px-5 py-5 text-left border border-gray-800">Class</th>
              <th className="px-5 py-5 text-left border border-gray-800">Roll No</th>
              <th className="px-5 py-5 text-left border border-gray-800">Edit</th>
              <th className="px-5 py-5 text-left border border-gray-800">Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((ele, index) => (
              <tr key={index}>
                <td className="px-5 py-5 text-left border border-gray-800" >{ele.name}</td>
                <td className="px-5 py-5 text-left border border-gray-800" >{ele.class}</td>
                <td className="px-5 py-5 text-left border border-gray-800" >{ele.roll_no}</td>
                <td onClick={() => updateData(ele)} className="px-5 py-5 text-left border border-gray-800" >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                    onClick={()=>updateData(ele)}
                    
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </td>
                <td className="px-5 py-5 text-left border border-gray-800" >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                    onClick={()=>deleteData(ele)}

                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ExcelReader;
