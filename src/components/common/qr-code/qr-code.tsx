import { Input, QRCode, Space } from "antd";
import { useState } from "react";

const QrCode = () => {
  const [text, setText] = useState("https://ant.design/");

  return (
    <Space direction="vertical" align="center">
      <QRCode value={text || "-"} />
    </Space>
  );
};

export default QrCode;
