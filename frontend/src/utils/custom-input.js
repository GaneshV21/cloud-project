import { Button, Checkbox, ConfigProvider, Input, Select } from "antd";
import { forwardRef } from "react";

// Height for every input box, dropdown and button in the app
const CONTROL_HEIGHT = 40;

export const CustomInput = forwardRef((props, ref) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            controlHeight: CONTROL_HEIGHT,
            colorBorder: "#D0D5DD",
            colorTextPlaceholder: "#667085",
            hoverBorderColor: "#5142D4",
            activeBorderColor: "#5142D4",
            activeShadow: "0 0 0 3px #5142D41A",
          },
        },
        token: {
          borderRadius: 8,
          colorPrimaryActive: "red",
          colorPrimaryHover: "green",
          colorText: "#565D6D",
          colorBorder: "#00000066",
          colorTextPlaceholder: "#d9d9d9",
        },
      }}
    >
      <Input ref={ref} {...props} onWheel={(e) => e.target.blur()} />
    </ConfigProvider>
  );
});

export const CustomTextArea = forwardRef((props, ref) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBorder: "#D0D5DD",
            colorTextPlaceholder: "#667085",
            hoverBorderColor: "#5142D4",
            activeBorderColor: "#5142D4",
            activeShadow: "0 0 0 3px #5142D41A",
          },
        },
        token: {
          borderRadius: 8,
          colorText: "#565D6D",
        },
      }}
    >
      <Input.TextArea ref={ref} {...props} />
    </ConfigProvider>
  );
});

export const CustomInputPassword = forwardRef((props, ref) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            controlHeight: CONTROL_HEIGHT,
            colorBorder: "#D0D5DD",
            colorTextPlaceholder: "#667085",
            hoverBorderColor: "#5142D4",
            activeBorderColor: "#5142D4",
            activeShadow: "0 0 0 3px #5142D41A",
          },
        },
        token: {
          borderRadius: 8,
          colorBorder: "#00000066",
          colorTextPlaceholder: "#d9d9d9",
          colorText: "#565D6D",
        },
      }}
    >
      <Input.Password ref={ref} {...props} />
    </ConfigProvider>
  );
});

export const CustomSelect = forwardRef((props, ref) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            controlHeight: CONTROL_HEIGHT,
            colorBorder: "#D0D5DD",
            colorTextPlaceholder: "#667085",
            hoverBorderColor: "#5142D4",
            activeBorderColor: "#5142D4",
            activeOutlineColor: "#5142D41A",
            optionSelectedBg: "#EEF0FF",
          },
        },
        token: {
          borderRadius: 8,
          colorPrimary: "#5142D4",
        },
      }}
    >
      <Select ref={ref} {...props} />
    </ConfigProvider>
  );
});

export const CustomCheckbox = (props) => {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#5142D4" } }}>
      <Checkbox {...props} />
    </ConfigProvider>
  );
};

export const CustomButton = ({
  label,
  onClick,
  icon,
  className = "",
  ...rest
}) => {
  return (
    <ConfigProvider
      wave={{ disabled: true }}
      theme={{
        components: {
          Button: {
            controlHeight: CONTROL_HEIGHT,
            colorPrimary: "#5142D4",
            colorPrimaryHover: "#5142D4",
            colorPrimaryActive: "#4338CA",
            colorBgContainerDisabled: "#98A2B3",
            colorTextDisabled: "white",
            contentFontSize: "16px",
            fontWeight: 600,
          },
        },
      }}
    >
      <Button
        type="primary"
        onClick={onClick}
        icon={icon}
        className={className}
        {...rest}
      >
        {label}
      </Button>
    </ConfigProvider>
  );
};

// Outlined button for secondary actions like Cancel / Close
export const CustomSecondaryButton = ({ label, onClick, icon, className = "", ...rest }) => {
  return (
    <ConfigProvider
      wave={{ disabled: true }}
      theme={{
        components: {
          Button: {
            controlHeight: CONTROL_HEIGHT,
            defaultBorderColor: "#D0D5DD",
            defaultColor: "#344054",
            defaultHoverBorderColor: "#5142D4",
            defaultHoverColor: "#5142D4",
            defaultActiveBorderColor: "#4338CA",
            defaultActiveColor: "#4338CA",
            contentFontSize: "16px",
            fontWeight: 600,
          },
        },
      }}
    >
      <Button onClick={onClick} icon={icon} className={className} {...rest}>
        {label}
      </Button>
    </ConfigProvider>
  );
};
