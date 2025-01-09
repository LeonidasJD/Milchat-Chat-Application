import { Image, Typography } from "antd";
import PageHeader from "../../common/page-header/page-header";
import CreatorImage from "../../../assets/about-us/creator.jpg";
import useAboutUs from "./useAboutUs";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import GlobalLoader from "../../common/global-loader/global-loader.tsx";
import "./about-us.scss";

const AboutUs = () => {
  const { isLoading } = useAboutUs();
  const aboutUsText = useSelector((state: RootState) => state.aboutUsText.text);
  console.log("aboutUsText redux", aboutUsText);

  return (
    <>
      <PageHeader
        title="About Creator"
        backgroundColor="#2e1b3e"
        fontColor="white"
      />

      <div className="about-data-wrapper">
        <Image width={200} height={200} src={CreatorImage}></Image>

        {isLoading ? (
          <GlobalLoader />
        ) : (
          <div className="about-us-content">
            <Typography.Paragraph>{aboutUsText?.text}</Typography.Paragraph>
          </div>
        )}
      </div>
    </>
  );
};

export default AboutUs;
