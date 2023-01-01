import React from "react";
import { BACKEND_ENDPOINT } from '../constant';

function DeployInstructions({modelInfo}) {

    const generateAppScriptUrl = () => {
        const baseUrl = "https://sheets-ai-ysdnuplvtq-uc.a.run.app/train/predict?modelId=822b3f57a53c761fd003851e547238521c77ea22c50515e9ce0614d355ebea8a";
        let url = baseUrl;
        for (let i = 0; i < modelInfo.inputs.length; i++) {
            let paramName = modelInfo.inputs[i];
            url += `&${paramName}=\${${paramName}}`
        }
        return url;
    }

    const appScriptUrl = generateAppScriptUrl();
    const appScriptText = `function AI_PREDICT(${modelInfo.inputs.join(",")}) {
        let response = UrlFetchApp.fetch(\`${appScriptUrl}\`, {"method": "GET"})
        return JSON.parse(response.getContentText()).prediction}`
    const copyAppScriptToClipboard = () => {
        navigator.clipboard.writeText(appScriptText);
    }
    return (
        <div className="p-8">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Model Trained</h1>
                <p>Accuraccy: {modelInfo.accuracy * 100}%</p>
                <p>Model ID: {modelInfo.modelId}</p>
            </div>
            <div className="flex flex-row w-full">
            <div className="mt-4 w-3/6 mr-10">
                <p className="text-center font-bold p-2">Use on google sheets</p>
                <div className="items-left ml-8">
                    <p className="text-left">Copy the following code App Scritps</p>
                    <code className= "bg-slate-100 break-words">
                        {appScriptText}
                    </code>
                </div>
                <div className="flex-1 justify-center items-center flex flex-row mt-2">
                <button onClick={copyAppScriptToClipboard} className="bg-blue-800 text-blue-50 rounded-lg mt-2 w-full p-2 w-64">Copy to clipboard</button>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-center w-36 font-bold p-2">Test it out</p>
                <form action={`${BACKEND_ENDPOINT}/train/predict/`} method="GET" target="_blank" className="flex-col flex flex-1 w-36 items-center ml-8">
                    <input type="hidden" name="modelId" value={modelInfo.modelId}/>
                    {modelInfo.inputs.map((input, index) => (
                        <div>
                        <label htmlFor={input} className="block text-sm font-medium text-gray-900 mt-2">
                            {input}
                        </label>
                        <input className="bg-slate-200 border-0 rounded-lg " key={index} name={input} type="text"/>
                        </div>
                    ))}
                    <input className="bg-blue-800 text-blue-50 rounded-lg mt-4 w-full p-2" type="submit" value="Predict"/>
                </form>
            </div>
            </div>
        </div>
    );
}

export default DeployInstructions;