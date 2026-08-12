import { Drawer } from "antd";
import React from "react";
import { getStatus } from "./common";

function DrawerComponent({ item, title, open, onClose }) {
  return (
    <div>
      <Drawer title={title} open={open} onClose={onClose}>
        {Object.entries(item).map(([key, value]) => {
          return (
            <div key={key} className="p-2">
              <p className="text-[14px] font-semibold text-gray-600 capitalize mb-1">
                {key}
              </p>
              <p className="text-[14px] text-gray-600">
                {key === "status" ? getStatus(value) : value}
              </p>
            </div>
          );
        })}
      </Drawer>
    </div>
  );
}

export default DrawerComponent;
