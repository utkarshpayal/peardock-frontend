import { useEffect, useState } from "react";
import EnhancedTable from "../components/Table";
import SearchDropdown from "../components/Dropdown";
import RangeSlider from "../components/RangeSLider";
import settings from "../assets/settings.png";
import dollar from "../assets/dollar.png";
import {
  ArrowDropDown,
  ArrowForwardIos,
  ArrowBackIos,
} from "@mui/icons-material";
import RadioButtonsGroup from "../components/Radiogroup";
import globe from "../assets/globe.png";
import gpu from "../assets/gpu.png";
function Buy() {
  const [selectedCategory, setSelectedCategory] = useState("GPU");
  const [gpus, setGpus] = useState([]);
  const [showSpecs, setShowSpecs] = useState(false);
  const [showDollar, setShowDollar] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pricingOptions = [
    { value: "on-demand", label: "On Demand (0.44)" },
    { value: "1-month", label: "1 Month (200)" },
    { value: "1-year", label: "1 Year (2000)" },
  ];
  const data = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];

  useEffect(() => {
    const fetchGpus = async () => {
      try {
        const response = await fetch("http://localhost:8282/gpus");
        if (!response.ok) {
          throw new Error("Failed to fetch GPUs");
        }
        const data = await response.json();
        setGpus(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchGpus();
  }, []);
  
  return (
    <div className="flex w-full bg-gray-900 hide-scroll h-screen">
      <div
        className={`transition-all duration-300 bg-gray-900 overflow-hidden {
          isCollapsed ? "w-1/12 p-0 hide-scroll" : "w-1/4 p-4 hide-scroll"
        }`}
      >
        {!isCollapsed ? (
          <div className="flex flex-col gap-4 overflow-y-auto max-h-full hide-scroll">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="bg-gray-700  text-white p-1 rounded-full transition-all duration-300"
            >
              <ArrowBackIos fontSize="small" />
            </button>
            <SearchDropdown text={"Select GPU"} data={data} />
            <SearchDropdown text={"Select Region"} data={data} />

            <div
              onClick={() => setShowSpecs(!showSpecs)}
              className="flex flex-row gap-2 justify-between border-b border-gray-200 p-2 cursor-pointer"
            >
              <div className="flex flex-row gap-4">
                <img src={settings} className="w-6 h-6" />
                <h1 className="text-white font-semibold">Specs</h1>
              </div>
              <ArrowDropDown className="text-white" />
            </div>
            {!showSpecs && (
              <div className="flex flex-col pt-2 gap-4 px-4">
                <RangeSlider
                  label="GPU Num"
                  min={0}
                  max={100}
                  defaultValue={[20, 44]}
                />
                <RangeSlider
                  label="vCPU"
                  min={0}
                  max={100}
                  defaultValue={[20, 44]}
                />
                <RangeSlider
                  label="RAM"
                  min={0}
                  max={100}
                  defaultValue={[20, 44]}
                />
                <RangeSlider
                  label="Storage (GB)"
                  min={0}
                  max={100}
                  defaultValue={[20, 44]}
                />
              </div>
            )}

            <div
              onClick={() => setShowDollar(!showDollar)}
              className="flex flex-row gap-2 justify-between border-b border-gray-200 p-2 cursor-pointer"
            >
              <div className="flex flex-row gap-4">
                <img src={dollar} className="w-6 h-6" />
                <h1 className="text-white font-semibold">Pricing</h1>
              </div>
              <ArrowDropDown className="text-white" />
            </div>
            {!showDollar && (
              <div className="flex flex-col pt-2 gap-4">
                <RadioButtonsGroup
                  data={pricingOptions}
                  defaultValue="on-demand"
                />
                ;{" "}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center p-4 gap-4 overflow-y-auto hide-scroll">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="bg-gray-700  text-white p-1 rounded-full transition-all duration-300"
            >
              <ArrowForwardIos fontSize="small" />
            </button>
            <img src={gpu} className="w-10 h-10 border rounded-full p-2" />
            <img src={globe} className="w-10 h-10 border rounded-full p-2" />

            <img src={settings} className="w-10 h-10 border rounded-full p-2" />
            <img src={dollar} className="w-10 h-10 border rounded-full p-2" />
          </div>
        )}
      </div>

      <div
        className={`transition-all duration-300 p-4 h-full bg-white items-center justify-center text-gray-600 ${
          isCollapsed ? "w-full" : "w-4/5"
        }`}
      >
        <div className="flex gap-4 justify-center p-1 border rounded-3xl bg-white w-fit mx-auto mb-6  text-sm">
          <h1
            onClick={() => setSelectedCategory("GPU")}
            className={`
              font-bold px-4 py-2 cursor-pointer rounded-3xl transition-all duration-200
              ${
                selectedCategory === "GPU"
                  ? "border bg-blue-400 text-white shadow-sm"
                  : "hover:bg-gray-100"
              }
            `}
          >
            GPU
          </h1>
          <div className="group relative">
            <h1
              className={`
                font-bold px-4 py-2 cursor-not-allowed rounded-3xl transition-all duration-200 opacity-50
                ${
                  selectedCategory === "CPU"
                    ? "border shadow-sm bg-gray-200 text-gray-500"
                    : "hover:bg-gray-100"
                }
              `}
            >
              CPU
            </h1>
            <div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-full top-0 mt-2 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <div
                className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg 
                            whitespace-nowrap mb-2"
              >
                Coming Soon!
              </div>
              <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-1 
                            border-4 border-transparent border-t-gray-800"
              ></div>
            </div>
          </div>
        </div>

        <EnhancedTable rows={gpus} />
      </div>
    </div>
  );
}

export default Buy;
