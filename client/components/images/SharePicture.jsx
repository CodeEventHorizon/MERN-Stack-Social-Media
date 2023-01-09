const SharePicture = ({ url }) => (
  <div
    style={{
      backgroundImage: "url(" + url + ")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      backgroundSize: "cover",
      height: "290px",
    }}
  ></div>
);

export default SharePicture;
