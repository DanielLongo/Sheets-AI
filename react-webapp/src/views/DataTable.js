import React, {useState, useEffect} from "react";
import { getPredictableColumns, getValidInputColumns } from "../utils/validArrayColumns";
import { MutatingDots } from "react-loader-spinner";
import { BACKEND_ENDPOINT } from '../constant';

function DataTable({array, modelInfo, setModelInfo, nextStep}) {
    const [predictColumn, setPredictColumn] = useState(null);
    const [inputColumns, setInputColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [numEntriesToShow, setNumEntriesToShow] = useState(100);
    const headerKeys = Object.keys(Object.assign({}, ...array));
    const validPredictColumns = getPredictableColumns(array, headerKeys);
    const validInputColumns = getValidInputColumns(array, headerKeys);

    useEffect(() => {
        // if modelInfo is set, go to next step
        if (modelInfo) {
            nextStep();
        }
    }, [modelInfo]);

    useEffect(() => {
        if (validInputColumns.length <= 1) {
            // less than or equal to 1 since at least on column must be the predict column and have at least 1 input column
            alert("ERROR: no valid input columns found")
        }
        if (inputColumns.length === 0) {
            console.log("setting input columns");
            // automatically set input columns to all valid input columns
            setInputColumns(validInputColumns);
        }
    }, [validInputColumns]);

    useEffect(() => {
        if (validPredictColumns.length === 0) {
            alert("ERROR: no predictable columns found. predicatble columns must be binary (0 or 1)")
        }
        if (predictColumn === null) {
            setPredictColumn(validPredictColumns[0]);
        }
    }, [validPredictColumns]);

    const handleCheckboxChange = (e, inputColumn) => {
        if (e.target.checked) {
            setInputColumns([...inputColumns, inputColumn]);
        } else {
            setInputColumns(inputColumns.filter((column) => column !== inputColumn));
        }
    };

    const handleTrain =  async () => {
        setIsLoading(true);
        // create new array of data with only input columns and predict column
        let newArray = [];
        for (let i = 0; i < array.length; i++) {
            let row = {};
            for (let j = 0; j < inputColumns.length; j++) {
                row[inputColumns[j]] = array[i][inputColumns[j]];
            }
            row[predictColumn] = array[i][predictColumn];
            newArray.push(row);
        }

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dataArray: newArray,
                predictColumn: predictColumn,
                inputColumns: inputColumns
        })
        }
        let request = new Request(`${BACKEND_ENDPOINT}/train/`, requestOptions);
        let response = await fetch(request)
        setIsLoading(false);
        if (response.status === 200) {
            response = await response.json();
            setModelInfo(response);
        }
    };








    console.log("Predictable Columns: ", validPredictColumns);
    console.log("Valid Input Columns: ", validInputColumns);


    console.log(array);
    if (isLoading) {
        return (
            <div className="flex flex-1 flex-col p-8 mt-12 items-center">
                <MutatingDots 
                    height="100"
                    width="100"
                    color="#1e40af"
                    secondaryColor= '#065f46'
                    radius='12.5'
                    ariaLabel="mutating-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    />
                    <p>Training, this might take a minute...</p>
            </div>

        )
    }
    return (
        <div className="flex flex-1 flex-col p-8">
            <div className="flex-1 flex-col">
                <div>
                <h1 className="text-2xl font-semibold text-gray-900">Variable Selection</h1>
                    <div className="flex flex-col w-64">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-900 mt-2">
                    Select value to predict
                    </label>
                    <select
                        id="location"
                        name="location"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base blue:border-indigo-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        onChange={(e) => {setPredictColumn(e.target.value)}}
                        value={predictColumn}
                        defaultValue={"Select a column"}
                    >
                        {validPredictColumns.map((key, index) => {
                            return (
                                <option key={index} value={key}>{key}</option>
                            )
                        })}
                    </select>
                </div>
                </div>

                <div className="flex-row flex-1 mb-4 mt-4">
                <div className="flex flex-col w-64">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                    Data Color Codes
                    </label>
                    <div className="flex flex-row">
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center">
                                <div className="w-4 h-4 bg-green-300"></div>
                                <div className="ml-2">Predicted Value</div>
                            </div>
                            <div className="flex flex-row items-center">
                                <div className="w-4 h-4 bg-blue-300"></div>
                                <div className="ml-2">Input Value</div>
                            </div>
                            <div className="flex flex-row items-center">
                                <div className="w-4 h-4 bg-yellow-200 border-slate-200"></div>
                                <div className="ml-2">Ignore values (non numeric)</div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            
            </div>

            {(predictColumn !== null && inputColumns.length > 0) &&
            <div className="flex-1 flex justify-center items-center w-full">
                <button onClick={handleTrain} className="bg-blue-800 w-2/6 p-2 mb-4 rounded-lg text-blue-50">Train Model</button>
            </div>

            }




            <div className="flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                        <tr>
                            {headerKeys.map((key, index) => (
                                <th key={index} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    <label htmlFor="comments" className="font-medium text-gray-700 inline ">{key}</label>
                                    {(predictColumn !== key && validInputColumns.includes(key)) &&
                                    <input
                                    id={index}
                                    checked={inputColumns.includes(key)}
                                    onClick={(e) => {handleCheckboxChange(e, key)}}
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-800 focus:ring-blue-800 ml-2 mb-[.25px]"
                                />
                                    }
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {array.slice(0, numEntriesToShow).map((item) => (
                            
                            <tr key={item.id}>
                                {Object.values(item).map((value, index) => (
                                    <td className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500 ${headerKeys[index] === predictColumn ? "bg-green-100" : inputColumns.includes(headerKeys[index]) ? "bg-blue-50" : "bg-yellow-50"}`}>{value}</td>
                                ))}
                            </tr>

                        ))}
                        
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>

            <div className="flex-1 flex-row flex justify-center items-center mb-12">
                <button onClick={() => setNumEntriesToShow((numEntriesToShow) => numEntriesToShow + 100)} className="bg-blue-800 text-blue-50 p-2 w-2/6 rounded-lg mt-4">Show more</button>
            </div>

        </div>
    );
};

export default DataTable;