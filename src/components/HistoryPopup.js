import React, { useState, useCallback, useMemo } from "react";

const HistoryPopup = ({ handleClose }) => {
  const [numPerPage, setNumPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDateTS, setStartDateTS] = useState(0);
  const [endDateTS, setEndDateTS] = useState(0);

  const [historyFromLocalStorage] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("automatic-patent-examiner"))
        .savedApplications;
    } catch (e) {
      return {};
    }
  });
  const [filteredHistory, setFilteredHistory] = useState(
    // Object.keys(historyFromLocalStorage)
    []
  );

  const formatDate = (date) => {
    const dateArr = date.split("-");
    dateArr[1] = +dateArr[1] < 10 ? "0" + dateArr[1] : "" + dateArr[1];
    dateArr[2] = +dateArr[2] < 10 ? "0" + dateArr[2] : "" + dateArr[2];
    return dateArr.join("/");
  };

  const getAllDateSelections = useCallback(() => {
    let now = +new Date();
    const selections = [];
    for (let i = 0; i <= 30; i++) {
      const ts = now - 1000 * 60 * 60 * 24 * i;
      const prevDate = new Date(ts);
      const prevDateArr = [
        prevDate.getFullYear(),
        prevDate.getMonth(),
        prevDate.getDate(),
      ];

      let display;
      switch (i) {
        case 0:
          display = "今天";
          break;
        case 1:
          display = "昨天";
          break;
        default:
          display = formatDate(
            `${prevDateArr[0]}-${prevDateArr[1] + 1}-${prevDateArr[2]}`
          );
          break;
      }
      selections.push({ value: +new Date(...prevDateArr), display });
    }
    return selections;
  }, []);

  const handleDateSearch = () => {
    if (startDateTS === 0 || endDateTS === 0)
      return window.alert("請選擇開始日期與結束日期");
    if (endDateTS < startDateTS)
      return window.alert("結束日期不可早於開始日期");

    // window.alert(
    //   `開始日期: ${new Date(startDateTS)}, 結束日期: ${new Date(endDateTS)}`
    // );
    setCurrentPage(1);
    setFilteredHistory(() => {
      const _filterHistory = [];
      for (let savedDate in historyFromLocalStorage) {
        const savedDateArr = savedDate.split("-").map((e) => +e);
        savedDateArr[1]--;
        const savedDateTS = +new Date(...savedDateArr);
        if (savedDateTS >= startDateTS && savedDateTS <= endDateTS) {
          _filterHistory.push(savedDate);
        }
      }
      return _filterHistory;
    });
  };

  const numOfHistory = useMemo(
    () =>
      filteredHistory.reduce((acc, cur) => {
        acc += historyFromLocalStorage[cur].length;
        return acc;
      }, 0),
    [filteredHistory, historyFromLocalStorage]
  );

  const filteredHistoryArr = useMemo(
    () =>
      filteredHistory
        .map((savedDate) => [savedDate, historyFromLocalStorage[savedDate]])
        .reverse()
        .reduce((acc, [savedDate, apps]) => {
          const newAdded = apps.map((a) => ({ savedDate, ...a }));
          acc.push(...newAdded);
          return acc;
        }, []),
    [filteredHistory, historyFromLocalStorage]
  );

  const totalPages = Math.ceil(numOfHistory / numPerPage);

  const goToPage = ({ direction = "", page = 0 }) => {
    if (direction && direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction && direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (page) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="db-result-popup history-result-popup">
      <h4>近30天使用本系統之案件</h4>
      <p className="top-panel">
        <button
          onClick={() =>
            setFilteredHistory(Object.keys(historyFromLocalStorage))
          }
          className="display-all-btn"
        >
          顯示全部
        </button>
        <label htmlFor="num-per-page">每頁筆數&nbsp;</label>
        <select
          id="num-per-page"
          defaultValue={numPerPage}
          onChange={(e) => {
            setCurrentPage(1);
            setNumPerPage(+e.target.value);
          }}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="3">3</option>
        </select>
        <label htmlFor="start-date">開始日期&nbsp;</label>
        <select
          id="start-date"
          defaultValue={0}
          onChange={(e) => setStartDateTS(+e.target.value)}
        >
          <option value={0} disabled hidden>
            請選擇
          </option>
          {getAllDateSelections().map(({ value, display }) => (
            <option key={display} value={value}>
              {display}
            </option>
          ))}
        </select>
        <label htmlFor="end-date">&nbsp;&nbsp;結束日期&nbsp;</label>
        <select
          id="end-date"
          defaultValue={0}
          onChange={(e) => setEndDateTS(+e.target.value)}
        >
          <option value={0} disabled hidden>
            請選擇
          </option>
          {getAllDateSelections().map(({ value, display }) => (
            <option key={display} value={value}>
              {display}
            </option>
          ))}
        </select>
        <button onClick={handleDateSearch} className="handle-date-search">
          查詢
        </button>
      </p>
      <div>
        {filteredHistory.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: 25 }}>查無資料</p>
        ) : (
          <ul>
            <li>
              <p>日期</p>
              <p>
                {process.env.REACT_APP_SYSTEM_TYPE === "tipo" ? "案號" : ""}
              </p>
              <p>案件名稱</p>
            </li>
            {filteredHistoryArr
              .slice((currentPage - 1) * numPerPage, currentPage * numPerPage)
              .map(({ appId, appTitle, savedDate }, liIdx) => (
                <li key={liIdx}>
                  <p>{formatDate(savedDate)}</p>
                  <p>
                    {process.env.REACT_APP_SYSTEM_TYPE === "tipo" ? appId : ""}
                  </p>
                  <p>{appTitle}</p>
                </li>
              ))}
          </ul>
        )}
      </div>
      {filteredHistory.length > 0 && (
        <p className="bottom-panel">
          <span>
            查詢結果:&nbsp;
            {numOfHistory}&nbsp;筆
          </span>
          <span className="page-info">
            頁數: 第&nbsp;{currentPage}&nbsp;/&nbsp;
            {totalPages}
            &nbsp;頁
          </span>

          <label className="go-to-label">
            前往第&nbsp;
            <select onClick={(e) => goToPage({ page: +e.target.value })}>
              {Array(totalPages)
                .fill()
                .map((_, i) => i + 1)
                .map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
            </select>
            &nbsp;頁
          </label>

          <button
            onClick={() => goToPage({ direction: "prev" })}
            style={{
              pointerEvents: currentPage === 1 ? "none" : "auto",
            }}
            disabled={currentPage === 1}
          >
            前一頁
          </button>
          <button
            onClick={() => goToPage({ direction: "next" })}
            style={{
              pointerEvents: currentPage === totalPages ? "none" : "auto",
              marginLeft: 5,
            }}
            disabled={currentPage === totalPages}
          >
            下一頁
          </button>
        </p>
      )}
      <button onClick={() => handleClose(false)}>確認</button>
    </div>
  );
};

export default HistoryPopup;
