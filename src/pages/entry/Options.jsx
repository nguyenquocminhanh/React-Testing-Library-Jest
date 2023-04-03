import axios from "axios";
import { useEffect, useState } from "react";
import ScoopOption from "./ScoopOption";
import { Alert, Row } from "react-bootstrap";
import ToppingOption from "./ToppingOption";
import AlertBanner from "../common/AlertBanner";
import { pricePerItem } from "../../constants";
import { formatCurrency } from "../../utilities/index";
import { useOrderDetails } from "../../contexts/OrderDetails";

export default function Options({ optionType }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const { totals } = useOrderDetails();

  // optionType is 'scoops' or 'toppings'
  useEffect(() => {
    // create an abortController to attach to network request
    const controller = new AbortController();
    axios
      .get(`http://localhost:3030/${optionType}`, { signal: controller.signal })
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        if (error.name !== "CanceledError") {
          setError(true);
        }
      });

    // abort axios call on component unmount
    return () => {
      controller.abort();
    };
  }, [optionType]);

  if (error) {
    return <AlertBanner />;
  }

  const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase();

  return (
    <>
      <h2>{title}</h2>
      <p>{formatCurrency(pricePerItem[optionType])} each</p>
      <p>
        {title} total: {formatCurrency(totals[optionType])}
      </p>
      <Row>
        {optionType === "scoops"
          ? items.map((item) => (
              <ScoopOption
                key={item.name}
                name={item.name}
                imagePath={item.imagePath}
              />
            ))
          : null}

        {optionType === "toppings"
          ? items.map((item) => (
              <ToppingOption
                key={item.name}
                name={item.name}
                imagePath={item.imagePath}
              />
            ))
          : null}
      </Row>
    </>
  );
}
