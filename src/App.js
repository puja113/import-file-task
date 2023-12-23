import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const ImportProducts = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [fieldsToDisplay, setFieldsToDisplay] = useState([]);

  const columns = fieldsToDisplay.map((field) => ({
    dataField: field,
    text: field.charAt(0).toUpperCase() + field.slice(1), // Capitalize first letter
  }));

  const error = file && file.type !== 'application/json' ? (
    <div className="alert alert-danger">Invalid file format. Please select a JSON file.</div>
  ) : null;

  const handleFileChange = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const jsonData = JSON.parse(e.target.result);
      setData(jsonData);
      setAvailableFields(Object.keys(jsonData[0]));
    };
    fileReader.readAsText(event.target.files[0]);
    setFile(event.target.files[0]);
  };

  const handleMoveRight = () => {
    const selectedOptions = Array.from(document.getElementById('availableFields').selectedOptions);
    const newAvailableFields = availableFields.filter(
      (field) => !selectedOptions.some((option) => option.value === field)
    );
    const newFieldsToDisplay = [...fieldsToDisplay, ...selectedOptions.map((option) => option.value)];
    setAvailableFields(newAvailableFields);
    setFieldsToDisplay(newFieldsToDisplay);
  };

  const handleMoveLeft = () => {
    const selectedOptions = Array.from(document.getElementById('fieldsToDisplay').selectedOptions);
    const newFieldsToDisplay = fieldsToDisplay.filter(
      (field) => !selectedOptions.some((option) => option.value === field)
    );
    const newAvailableFields = [...availableFields, ...selectedOptions.map((option) => option.value)];
    setAvailableFields(newAvailableFields);
    setFieldsToDisplay(newFieldsToDisplay);
  };

  const sortDataByPopularity = (data) =>
    data.sort((a, b) => b.popularity - a.popularity);

  return (
    <div className="container import-products">
      {error}
      <h1>Import Products</h1>
      <div className="file-upload">
        <label htmlFor="file-input">
          Select File
          <input
            type="file"
            id="file-input"
            accept=".json"
            onChange={handleFileChange}
          />
        </label>
        {file && <span>{file.name}</span>}
      </div>
      <div className="display-handling">
        <label htmlFor="availableFields">Available Fields</label>
        <select id="availableFields" multiple>
          {availableFields.map((field) => (
            <option key={field}>{field}</option>
          ))}
        </select>
        <button onClick={handleMoveRight}>&gt;&gt;</button>
        <button onClick={handleMoveLeft}>&lt;&lt;</button>
        <label htmlFor="fieldsToDisplay">Fields to be Displayed</label>
        <select id="fieldsToDisplay" multiple>
          {fieldsToDisplay.map((field) => (
            <option key={field}>{field}</option>
          ))}
        </select>
      </div>

      

      {data.length > 0 && (
        <BootstrapTable
          keyField="id"
          data={sortDataByPopularity(data)}
          columns={columns}
          striped
          bordered
          hover
          condensed
        />
      )}
    </div>
  );
};

export default ImportProducts;
