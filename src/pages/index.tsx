import { Button, Grid, Link, Stack, Text } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import React, { useMemo, useState } from "react";
import { APIS } from "../../config/const";
import api from "../../products/api";
import { Product } from "../../products/types";

interface Props {
  products: Product[];
}

const IndexRoute: React.FC<Props> = ({ products }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const text = useMemo(
    () =>
      cart
        .reduce(
          (message, product) =>
            message.concat(`${product.title} - ${product.price}\n`),
          ""
        )
        .concat(
          `\nTotal: ${cart.reduce(
            (total, product) => total + product.price,
            0
          )}`
        ),
    [cart]
  );

  const parseCurrency = (value: number) => {
    return value.toLocaleString("da-DK", {
      style: "currency",
      currency: "DKK",
    });
  };

  const handleAddToCart = (product: Product) => {
    setCart((cart) => cart.concat(product));
  };

  const handleCheckout = () => {};

  return (
    <Stack maxWidth="72rem" mx="auto">
      <Grid gap={6} templateColumns="repeat(auto-fill, minmax(240px, 1fr))">
        {products.map((product) => (
          <Stack
            backgroundColor={"gray.100"}
            color={"blackAlpha.900"}
            borderRadius={4}
            align="center"
            justify="center"
            key={product.id}
            direction={["column", "row"]}
            spacing="24px"
          >
            <Text>{product.title}</Text>
            <Text>{parseCurrency(product.price)}</Text>
            <Button
              colorScheme="twitter"
              onClick={() => handleAddToCart(product)}
            >
              Add
            </Button>
          </Stack>
        ))}
      </Grid>
      {Boolean(cart.length) && (
        <Button
          as={Link}
          colorScheme="whatsapp"
          isExternal
          _hover={{ textDecoration: "none" }}
          href={`https://wa.me/${APIS.WHATSAPP}?text=${encodeURIComponent(
            text
          )}`}
          onClick={handleCheckout}
        >
          Ver carrito ({cart.length} productos)
        </Button>
      )}
    </Stack>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list();
  return {
    props: {
      products,
    },
  };
};

export default IndexRoute;
