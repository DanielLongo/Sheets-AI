import React, {useState, useEffect} from "react";

function UploadFile({array, setArray, nextStep}) {
    const [file, setFile] = useState(null);
    const fileReader = new FileReader();
    
    useEffect(() => {
        if (array.length > 0) {
            nextStep();
        }
    }, [array]);

    const handleUpload = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                const text = event.target.result;
                csvFileToArray(text);
            };
            fileReader.readAsText(file);

        } else {
            alert("Please select a file");
        }
    };

    const csvFileToArray = (string) => {
        const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
        const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    
        const fileArray = csvRows.map(i => {
          const values = i.split(",");
          const obj = csvHeader.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
          }, {});
          return obj;
        });
        console.log(fileArray);
        setArray(fileArray);
      };

    const headerKeys = Object.keys(Object.assign({}, ...array));
        
    return (
        <div className="p-8">
             <h1 className="text-2xl font-semibold text-gray-900">Upload a .csv file</h1>
            <p className="text-gray-600">Please upload a .csv file with the data you would like to predict</p>
            <div className="mt-4">
                <input type="file" accept=".csv" onChange={(e) => {setFile(e.target.files[0])}}/>
                <button className="bg-blue-800 p-2 rounded-lg text-blue-50" onClick={(e) => handleUpload(e)}>Upload CSV</button>
            </div>
        </div>
    ) ;
}

export default UploadFile;