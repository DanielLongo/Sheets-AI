import React, {useState} from "react";
import UploadFile from "../views/UploadFile";
import DataTable from "../views/DataTable";
import Progress from '../components/Progress';
import DeployInstructions from "../views/DeployInstructions";

function Home() {
    const [array, setArray] = useState([]);
    const [step, setStep] = useState(0);
    const [modelInfo, setModelInfo] = useState(null);

    const nextStep = () => {
        setStep((step) => step + 1);
    };

  return (
    <div>
        <Progress stepIndex={step}/>
        {
            step === 0 ? (
                <UploadFile array={array} setArray={setArray} nextStep={nextStep}/>
            ) : 
            step === 1 ? (
                <DataTable array={array} nextStep={nextStep} setModelInfo={setModelInfo} modelInfo={modelInfo}/>
            ) :
            step === 2 ? (
                <DeployInstructions modelInfo={modelInfo}/>
            ) : null
        }
        

    </div>

  );

}

export default Home;