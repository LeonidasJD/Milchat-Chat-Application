import { Typography } from "antd";
import "./page-header.scss";
interface HeaderProps {
  title: string;
  backgroundColor: string;
  fontColor?: string;
}

const PageHeader: React.FC<HeaderProps> = ({
  title,
  backgroundColor,
  fontColor,
}) => {
  return (
    <div className="profile-header-wrapper">
      <div className="wrapper" style={{ backgroundColor: backgroundColor }}>
        <Typography.Paragraph style={{ color: fontColor }}>
          {title}
        </Typography.Paragraph>
      </div>
    </div>
  );
};

export default PageHeader;
