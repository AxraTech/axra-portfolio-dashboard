import { gql } from "@apollo/client";
//get product brand
export const ALL_PRODUCT_BRAND = gql`
  query MyQuery($search: String!) {
    product_brand(
      where: { brand_name: { _ilike: $search } }
      order_by: { updated_at: desc }
    ) {
      brand_name
      id
      created_at
      image_url
      updated_at
    }
    product_brand_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get product brand pk
export const PRODUCT_BRAND_PK = gql`
  query product_brand_pk($id: Int!) {
    product_brand_by_pk(id: $id) {
      brand_name
      created_at
      id
      image_url
      updated_at
    }
  }
`;

//add product brand
export const ADD_PRODUCT_BRAND = gql`
  mutation add_product_brand($brand_name: String!, $image_url: String!) {
    insert_product_brand_one(
      object: { brand_name: $brand_name, image_url: $image_url }
    ) {
      brand_name
      image_url
    }
  }
`;

//edit product brand
export const EDIT_PRODCUT_BRAND = gql`
  mutation eidt_product_brand(
    $id: Int!
    $brand_name: String!
    $image_url: String!
  ) {
    update_product_brand_by_pk(
      pk_columns: { id: $id }
      _set: { brand_name: $brand_name, image_url: $image_url }
    ) {
      brand_name
      created_at
      id
      image_url
      updated_at
    }
  }
`;

//remove product brand
export const DELETE_PRODCUT_BRAND = gql`
  mutation delete_product_brand($id: Int!) {
    delete_product_brand_by_pk(id: $id) {
      id
    }
  }
`;
