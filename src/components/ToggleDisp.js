import React from "react";

const ToggleDisp = ({
  children,
  isSelecting = false,
  icon,
  iconColor = "black",
  iconStyle = {},
}) => {
  const isIconNumber = icon && /^[0-9]/.test(icon);

  if (isSelecting) {
    return (
      <label
        style={{
          display: "block",
          fontSize: "1.2em",
          textAlign: "justify",
          position: "relative",
          paddingLeft: 25,
        }}
      >
        {children}
        <input
          style={{
            position: "absolute",
            top: 5,
            left: 0,
            width: 20,
            height: 20,
          }}
          type="checkbox"
          defaultChecked
        />
      </label>
    );
  }

  return (
    <p
      style={{
        position: "relative",
        paddingLeft: icon ? 25 : 0,
      }}
    >
      {children}
      {icon && (
        <b
          className="unselectable"
          style={{
            position: "absolute",
            left: 0,
            top: isIconNumber ? 3 : 0,
            fontSize: isIconNumber ? "1em" : "1.2em",
            fontWeight: isIconNumber ? "normal" : "bolder",
            color: iconColor,
            ...iconStyle,
          }}
        >
          {isIconNumber ? icon + "." : icon}
        </b>
      )}
    </p>
  );
};

export default ToggleDisp;
