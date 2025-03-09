const machinerySchemas = {
  Tractor: [
    {
      name: "horsepower",
      label: "Horse Power",
      type: "number",
      placeholder: "Enter horsepower",
    },
    {
      name: "is4x4",
      label: "4x4 Capability",
      type: "switch",
    },
    {
      name: "engineType",
      label: "Engine Type",
      type: "text",
      placeholder: "Enter engine type",
    },
    // Add more Tractor-specific fields here
  ],
  Combine: [
    {
      name: "capacity",
      label: "Capacity",
      type: "number",
      placeholder: "Enter capacity",
    },
    {
      name: "cuttingWidth",
      label: "Cutting Width",
      type: "number",
      placeholder: "Enter cutting width",
    },
    // Add more Combine-specific fields here
  ],
  Drone: [
    {
      name: "flightTime",
      label: "Flight Time (min)",
      type: "number",
      placeholder: "Enter flight time",
    },
    {
      name: "range",
      label: "Range (meters)",
      type: "number",
      placeholder: "Enter range",
    },
    // Add more Drone-specific fields here
  ],
};

export default machinerySchemas;