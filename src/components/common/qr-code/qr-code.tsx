import { QRCode, Space } from "antd";

const QrCode = () => {
  const text = "https://milchat-82eed.web.app";

  return (
    <Space direction="vertical" align="center">
      <QRCode value={text || "-"} />
    </Space>
  );
};

export default QrCode;
