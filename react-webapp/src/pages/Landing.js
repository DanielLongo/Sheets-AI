import React from "react";
import { useNavigate } from "react-router-dom";
function Landing() {
    const navigate = useNavigate();
  return (
    <div>
      <section>
          <div className="p-20 justify-center bg-slate-50 flex-1 flex h-screen">
            <div className="w-full rounded-md p-16 flex flex-col justify-center items-center h-4/6">
              <h1
                className="font-CerealXBd lg:text-5xl text-3xl mb-6 bg-gradient-to-r bg-clip-text text-transparent
                        from-emerald-500 via-indigo-500 to-emerald-500
                        animate-text"
              >
                SHEETS.AI
              </h1>
              <p className="font-CerealBK text-slate-500 mb-8 lg:text-center lg:text-lg text-md">
                Add AI to any Google Sheet
              </p>
              <button className="bg-blue-800 py-2 px-4 text-blue-50 rounded-lg mb-4" onClick={() => navigate("/home")}>
                Get Started
              </button>
            </div>
          </div>
        </section>
        <footer className="text-black w-full bg-slate-100 absolute bottom-0">
            <div className="md:mx-16 lg:mx-32 py-4">
                <div className="px-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm tracking-wider">
                    &copy; 2023 [Company Name]
                    </p>
                    <ul className="flex">
                    <li>
                        <a className="text-sm tracking-wider px-2" href="#">
                        About
                        </a>
                    </li>
                    <li>
                        <a className="text-sm tracking-wider px-2" href="#">
                        Careers
                        </a>
                    </li>
                    <li>
                        <a className="text-sm tracking-wider px-2" href="#">
                        Contact
                        </a>
                    </li>
                    </ul>
                </div>
                </div>
            </div>
        </footer>

    </div>
  );
}

export default Landing;