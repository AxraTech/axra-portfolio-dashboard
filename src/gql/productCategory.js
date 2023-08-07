import { gql } from "@apollo/client";
//get product cat
export const ALL_PRODUCT_CAT = gql`
  query MyQuery($search: String!) {
    product_category(
      where: { product_category_name: { _ilike: $search } }
      order_by: { updated_at: desc }
    ) {
      created_at
      id
      image_url
      product_category_name
      updated_at
    }
    product_category_aggregate {
      aggregate {
        count
      }
    }
  }
`;

//get product cat pk
export const PRODUCT_CAT_PK = gql`
  query MyQuery($id: Int!) {
    product_category_by_pk(id: $id) {
      created_at
      image_url
      id
      product_category_name
      updated_at
    }
  }
`;

//delete product cat
export const DELETE_PRODUCT_CAT = gql`
  mutation MyMutation($id: Int!) {
    delete_product_category_by_pk(id: $id) {
      id
    }
  }
`;

//add product brand
export const ADD_PRODUCT_CAT = gql`
  mutation add_product_category(
    $product_category_name: String!
    $image_url: String!
  ) {
    insert_product_category_one(
      object: {
        product_category_name: $product_category_name
        image_url: $image_url
      }
    ) {
      product_category_name
      image_url
    }
  }
`;

//edit product brand
export const EDIT_PRODCUT_CAT = gql`
  mutation eidt_product_category(
    $id: Int!
    $product_category_name: String!
    $image_url: String!
  ) {
    update_product_category_by_pk(
      pk_columns: { id: $id }
      _set: {
        product_category_name: $product_category_name
        image_url: $image_url
      }
    ) {
      product_category_name
      created_at
      id
      image_url
      updated_at
    }
  }
`;
