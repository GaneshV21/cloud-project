import { Button, Checkbox, ConfigProvider, Input } from "antd";
import { forwardRef } from "react";

export const CustomInput = forwardRef((props, ref) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBorder: "#D0D5DD",
            colorTextPlaceholder: "#667085",
            hoverBorderColor: "#667085",
            activeBorderColor: "#667085",
            activeShadow: "0 0 0 2px #EAFAFA99",
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

export const CustomInputPassword = forwardRef((props, ref) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            colorBorder: "#D0D5DD",
            colorTextPlaceholder: "#667085",
            hoverBorderColor: "#667085",
            activeBorderColor: "#667085",
            activeShadow: "0 0 0 2px #EAFAFA99",
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
