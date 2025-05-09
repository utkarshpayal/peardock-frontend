// @ts-nocheck

import React, { useState } from "react";
import { Box, Slider } from "@mui/material";

interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  defaultValue?: [number, number];
}

function RangeSlider({ label, min, max, defaultValue }: RangeSliderProps) {
  const [value, setValue] = useState(defaultValue || [min, max]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setValue(newValue);
    }
  };

  return (
    <Box className="w-full ">
      <h1 className="text-gray-200 text-xs">{label}</h1>

      {/* Slider Wrapper */}
      <div className="relative w-full">
        <Slider
          getAriaLabel={() => "Range"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          min={min}
          max={max}
          className="w-full"
          sx={{
            color: "#f87171", 
            "& .MuiSlider-thumb": {
              backgroundColor: "#f87171", 
            },
            "& .MuiSlider-rail": {
              backgroundColor: "#f1f5f9", 
            },
            "& .MuiSlider-track": {
              backgroundColor: "#f87171", 
            }
          }}
        />

        {/* Min and Max Labels Below Slider */}
        <div className="flex justify-between ">
          <span className="text-gray-200 text-xs">{min}</span>
          <span className="text-gray-200 text-xs">{max}</span>
        </div>
      </div>
    </Box>
  );
}

export default RangeSlider;
