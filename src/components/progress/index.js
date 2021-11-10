import React from "react";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
const Index = React.memo(
  ({ totalSupply = 0, tokenSold = 0, account = false }) => {
    const total = new Intl.NumberFormat("en-GB", {
      notation: "compact",
      compactDisplay: "short",
    }).format(totalSupply);

    const total2 = new Intl.NumberFormat("en-GB", {
      notation: "compact",
      compactDisplay: "short",
    }).format(tokenSold);
    // console.log("TOTALSUPPLE", totalSupply / 100);

    const value = (Number(tokenSold) * 100) / Number(totalSupply);

    // console.log(value);
    const BorderLinearProgress = withStyles((theme) => ({
      root: {
        height: 10,
        borderRadius: 5,
      },
      colorPrimary: {
        backgroundColor: "lightgray",
      },
      bar: {
        borderRadius: 5,
        backgroundColor: "#700da8",
      },
    }))(LinearProgress);

    return (
      <div className="my-4 mb-6 dark:text-gray-50 capitalize">
        <div className="flex mb-1 justify-between items-center">
          <span>{total2}</span>
          <span>{total}</span>
        </div>

        <BorderLinearProgress
          variant="determinate"
          value={
            value
              ? value < 100
                ? value > 1
                  ? Math.floor(value) + 1
                  : 2
                : 100
              : 0
          }
        />
        <div className="flex mt-1 justify-between items-center">
          <span>Total Sold</span>
          <span>ICO Target</span>
        </div>
      </div>
    );
  }
);

export default Index;
