import { QRCode, Space } from "antd";

const QrCode = () => {
  const text = "https://ant.design/";

  return (
    <Space direction="vertical" align="center">
      <QRCode value={text || "-"} />
    </Space>
  );
};

export default QrCode;
