const valueIsBinary = (value) => {
    if (value === "0" || value === "1") {
        return true;
    }
    if (value === "true" || value === "false") {
        return true;
    }
    return missingValue(value);
};

const valueIsNumeric = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

const missingValue = (value) => {
    return (value === "" || value === null || value === undefined) 
};

const preProccessValue = (value) => {
    return value.toString().toLowerCase().replaceAll("[\\n\\r\\t]+", "").trim()
}

export const getPredictableColumns = (array, headerKeys) => {
    // return array of all header keys that are binary values (0 or 1) or (true or false)

    const binaryColumns = [];
    for (let i = 0; i < headerKeys.length; i++) {
        let column = headerKeys[i];
        let isBinary = true;
        for (let j = 0; j < array.length; j++) {
            let value = array[j][column];
            if (value === undefined) {
                continue
            }
            value = preProccessValue(value);
            if (column === "DQFlag ") {
                console.log("DQ", value);
            }
            if (!valueIsBinary(value)) {
                console.log("not binary", column, value, typeof value);
                isBinary = false;
                break;
            }
        }
        if (isBinary) {
            binaryColumns.push(column);
        }
    }
  return binaryColumns;
};


export const getValidInputColumns = (array, headerKeys) => {
    // return array of all header keys that are valid input columns numeric or binary value

    const numericColumns = [];

    for (let i = 0; i < headerKeys.length; i++) {
        let isNumeric = true;
        let column = headerKeys[i];

        for (let j = 0; j < array.length; j++) {
            let value = array[j][column];
            if (value === undefined) {
                continue
            }
            value = preProccessValue(value);
            if (!valueIsNumeric(value) && !valueIsBinary(value)) {
                isNumeric = false;
                break;
            }
        }

        if (isNumeric) {
            numericColumns.push(headerKeys[i]);
        }
    }
  return numericColumns;
}

