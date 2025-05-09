// @ts-nocheck

import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

export default function RadioButtonsGroup({ data, defaultValue }) {
  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="radio-buttons-group-label"
        defaultValue={defaultValue}
        name="radio-buttons-group"
      >
        {data.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio sx={{ color: "white", "&.Mui-checked": { color: "#f87171" } }} />}
            label={<span className="text-white">{item.label}</span>}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
