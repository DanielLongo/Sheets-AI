import React from "react";
import { BACKEND_ENDPOINT } from '../constant';

function DeployInstructions({modelInfo, requiredInputs}) {


    return (
        <div className="p-8">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Model Trained</h1>
                <p>Accuraccy: {modelInfo.accuracy * 100}%</p>
                <p>Model ID: {modelInfo.modelId}</p>
            </div>
            <div className="flex flex-1 flex-row">
            <div className="mt-4">
                <p className="text-center w-36 font-bold">Test it out</p>
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
                    <input className="bg-blue-800 text-blue-50 rounded-lg mt-2 w-full p-2" type="submit" value="Predict"/>
                </form>
            </div>
            <div className="mt-4">
                <p className="text-center w-36 font-bold">Use on google sheets</p>
                <div className="flex flex-col flex-1 w-36 items-center ml-8">
                    <p className="text-center">Copy the following code App Scritps</p>
                    <code>
                    function myFunction
                    </code>
                </div>
            </div>
            </div>
        </div>
    );
}

export default DeployInstructions;