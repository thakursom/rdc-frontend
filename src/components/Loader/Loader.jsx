import { Oval } from "react-loader-spinner";

function Loader() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      width: "100%"
    }}>
      <Oval
        height={50}
        width={50}
        ariaLabel="loading"
      />
    </div>
  );
}

export default Loader;
