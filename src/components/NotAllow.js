import React from "react";
import style from "./NotAllow.module.css";

const NotAllow = () => {
  return (
    <div className={style["background"]}>
      <div className={style["container"]}>
        <h1>!</h1>
        <p>請先登入e網通</p>
        <a href="https://tiponet.tipo.gov.tw/030_OUT_V1/home.do">OK</a>
      </div>
    </div>
  );
};

export default NotAllow;
