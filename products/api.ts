import axios from "axios";
import { Product } from "./types";
import Papa from "papaparse";
import { APIS } from "../config/const";

// eslint-disable-next-line
export default {
  list: async (): Promise<Product[]> => {
    return axios
      .get(APIS.GOOGLEAPI, { responseType: "blob" })
      .then((response) => {
        return new Promise<Product[]>((resolve, reject) => {
          Papa.parse(response.data, {
            header: true,
            complete: (results) => {
              const products = results.data as Product[];
              return resolve(
                products.map((product) => ({
                  ...product,
                  price: Number(product.price),
                }))
              );
            },
            error: (error) => {
              return reject(error.message);
            },
          });
        });
      });
  },
};
